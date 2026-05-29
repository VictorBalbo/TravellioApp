import { HeroView } from "@/components";
import {
  ButtonType,
  CardCollapsable,
  CardList,
  Icon,
  IconTitleValue,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { dateDiff, displayDate } from "@/helpers";
import { getThemeProperty, useTripContext } from "@/hooks";
import { TripService } from "@/services/TripService";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function DestinationOverview() {
  const { t } = useTranslation();
  const { destinationId } = useLocalSearchParams();
  const { destinations, transportations } = useTripContext();

  const destination = useMemo(
    () => destinations?.find((d) => d.id === destinationId),
    [destinationId, destinations],
  );

  const accommodations = useMemo(
    () => destination?.accommodations,
    [destination],
  );

  const arrival = useMemo(
    () => transportations?.find((t) => destination?.id === t.destinationId),
    [transportations, destination],
  );
  const arrivalOrigin = useMemo(
    () => destinations?.find((d) => arrival?.originId === d.id),
    [arrival],
  );

  const departure = useMemo(
    () => transportations?.find((t) => destination?.id === t.originId),
    [transportations, destination],
  );

  return (
    <HeroView
      headerImageUrl={TripService.getPhotoForPlace(destination?.place.images)}
    >
      <ThemedView style={styles.header}>
        <ThemedText type={TextType.Title}>{destination?.place.name}</ThemedText>
        <ThemedText type={TextType.Bold}>
          {destination?.startDate &&
            displayDate(destination.startDate, "DD MMM")}
          {" - "}
          {destination?.endDate && displayDate(destination.endDate, "DD MMM")}
        </ThemedText>
        {destination?.endDate && destination?.startDate && (
          <ThemedText type={TextType.Small}>
            {dateDiff(destination.endDate, destination.startDate)}{" "}
            {t("night", {
              count: dateDiff(destination.endDate, destination.startDate),
            })}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.body}>
        {/* Accommodations */}
        {accommodations?.length && (
          <ThemedView style={styles.accommodations}>
            <IconTitleValue
              icon="house"
              valueType={TextType.Subtitle}
              value={t("accommodation", {
                count: accommodations.length,
              })}
            />
            <CardList
              data={accommodations}
              renderItem={(a, i) => (
                <ThemedView style={styles.accommodation}>
                  <IconTitleValue
                    value={a.name ?? a.place.name}
                    displayTitleAfterText={true}
                    title={
                      a.checkin &&
                      a.checkout &&
                      `${displayDate(a.checkin, "DD MMM HH:mm")}  -  ${displayDate(a.checkout, "DD MMM HH:mm")}`
                    }
                  />
                  <ThemedButton
                    icon="pin"
                    type={ButtonType.Secondary}
                    onPress={() => {}}
                  />
                </ThemedView>
              )}
            />
          </ThemedView>
        )}

        {/* Arrival */}
        {arrival && (
          <ThemedView style={styles.arrival}>
            <IconTitleValue
              icon="arrival"
              valueType={TextType.Subtitle}
              value={t("arrival")}
            />
            <CardCollapsable
              header={
                <ThemedView style={styles.arrivalHeader}>
                  <Icon name="arrival" />
                  <ThemedView>
                    <ThemedText>
                      {t("arrivalAt")}{" "}
                      {arrival.segments[arrival.segments.length - 1]?.endDate &&
                        displayDate(
                          arrival.segments[arrival.segments.length - 1]
                            ?.endDate!,
                          "HH:mm",
                        )}
                    </ThemedText>
                    <ThemedText>
                      {arrivalOrigin?.place?.name ?? "fsdfsdf"}
                      {" - "}
                      {destination?.place?.name}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              }
              body={
                <ThemedView>
                  <ThemedText>Body</ThemedText>
                  <ThemedText>Body</ThemedText>
                  <ThemedText>Body</ThemedText>
                  <ThemedText>Body</ThemedText>
                  <ThemedText>Body</ThemedText>
                </ThemedView>
              }
            />
          </ThemedView>
        )}
      </ThemedView>
    </HeroView>
  );
}

const largeSpacing = getThemeProperty("largeSpacing");
const smallSpacing = getThemeProperty("smallSpacing");
const styles = StyleSheet.create({
  header: {
    padding: smallSpacing,
  },
  body: {
    padding: smallSpacing,
    gap: largeSpacing,
  },
  accommodations: {
    gap: smallSpacing,
  },
  accommodation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrival: {
    gap: smallSpacing,
  },
  arrivalHeader: {
    flexDirection: "row",
    gap: smallSpacing,
    alignItems: "center",
  },
});
