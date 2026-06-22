import { HeroView } from "@/components";
import {
  ButtonType,
  CardView,
  HorizontalDivider,
  IconCaptionText,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { dateDiff, displayDate } from "@/helpers";
import { getThemeProperty, useTripContext } from "@/hooks";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function AccommodationDetails() {
  const { t } = useTranslation();
  const { accommodationId } = useLocalSearchParams();
  const { accommodations } = useTripContext();
  const accommodation = useMemo(
    () => accommodations?.find((d) => d.id === accommodationId),
    [accommodationId, accommodations],
  );

  function openBrowser(website: string | undefined): void {
    throw new Error("Function not implemented.");
  }

  return (
    <HeroView headerImageUrl={accommodation?.imageUrl}>
      <ThemedView style={styles.header}>
        <ThemedText type={TextType.Display}>{accommodation?.name}</ThemedText>
        <ThemedView style={styles.inlineInfo}>
          <ThemedText type={TextType.Headline}>
            {accommodation?.checkIn && displayDate(accommodation.checkIn, "DD MMM")}
            {" - "}
            {accommodation?.checkOut && displayDate(accommodation.checkOut, "DD MMM")}
          </ThemedText>
          {accommodation?.checkIn && accommodation?.checkOut && (
            <ThemedText type={TextType.Footnote}>
              {dateDiff(accommodation?.checkOut, accommodation.checkIn)}{" "}
              {t("night", {
                count: dateDiff(accommodation?.checkOut, accommodation.checkIn),
              })}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.body}>
        <ThemedView style={styles.actionRow}>
          {accommodation?.address && (
            <ThemedButton
              title={t("directions")}
              icon={"map"}
              type={ButtonType.Secondary}
              round
              onPress={() => openBrowser(accommodation.address)}
              style={styles.actionButton}
            />
          )}
          {accommodation?.address && (
            <ThemedButton
              title={t("reservation")}
              icon={"globe"}
              type={ButtonType.Secondary}
              round
              onPress={() => openBrowser(accommodation.website)}
              style={styles.actionButton}
            />
          )}
        </ThemedView>
        <ThemedView style={styles.titleCardContainer}>
          <IconCaptionText text={t("yourTrip")} icon="pin" textType={TextType.Title} />
          <CardView style={styles.infoCard}>
            <IconCaptionText
              icon="calendar"
              caption={t("checkIn")}
              text={accommodation?.checkIn ? displayDate(accommodation.checkIn, "ddd DD MMM • HH:mm") : " - "}
            />
            {accommodation?.checkIn && accommodation?.checkOut && <HorizontalDivider />}
            <IconCaptionText
              icon="calendar"
              caption={t("checkOut")}
              text={accommodation?.checkOut ? displayDate(accommodation.checkOut, "ddd DD MMM • HH:mm") : " - "}
            />
            {accommodation?.checkIn && accommodation?.checkOut && (
              <Fragment>
                <HorizontalDivider />
                <IconCaptionText
                  icon="calendar"
                  caption={t("night_other")}
                  text={
                    dateDiff(accommodation?.checkOut, accommodation.checkIn) +
                    " " +
                    t("night", {
                      count: dateDiff(accommodation?.checkOut, accommodation.checkIn),
                    })
                  }
                />
              </Fragment>
            )}
          </CardView>
        </ThemedView>
      </ThemedView>
    </HeroView>
  );
}
const largeSpacing = getThemeProperty("largeSpacing");
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: largeSpacing,
  },
  inlineInfo: {},
  body: {
    padding: largeSpacing,
    gap: largeSpacing,
  },
  actionRow: {
    flexDirection: "row",
    gap: largeSpacing,
  },
  actionButton: {
    width: 50,
    height: 50,
  },
  titleCardContainer: {},
  infoCard: {},
});
