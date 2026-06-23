import { HeroView } from "@/components";
import {
  ButtonType,
  CardSeeMore,
  CardView,
  Collapsable,
  ExternalLink,
  HorizontalDivider,
  Icon,
  IconCaptionText,
  IconSymbols,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { baseStyle } from "@/constants";
import { Colors, spacing } from "@/constants/theme";
import { displayDate, getCurrencySymbol, getOpenStatus, sanitizeUrl } from "@/helpers";
import { useInternalRouterContext, useMapContext, useTripContext } from "@/hooks";
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
  const { activities, destinations, setActivity, setDestination, removeActivity, removeDestination } = useTripContext();
  const [place, setPlace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);
  const activity = useMemo(() => activities?.find((a) => a.placeId === placeId), [activities, placeId]);
  const destination = useMemo(() => destinations?.find((d) => d.placeId === placeId), [destinations, placeId]);
  const { currentDestinationId, currentTripId } = useInternalRouterContext();
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

  const saveButtonHandler = async () => {
    if (place.name === place.vicinity) {
      saveDestination();
    } else {
      saveActivity();
    }
  };

  const saveActivity = async () => {
    if (!currentTripId || !currentDestinationId) {
      return;
    }

    if (activity?.id) {
      console.log("Unsave activity");
      await TripService.deleteActivity(currentTripId, currentDestinationId, activity.id);
      removeActivity(currentDestinationId, activity.id);
    } else {
      console.log("save activity");
      const savedActivity = await TripService.setActivity(currentTripId, currentDestinationId, {
        placeId: place.id,
        name: place.name,
        coordinates: place.coordinates,
        address: place.address,
        website: place.website,
      });
      setActivity(currentDestinationId, savedActivity);
    }
  };

  const saveDestination = async () => {
    if (!currentTripId) {
      return;
    }

    if (destination?.id) {
      console.log("Unsave destination");
      await TripService.deleteDestination(currentTripId, destination.id);
      removeDestination(destination.id);
    } else {
      console.log("save destination");
      const savedDestination = await TripService.setDestination(currentTripId, {
        placeId: place.id,
        name: place.name,
        coordinates: place.coordinates,
        startDate: destinations![destinations!.length - 1].endDate,
        endDate: destinations![destinations!.length - 1].endDate,
      });
      setDestination(savedDestination);
    }
  };

  return (
    <HeroView headerImageUrl={TripService.getPhotoForPlace(place.images) ?? ""}>
      <ThemedView style={baseStyle.viewHeader}>
        <ThemedText type={TextType.Display}>{activity?.name ?? destination?.name ?? place.name}</ThemedText>
        {place?.rating && (
          <ThemedView style={baseStyle.inlineSectionGap}>
            <ThemedText type={TextType.Footnote}>{place.rating}</ThemedText>
            <ThemedView style={styles.ratingStars}>
              <Icon size={14} name={getStarIconForRating(0, place.rating)} color={Colors.yellow} />
              <Icon size={14} name={getStarIconForRating(1, place.rating)} color={Colors.yellow} />
              <Icon size={14} name={getStarIconForRating(2, place.rating)} color={Colors.yellow} />
              <Icon size={14} name={getStarIconForRating(3, place.rating)} color={Colors.yellow} />
              <Icon size={14} name={getStarIconForRating(4, place.rating)} color={Colors.yellow} />
            </ThemedView>
          </ThemedView>
        )}
        {place.categories?.[0] && <ThemedText type={TextType.Footnote}>{place.categories[0]}</ThemedText>}
      </ThemedView>
      <ThemedView background style={baseStyle.viewBody}>
        <ThemedView style={[baseStyle.inlineSectionGap, { gap: spacing.largeExtra }]}>
          <ThemedButton
            title={(activity ?? destination) ? t("saved") : t("save")}
            icon={(activity ?? destination) ? "heart" : "heartEmpty"}
            type={ButtonType.Primary}
            round
            onPress={() => saveButtonHandler()}
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
        <ThemedView style={baseStyle.titleSectionGap}>
          <IconCaptionText text={t("yourTrip")} icon="pin" textType={TextType.Title} />
          {activity && (
            <CardView style={baseStyle.smallGap}>
              <IconCaptionText
                icon="calendar"
                caption={t("scheduledFor")}
                text={activity.scheduledAt ? displayDate(activity.scheduledAt, "ddd DD MMM • HH:mm") : " - "}
              />
              {activity.ticketRequired !== undefined && (
                <Fragment>
                  <HorizontalDivider />
                  <IconCaptionText
                    icon="calendar"
                    caption={t("isTicketRequired")}
                    text={activity.ticketRequired ? t("required") : t("notRequired")}
                  />
                </Fragment>
              )}
              {activity.ticketRequired === true && (
                <Fragment>
                  <HorizontalDivider />
                  <IconCaptionText
                    icon="calendar"
                    caption={t("isTicketBought")}
                    text={activity.ticketPurchased ? t("purchased") : t("notPurchased")}
                  />
                </Fragment>
              )}
              <HorizontalDivider />
              <IconCaptionText
                icon="money"
                caption={t("price")}
                text={
                  activity.price
                    ? `${getCurrencySymbol(activity.price?.currency)} ${activity.price?.value.toFixed(2)}`
                    : " - "
                }
              />
            </CardView>
          )}
          {!(activity || destination) && (
            <CardView style={styles.notInTripContainer}>
              <IconCaptionText icon="pin" text={t("notInTripYet")} textType={TextType.Headline} />
              <ThemedButton
                onPress={() => {}}
                title={t("add")}
                icon={"plus"}
                type={ButtonType.Secondary}
              ></ThemedButton>
            </CardView>
          )}
        </ThemedView>

        <ThemedView style={baseStyle.titleSectionGap}>
          <IconCaptionText text={t("details")} icon="info" textType={TextType.Title} />
          {(place.address || place.phoneNumber || place.website) && (
            <CardView style={baseStyle.smallGap}>
              {place.address && (
                <ThemedView>
                  <IconCaptionText icon="map" text={t("address")} textType={TextType.Headline} />
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
                        <IconCaptionText icon="clock" text={t("openingHours")} textType={TextType.Headline} />
                        <ThemedView style={baseStyle.inlineSectionGap}>
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
                      <ThemedView key={d} style={baseStyle.inlineSectionSpaceBetween}>
                        <ThemedText type={TextType.Footnote}>
                          {t("weekday." + d.split(": ")[0].toLowerCase())}
                        </ThemedText>
                        <ThemedText type={TextType.Footnote}>{d.split(": ")[1]}</ThemedText>
                      </ThemedView>
                    ))}
                  />
                </ThemedView>
              )}
              {place.openingHours && (place.website || place.phoneNumber) && <HorizontalDivider />}
              {place.phoneNumber && (
                <ThemedView>
                  <IconCaptionText icon="phone" text={t("phone")} textType={TextType.Headline} />
                  <ExternalLink href={`tel:${place.phoneNumber}`} displayText={place.phoneNumber} />
                </ThemedView>
              )}
              {place.phoneNumber && place.website && <HorizontalDivider />}
              {place.website && (
                <ThemedView>
                  <IconCaptionText icon="globe" text={t("website")} textType={TextType.Headline} />
                  <ExternalLink href={place.website} displayText={sanitizeUrl(place.website)} />
                </ThemedView>
              )}
            </CardView>
          )}
        </ThemedView>

        {place.description && (
          <ThemedView style={baseStyle.titleSectionGap}>
            <IconCaptionText text={t("about")} icon="book" textType={TextType.Title} />
            {place.description && <CardSeeMore numberOfLines={4} content={place.description} />}
          </ThemedView>
        )}
      </ThemedView>
    </HeroView>
  );
}

const styles = StyleSheet.create({
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 50,
    height: 50,
  },
  notInTripContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    gap: spacing.small,
  },
});
