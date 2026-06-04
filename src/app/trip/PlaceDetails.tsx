import { HeroView } from "@/components";
import {
  ButtonType,
  CardView,
  ExternalLink,
  HorizontalDivider,
  Icon,
  IconTitleValue,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { sanitizeUrl } from "@/helpers";
import { getThemeProperty, useTripContext } from "@/hooks";
import { Place } from "@/models";
import { MapService } from "@/services";
import { TripService } from "@/services/TripService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function PlaceDetails() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);
  const { activities } = useTripContext();
  const activity = useMemo(() => activities?.find((a) => a.placeId === placeId), [activities, placeId]);

  const fetchPlace = async () => {
    if (!placeId || place?.id === placeId || loading) {
      return;
    }
    try {
      setLoading(true);
      const responsePlace = await MapService.getPlaceDetails(placeId);
      setPlace(responsePlace);
      console.log(responsePlace.name);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlace();
  }, [placeId]);

  if (!place) {
    console.log("No place", place, placeId);
    return <ActivityIndicator />;
  }

  return (
    <HeroView headerImageUrl={TripService.getPhotoForPlace(activity?.place?.images || place.images) ?? ""}>
      <ThemedView style={styles.header}>
        <ThemedText type={TextType.Title}>{activity?.name ?? place.name}</ThemedText>
        {place.categories?.[0] && <ThemedText type={TextType.Caption}>{place.categories[0]}</ThemedText>}
        {place?.rating && (
          <ThemedView style={styles.inlineInfo}>
            <Icon size={14} name="star" />
            <ThemedText type={TextType.Footnote}>{place.rating} / 5</ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.inlineInfo}>
          {activity && (
            <ThemedButton title="Remove" icon="trash" type={ButtonType.Delete} onPress={() => console.log("add")} />
          )}
          {!activity && <ThemedButton title="Add" icon="plus" onPress={() => console.log("add")} />}
          <ThemedButton
            title="Go To Website"
            icon="globe"
            type={ButtonType.Secondary}
            onPress={() => console.log("web")}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView background style={styles.body}>
        {place.description && (
          <CardView style={styles.infoCard}>
            <IconTitleValue icon="info" value={"Description"} valueType={TextType.Headline}></IconTitleValue>
            <ThemedText>{place.description}</ThemedText>
          </CardView>
        )}
        {(place.phoneNumber || place.website || place.address) && (
          <CardView style={styles.infoCard}>
            {place.phoneNumber && (
              <ThemedView style={styles.infoSection}>
                <IconTitleValue icon="phone" value={"Phone"} valueType={TextType.Headline}></IconTitleValue>
                <ExternalLink href={`tel:${place.phoneNumber}`} displayText={place.phoneNumber} />
              </ThemedView>
            )}
            {place.phoneNumber && (place.website || place.address) && <HorizontalDivider />}
            {place.website && (
              <ThemedView style={styles.infoSection}>
                <IconTitleValue icon="globe" value={"Website"} valueType={TextType.Headline}></IconTitleValue>
                <ExternalLink href={place.website} displayText={sanitizeUrl(place.website)} />
              </ThemedView>
            )}
            {place.website && place.address && <HorizontalDivider />}
            {place.address && (
              <ThemedView style={styles.infoSection}>
                <IconTitleValue icon="map" value={"Address"} valueType={TextType.Headline}></IconTitleValue>
                {place.mapsUrl && <ExternalLink href={place.mapsUrl} displayText={place.address} />}
                {!place.mapsUrl && <ThemedText>{place.address}</ThemedText>}
              </ThemedView>
            )}
          </CardView>
        )}
      </ThemedView>
    </HeroView>
  );
}
const mediumSpacing = getThemeProperty("mediumSpacing");
const smallSpacing = getThemeProperty("smallSpacing");
const styles = StyleSheet.create({
  header: {
    padding: mediumSpacing,
    gap: smallSpacing,
  },
  inlineInfo: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
  body: {
    padding: mediumSpacing,
    gap: smallSpacing,
  },
  infoCard: {
    gap: mediumSpacing,
  },
  infoSection: {
    gap: smallSpacing,
  },
});
