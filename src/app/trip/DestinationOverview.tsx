import { ActivitiesItinerary, ArrivalDepartureOverview, HeroView } from "@/components";
import { CardView, Collapsable, IconTitleValue, TextType, ThemedText, ThemedView } from "@/components/ui";
import { dateDiff, displayDate, sanitizeUrl } from "@/helpers";
import { getThemeProperty, useMapContext, useTripContext } from "@/hooks";
import { TripService } from "@/services/TripService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function DestinationOverview() {
  const { t } = useTranslation();
  const { destinationId } = useLocalSearchParams();
  const { destinations, transportations } = useTripContext();
  const { fitDestination } = useMapContext();

  const destination = useMemo(() => destinations?.find((d) => d.id === destinationId), [destinationId, destinations]);
  const accommodations = destination?.accommodations;
  const activities = destination?.activities;

  const arrival = useMemo(
    () => transportations?.find((t) => destination?.id === t.arrivalDestinationId),
    [transportations, destination],
  );

  const departure = useMemo(
    () => transportations?.find((t) => destination?.id === t.departureDestinationId),
    [transportations, destination],
  );

  useEffect(() => {
    if (destination) {
      fitDestination(destination);
    }
  }, [destination, fitDestination]);

  return (
    <HeroView headerImageUrl={TripService.getPhotoForPlace(destination?.place.images)}>
      <ThemedView style={styles.header}>
        <ThemedText type={TextType.Display}>{destination?.place.name}</ThemedText>
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
          <IconTitleValue icon="bed" value={t("yourStay")} valueType={TextType.Title} />
          {accommodations?.length &&
            accommodations.map((a) => (
              <CardView key={a.id}>
                <Collapsable
                  header={
                    <ThemedView style={{}}>
                      <IconTitleValue
                        icon="bed"
                        value={a.name ?? a.place?.name}
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
                      {a.place?.address && (
                        <IconTitleValue url={a.place?.mapsUrl} value={a.place.address} title={t("address")} />
                      )}
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

        {/* Arrival */}
        <ThemedView style={styles.sectionTitle}>
          <IconTitleValue icon="plane" value={t("transit")} valueType={TextType.Title} />
          {destination && arrival && (
            <ArrivalDepartureOverview destination={destination} transportation={arrival} type="arrival" />
          )}
          {/* Departure */}
          {destination && departure && (
            <ArrivalDepartureOverview destination={destination} transportation={departure} type="departure" />
          )}
        </ThemedView>

        {/* Activities */}
        <ThemedView style={styles.sectionTitle}>
          <IconTitleValue icon="map" value={t("activities")} valueType={TextType.Title} />
          {activities && <ActivitiesItinerary activities={activities} />}
        </ThemedView>
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
  body: {
    padding: largeSpacing,
    gap: largeSpacing,
  },
  mediumSpacingGap: {
    gap: mediumSpacing,
  },
  sectionTitle: {
    gap: smallSpacing,
  },
  inlineInfo: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
});
