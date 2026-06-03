import { CardView, HorizontalDivider, Icon, PressableView, TextType, ThemedText, ThemedView } from "@/components/ui";
import { utcDate } from "@/helpers";
import { getThemeProperty, useTripContext } from "@/hooks";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function TripDestinations() {
  const { trip, destinations } = useTripContext();

  const router = useRouter();
  const { t } = useTranslation();

  const onDestinationSelected = (destinationId: string) => {
    router.push({
      pathname: "/trip/DestinationOverview",
      params: { destinationId: destinationId },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type={TextType.Title}>{trip?.name}</ThemedText>
      <CardView style={styles.destinationsCard}>
        {destinations?.map((d, i) => (
          <ThemedView key={i}>
            <PressableView onPress={() => onDestinationSelected(d.id)} style={styles.destination}>
              <Icon name="building" />
              <ThemedView style={styles.destinationName}>
                <ThemedText type={TextType.Bold} numberOfLines={1}>
                  {d.place?.name}
                </ThemedText>
                <ThemedText type={TextType.Small}>
                  {utcDate(d.startDate).format("DD MMM")}
                  {" - "}
                  {utcDate(d.endDate).format("DD MMM")}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.destinationActivities}>
                <ThemedText type={TextType.Bold}>{d.activities?.length ?? 0}</ThemedText>
                <ThemedText type={TextType.Small}>{t("activity", { count: d.activities?.length ?? 0 })}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.destinationNights}>
                <ThemedText type={TextType.Bold}>{utcDate(d.endDate).diff(d.startDate, "days")}</ThemedText>
                <ThemedText type={TextType.Small}>
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
