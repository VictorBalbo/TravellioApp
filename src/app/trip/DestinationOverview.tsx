import { HeroView } from "@/components";
import {
  ButtonType,
  CardView,
  HorizontalDivider,
  IconTitleValue,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { dateDiff, displayDate } from "@/helpers";
import { getThemeProperty, useTripContext } from "@/hooks";
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

  const arrival = useMemo(
    () => transportations?.find((t) => destination?.id === t.destinationId),
    [transportations, destination],
  );

  const departure = useMemo(
    () => transportations?.find((t) => destination?.id === t.originId),
    [transportations, destination],
  );

  return (
    <HeroView headerImageUrl={destination?.place?.images?.[0] ?? ""}>
      <ThemedView style={styles.header}>
        {destination?.endDate && destination?.startDate && (
          <ThemedText type={TextType.Small}>
            {dateDiff(destination.endDate, destination.startDate)}{" "}
            {t("night", {
              count: dateDiff(destination.endDate, destination.startDate),
            })}
          </ThemedText>
        )}
        <ThemedText type={TextType.Title}>{destination?.place.name}</ThemedText>
        <ThemedText type={TextType.Bold}>
          {destination?.startDate &&
            displayDate(destination.startDate, "DD MMM")}
          {" - "}
          {destination?.endDate && displayDate(destination.endDate, "DD MMM")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.body}>
        {destination?.accommodations?.length && (
          <CardView style={styles.card}>
            <IconTitleValue
              icon="house"
              valueType={TextType.Subtitle}
              value={t("accommodation", {
                count: destination.accommodations.length,
              })}
            />
            {destination.accommodations.map((a, i) => (
              <ThemedView style={styles.accommodation} key={a.id}>
                <IconTitleValue
                  value={a.name ?? a.place.name}
                  displayTitleAfterText={true}
                  title={
                    a.checkin &&
                    a.checkout &&
                    `${displayDate(a.checkin, "DD MMM HH:mm")}  -  ${displayDate(a.checkout, "DD MMM HH:mm")}`
                  }
                />
                <ThemedView style={{ flexDirection: "row", gap: 8 }}>
                  {a.website && (
                    <ThemedButton
                      type={ButtonType.Secondary}
                      style={{ flex: 1 }}
                      icon="ticket"
                      // icon={require("@/assets/images/airbnb-icon.png")}
                      onPress={() => console.log("Reservation")}
                      // title={t("viewReservation")}
                    />
                  )}
                  {a.place.mapsUrl && (
                    <ThemedButton
                      type={ButtonType.Secondary}
                      style={{ flex: 1 }}
                      icon="map"
                      onPress={() => console.log("Map")}
                      // title={t("openMap")}
                    />
                  )}
                </ThemedView>
                {i !== destination.accommodations!.length - 1 && (
                  <HorizontalDivider />
                )}
              </ThemedView>
            ))}
          </CardView>
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
  card: {
    gap: smallSpacing,
  },
  accommodation: {
    gap: smallSpacing,
  },
});
