import { ActivitiesItinerary, ArrivalDepartureOverview, HeroView } from "@/components";
import { CardView, Collapsable, IconTitleValue, SectionTitle, TextType, ThemedText, ThemedView } from "@/components/ui";
import { dateDiff, displayDate, sanitizeUrl } from "@/helpers";
import { getThemeProperty, useMapContext, useTripContext } from "@/hooks";
import { Place } from "@/models";
import { MapService } from "@/services";
import { TripService } from "@/services/TripService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function DestinationOverview() {
  const { t } = useTranslation();
  const { destinationId } = useLocalSearchParams();
  const { destinations, transportations } = useTripContext();
  const { focusDestinationMarkers } = useMapContext();
  const [place, setPlace] = useState<Place>();

  const destination = useMemo(() => destinations?.find((d) => d.id === destinationId), [destinationId, destinations]);
  const accommodations = destination?.accommodations ?? [];
  const activities = destination?.activities ?? [];

  const arrival = useMemo(
    () => transportations?.find((t) => destination?.id === t.arrivalDestinationId),
    [transportations, destination],
  );

  const departure = useMemo(
    () => transportations?.find((t) => destination?.id === t.departureDestinationId),
    [transportations, destination],
  );

  useEffect(() => {
    focusDestinationMarkers(destination);
  }, [destination, focusDestinationMarkers]);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!destination?.placeId || place?.id === destination.placeId) {
        return;
      }
      try {
        const responsePlace = await MapService.getPlaceDetails(destination.placeId as string);
        console.log("fetich destination");
        setPlace(responsePlace);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };
    fetchPlace();
  }, [destination?.placeId, place?.id]);

  return (
    <HeroView headerImageUrl={TripService.getPhotoForPlace(place?.images)}>
      <ThemedView style={styles.header}>
        <ThemedText type={TextType.Display}>{destination?.name}</ThemedText>
        <ThemedView style={styles.inlineInfo}>
          <ThemedText type={TextType.Headline}>
            {destination?.startDate && displayDate(destination.startDate, "DD MMM")}
            {" - "}
            {destination?.endDate && displayDate(destination.endDate, "DD MMM")}
          </ThemedText>
          {destination?.endDate && destination?.startDate && (
            <ThemedText type={TextType.Footnote}>
              {dateDiff(destination.endDate, destination.startDate)}{" "}
              {t("night", {
                count: dateDiff(destination.endDate, destination.startDate),
              })}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.body}>
        {/* Accommodations */}
        <ThemedView style={styles.sectionTitle}>
          <SectionTitle icon="bed" value={t("yourStay")} valueType={TextType.Title} />
          {accommodations.length === 0 && (
            <CardView style={styles.notInTripContainer}>
              <ThemedText type={TextType.Body} style={styles.textCenter}>
                {t("noAccommodation")}
              </ThemedText>
            </CardView>
          )}
          {accommodations.length > 0 &&
            accommodations.map((a) => (
              <CardView key={a.id}>
                <Collapsable
                  header={
                    <ThemedView style={{}}>
                      <IconTitleValue
                        icon="bed"
                        value={a.name}
                        displayTitleAfterText
                        valueType={TextType.Headline}
                        title={
                          a.checkIn &&
                          a.checkOut &&
                          `${dateDiff(a.checkOut, a.checkIn) + 1} ${t("night", { count: dateDiff(a.checkOut, a.checkIn) + 1 })} · ` +
                            `${displayDate(a.checkIn, "DD MMM")}  -  ${displayDate(a.checkOut, "DD MMM")}`
                        }
                      />
                    </ThemedView>
                  }
                  body={
                    <ThemedView style={styles.mediumSpacingGap}>
                      <ThemedView style={styles.inlineInfo}>
                        <IconTitleValue
                          value={(a.checkIn && displayDate(a.checkIn, "DD MMM HH:mm")) ?? ""}
                          title={t("checkIn")}
                        />
                        <IconTitleValue
                          value={(a.checkOut && displayDate(a.checkOut, "DD MMM HH:mm")) ?? ""}
                          title={t("checkOut")}
                        />
                      </ThemedView>
                      {a.address && <IconTitleValue value={a.address} title={t("address")} />}
                      {a.website && (
                        <IconTitleValue url={a.website} value={sanitizeUrl(a.website)} title={t("reservation")} />
                      )}
                      {a.notes && <IconTitleValue value={a.notes} title={t("notes")} />}
                    </ThemedView>
                  }
                />
              </CardView>
            ))}
        </ThemedView>

        {/* Transit */}
        <ThemedView style={styles.sectionTitle}>
          <SectionTitle icon="plane" value={t("transit")} valueType={TextType.Title} />
          {destination && arrival && (
            <ArrivalDepartureOverview destination={destination} transportation={arrival} type="arrival" />
          )}
          {/* Departure */}
          {destination && departure && (
            <ArrivalDepartureOverview destination={destination} transportation={departure} type="departure" />
          )}
          {!destination ||
            (!arrival && !departure && (
              <CardView style={styles.notInTripContainer}>
                <ThemedText type={TextType.Body} style={styles.textCenter}>
                  {t("noTransit")}
                </ThemedText>
              </CardView>
            ))}
        </ThemedView>

        {/* Activities */}
        <ThemedView style={styles.sectionTitle}>
          <SectionTitle icon="map" value={t("activities")} valueType={TextType.Title} />
          {activities.length === 0 && (
            <CardView style={styles.notInTripContainer}>
              <ThemedText type={TextType.Body} style={styles.textCenter}>
                {t("noActivities")}
              </ThemedText>
            </CardView>
          )}
          {activities.length > 0 && <ActivitiesItinerary activities={activities} />}
        </ThemedView>
      </ThemedView>
    </HeroView>
  );
}

const largeSpacing = getThemeProperty("largeSpacing");
const mediumSpacing = getThemeProperty("mediumSpacing");
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: largeSpacing,
  },
  body: {
    padding: largeSpacing,
    gap: largeSpacing,
  },
  mediumSpacingGap: {
    gap: mediumSpacing,
  },
  sectionTitle: {
    gap: mediumSpacing,
  },
  inlineInfo: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
  notInTripContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    gap: mediumSpacing,
  },
  textCenter: {
    textAlign: "center",
  },
});
