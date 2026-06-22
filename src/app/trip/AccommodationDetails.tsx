import { HeroView } from "@/components";
import {
  ButtonType,
  CardSeeMore,
  CardView,
  HorizontalDivider,
  IconCaptionText,
  TextType,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { dateDiff, displayDate, getCurrencySymbol } from "@/helpers";
import { getThemeProperty, useMapContext, useTripContext } from "@/hooks";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function AccommodationDetails() {
  const { t } = useTranslation();
  const { accommodationId } = useLocalSearchParams();
  const { accommodations } = useTripContext();
  const { focusPlaceMarker } = useMapContext();
  const accommodation = useMemo(
    () => accommodations?.find((d) => d.id === accommodationId),
    [accommodationId, accommodations],
  );

  function openBrowser(website: string | undefined): void {
    throw new Error("Function not implemented.");
  }

  useEffect(() => {
    if (!accommodation) {
      return;
    }

    focusPlaceMarker({
      id: accommodation.placeId,
      coordinates: accommodation.coordinates,
      name: accommodation.name,
    });
  }, [accommodation, focusPlaceMarker]);

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
          {accommodation?.website && (
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
              icon="personArrive"
              caption={t("checkIn")}
              text={accommodation?.checkIn ? displayDate(accommodation.checkIn, "ddd DD MMM • HH:mm") : " - "}
            />
            <HorizontalDivider />
            <IconCaptionText
              icon="personDeparture"
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
            {accommodation?.address && (
              <Fragment>
                <HorizontalDivider />
                <IconCaptionText icon="map" caption={t("address")} text={accommodation.address} textNumberOfLines={2} />
              </Fragment>
            )}
            {accommodation?.price && (
              <Fragment>
                <HorizontalDivider />
                <IconCaptionText
                  icon="money"
                  caption={t("price")}
                  text={`${getCurrencySymbol(accommodation.price.currency)} ${accommodation.price.value.toFixed(2)}`}
                />
              </Fragment>
            )}
          </CardView>
        </ThemedView>

        {accommodation?.notes && (
          <ThemedView style={styles.titleCardContainer}>
            <IconCaptionText text={t("notes")} icon="book" textType={TextType.Title} />
            <CardSeeMore numberOfLines={4} content={accommodation.notes} />
          </ThemedView>
        )}
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
  titleCardContainer: {
    gap: smallSpacing,
  },
  infoCard: {
    gap: mediumSpacing,
  },
});
