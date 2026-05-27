import { HeroView } from "@/components";
import {
  ButtonType,
  CardList,
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

  const accommodations = useMemo(
    () => destination?.accommodations,
    [destination],
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
            ></CardList>
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
});
