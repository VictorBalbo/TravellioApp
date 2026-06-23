import { CardList, Icon, PressableView, TextType, ThemedText, ThemedView } from "@/components/ui";
import { baseStyle, spacing } from "@/constants";
import { dateDiff, displayDate, utcDate } from "@/helpers";
import { useInternalRouterContext, useMapContext, useTripContext } from "@/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function TripOverview() {
  const { trip, destinations } = useTripContext();
  const { focusTripMarkers } = useMapContext();

  const { goToDestination } = useInternalRouterContext();
  const { t } = useTranslation();

  useEffect(() => {
    focusTripMarkers(trip);
  }, [focusTripMarkers, trip]);

  const tripDuration = trip?.endDate && trip?.startDate && dateDiff(trip.endDate, trip.startDate);

  return (
    <ThemedView style={{ paddingVertical: spacing.large }}>
      <ThemedView style={baseStyle.viewHeader}>
        <ThemedText type={TextType.Display}>{trip?.name}</ThemedText>
        <ThemedText type={TextType.Headline}>
          {trip?.startDate && displayDate(trip.startDate, "DD MMM")}
          {" - "}
          {trip?.endDate && displayDate(trip.endDate, "DD MMM")}
        </ThemedText>
        {tripDuration && (
          <ThemedText type={TextType.Footnote}>
            {tripDuration} {t("night", { count: tripDuration })}{" "}
          </ThemedText>
        )}
      </ThemedView>
      <ThemedView style={baseStyle.viewBody}>
        <CardList
          data={destinations ?? []}
          renderItem={(d) => (
            <PressableView onPress={() => goToDestination(d.id)} style={baseStyle.inlineSectionGap}>
              <Icon name="building" />
              <ThemedView style={styles.destinationName}>
                <ThemedText type={TextType.Headline} numberOfLines={1}>
                  {d.name}
                </ThemedText>
                <ThemedText type={TextType.Caption}>
                  {utcDate(d.startDate).format("DD MMM")}
                  {" - "}
                  {utcDate(d.endDate).format("DD MMM")}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.destinationActivities}>
                <ThemedText type={TextType.Headline}>{d.activities?.length ?? 0}</ThemedText>
                <ThemedText type={TextType.Caption}>{t("activity", { count: d.activities?.length ?? 0 })}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.destinationNights}>
                <ThemedText type={TextType.Headline}>{utcDate(d.endDate).diff(d.startDate, "days")}</ThemedText>
                <ThemedText type={TextType.Caption}>
                  {t("night", {
                    count: utcDate(d.endDate).diff(d.startDate, "days"),
                  })}
                </ThemedText>
              </ThemedView>
            </PressableView>
          )}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  destinationName: {
    flex: 2,
    alignItems: "flex-start",
  },
  destinationActivities: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  destinationNights: {
    flex: 1,
    alignItems: "center",
  },
});
