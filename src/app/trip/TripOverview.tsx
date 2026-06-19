import { CardView, HorizontalDivider, Icon, PressableView, TextType, ThemedText, ThemedView } from "@/components/ui";
import { utcDate } from "@/helpers";
import { getThemeProperty, useInternalRouterContext, useMapContext, useTripContext } from "@/hooks";
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type={TextType.Title}>{trip?.name}</ThemedText>
      <CardView style={styles.destinationsCard}>
        {destinations?.map((d, i) => (
          <ThemedView key={i}>
            <PressableView onPress={() => goToDestination(d.id)} style={styles.destination}>
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
            {i !== destinations.length - 1 && <HorizontalDivider marginVertical={mediumSpacing} />}
          </ThemedView>
        ))}
      </CardView>
    </ThemedView>
  );
}
const largeSpacing = getThemeProperty("largeSpacing");
const mediumSpacing = getThemeProperty("mediumSpacing");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: largeSpacing,
    overflow: "hidden",
  },
  destinationsCard: {
    marginVertical: mediumSpacing,
  },
  destination: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
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
