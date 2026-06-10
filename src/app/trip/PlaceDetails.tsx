import { HeroView } from "@/components";
import {
  ButtonType,
  CardSeeMore,
  CardView,
  Collapsable,
  ExternalLink,
  HorizontalDivider,
  Icon,
  IconSymbols,
  IconTitleValue,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { Colors } from "@/constants/theme";
import { displayDate, getOpenStatus, sanitizeUrl } from "@/helpers";
import { getThemeProperty, useMapContext, useTripContext } from "@/hooks";
import { Place } from "@/models";
import { MapService } from "@/services";
import { TripService } from "@/services/TripService";
import { useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Linking, StyleSheet } from "react-native";

export default function PlaceDetails() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);
  const { activities } = useTripContext();
  const activity = useMemo(() => activities?.find((a) => a.placeId === placeId), [activities, placeId]);
  const placeOpenStatus = place?.openingHours && getOpenStatus(place?.openingHours);
  const { t } = useTranslation();
  const { focusPlaceMarker } = useMapContext();

  useEffect(() => {
    const fetchPlace = async () => {
      if (!placeId || place?.id === placeId || loading) {
        return;
      }
      try {
        setLoading(true);
        const responsePlace = await MapService.getPlaceDetails(placeId);
        setPlace(responsePlace);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [loading, place?.id, placeId]);

  useEffect(() => {
    focusPlaceMarker(place);
  }, [place, focusPlaceMarker]);

  if (!place) {
    console.log("No place", place, placeId);
    return <ActivityIndicator />;
  }

  const getStarIconForRating = (baseStarRating: number, rating: number): keyof IconSymbols => {
    if (rating < baseStarRating) {
      return "starEmpty";
    }
    if (rating <= baseStarRating + 0.5) {
      return "starhalf";
    }
    return "star";
  };

  const openBrowser = async (url?: string) => {
    if (!url) {
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await openBrowserAsync(url);
    }
  };

  return (
    <HeroView headerImageUrl={TripService.getPhotoForPlace(activity?.place?.images || place.images) ?? ""}>
      <ThemedView style={styles.header}>
        <ThemedText type={TextType.Display}>{activity?.name ?? place.name}</ThemedText>
        {place?.rating && (
          <ThemedView style={styles.rating}>
            <ThemedText type={TextType.Footnote} style={{ marginRight: smallSpacing }}>
              {place.rating}
            </ThemedText>
            <Icon size={14} name={getStarIconForRating(0, place.rating)} color={Colors.yellow} />
            <Icon size={14} name={getStarIconForRating(1, place.rating)} color={Colors.yellow} />
            <Icon size={14} name={getStarIconForRating(2, place.rating)} color={Colors.yellow} />
            <Icon size={14} name={getStarIconForRating(3, place.rating)} color={Colors.yellow} />
            <Icon size={14} name={getStarIconForRating(4, place.rating)} color={Colors.yellow} />
          </ThemedView>
        )}
        {place.categories?.[0] && <ThemedText type={TextType.Footnote}>{place.categories[0]}</ThemedText>}
      </ThemedView>
      <ThemedView background style={styles.body}>
        <ThemedView style={styles.inlineInfo}>
          <ThemedButton
            title={activity ? t("saved") : t("save")}
            icon={activity ? "heart" : "heartEmpty"}
            type={ButtonType.Primary}
            round
            onPress={() => console.log("Save")}
            style={styles.actionButton}
          />
          {place.mapsUrl && (
            <ThemedButton
              title={t("directions")}
              icon={"map"}
              type={ButtonType.Secondary}
              round
              onPress={() => openBrowser(place.mapsUrl)}
              style={styles.actionButton}
            />
          )}
          {place.phoneNumber && (
            <ThemedButton
              title={t("call")}
              icon={"phone"}
              type={ButtonType.Secondary}
              round
              onPress={() => openBrowser(`tel:${place.phoneNumber}`)}
              style={styles.actionButton}
            />
          )}
          {place.website && (
            <ThemedButton
              title={t("website")}
              icon={"globe"}
              type={ButtonType.Secondary}
              round
              onPress={() => openBrowser(place.website)}
              style={styles.actionButton}
            />
          )}
        </ThemedView>
        <ThemedView style={styles.titleCardContainer}>
          <IconTitleValue value={t("yourTrip")} icon="pin" valueType={TextType.Title} />
          {activity && (
            <CardView style={styles.infoCard}>
              <IconTitleValue
                icon="calendar"
                title={t("scheduledFor")}
                value={activity.scheduledAt ? displayDate(activity.scheduledAt, "ddd DD MMM • HH:mm") : " - "}
              />
              {activity.ticketRequired !== undefined && (
                <Fragment>
                  <HorizontalDivider />
                  <IconTitleValue
                    icon="calendar"
                    title={t("isTicketRequired")}
                    value={activity.ticketRequired ? t("required") : t("notRequired")}
                  />
                </Fragment>
              )}
              {activity.ticketRequired === true && (
                <Fragment>
                  <HorizontalDivider />
                  <IconTitleValue
                    icon="calendar"
                    title={t("isTicketBought")}
                    value={activity.ticketPurchased ? t("purchased") : t("notPurchased")}
                  />
                </Fragment>
              )}
              <HorizontalDivider />
              <IconTitleValue icon="price" title={t("price")} value={activity.price?.value.toFixed(2) ?? " - "} />
            </CardView>
          )}
          {!activity && (
            <CardView style={styles.notInTripContainer}>
              <IconTitleValue icon="pin" value={t("notInTripYet")} valueType={TextType.Headline} />
              <ThemedButton
                onPress={() => {}}
                title={t("add")}
                icon={"plus"}
                type={ButtonType.Secondary}
              ></ThemedButton>
            </CardView>
          )}
        </ThemedView>

        <ThemedView style={styles.titleCardContainer}>
          <IconTitleValue value={t("details")} icon="info" valueType={TextType.Title} />
          {(place.address || place.phoneNumber || place.website) && (
            <CardView style={styles.infoCard}>
              {place.address && (
                <ThemedView>
                  <IconTitleValue icon="map" value={t("address")} valueType={TextType.Headline} />
                  {place.mapsUrl && <ExternalLink href={place.mapsUrl} displayText={place.address} />}
                  {!place.mapsUrl && <ThemedText>{place.address}</ThemedText>}
                </ThemedView>
              )}
              {place.address && (place.openingHours || place.website || place.phoneNumber) && <HorizontalDivider />}
              {place.openingHours && (
                <ThemedView>
                  <Collapsable
                    header={
                      <ThemedView>
                        <IconTitleValue icon="clock" value={t("openingHours")} valueType={TextType.Headline} />
                        <ThemedView style={styles.inlineInfo}>
                          {placeOpenStatus?.isOpen === true && (
                            <ThemedText color={Colors.green}>{t("openNow")}</ThemedText>
                          )}
                          {placeOpenStatus?.isOpen === false && (
                            <ThemedText color={Colors.red}>{t("closedNow")} </ThemedText>
                          )}
                          <ThemedText>{"•"}</ThemedText>
                          <ThemedText>
                            {placeOpenStatus?.isOpen ? t("closesAt") : t("opensAt")}{" "}
                            {placeOpenStatus?.nextChange?.time.slice(0, 2)}
                            {":"}
                            {placeOpenStatus?.nextChange?.time.slice(2)}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                    }
                    body={place.openingHours.weekday_text.map((d) => (
                      <ThemedView key={d} style={[styles.inlineInfo, { justifyContent: "space-between" }]}>
                        <ThemedText type={TextType.Footnote}>{t(d.split(": ")[0])}</ThemedText>
                        <ThemedText type={TextType.Footnote}>{d.split(": ")[1]}</ThemedText>
                      </ThemedView>
                    ))}
                  />
                </ThemedView>
              )}
              {place.openingHours && (place.website || place.phoneNumber) && <HorizontalDivider />}
              {place.phoneNumber && (
                <ThemedView>
                  <IconTitleValue icon="phone" value={t("phone")} valueType={TextType.Headline} />
                  <ExternalLink href={`tel:${place.phoneNumber}`} displayText={place.phoneNumber} />
                </ThemedView>
              )}
              {place.phoneNumber && place.website && <HorizontalDivider />}
              {place.website && (
                <ThemedView>
                  <IconTitleValue icon="globe" value={t("website")} valueType={TextType.Headline} />
                  <ExternalLink href={place.website} displayText={sanitizeUrl(place.website)} />
                </ThemedView>
              )}
            </CardView>
          )}
        </ThemedView>

        {place.description && (
          <ThemedView style={styles.titleCardContainer}>
            <IconTitleValue value={t("about")} icon="book" valueType={TextType.Title} />
            {place.description && <CardSeeMore numberOfLines={4} content={place.description} />}
          </ThemedView>
        )}
      </ThemedView>
    </HeroView>
  );
}
const largeSpacing = getThemeProperty("largeSpacing");
const mediumSpacing = getThemeProperty("mediumSpacing");
const smallSpacing = getThemeProperty("smallSpacing");
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: largeSpacing,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  body: {
    padding: largeSpacing,
    gap: largeSpacing,
  },
  actionButton: {
    width: 50,
    height: 50,
  },
  titleCardContainer: {
    gap: smallSpacing,
  },
  notInTripContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    gap: mediumSpacing,
  },
  inlineInfo: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
  infoCard: {
    gap: mediumSpacing,
  },
});
