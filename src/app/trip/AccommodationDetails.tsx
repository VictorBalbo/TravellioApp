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
import { baseStyle, spacing } from "@/constants";
import { dateDiff, displayDate, getCurrencySymbol } from "@/helpers";
import { useMapContext, useTripContext } from "@/hooks";
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
      <ThemedView style={baseStyle.viewHeader}>
        <ThemedText type={TextType.Display}>{accommodation?.name}</ThemedText>
        <ThemedView style={baseStyle.inlineSectionGap}>
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
      <ThemedView style={baseStyle.viewBody}>
        <ThemedView style={styles.actionRow}>
          {accommodation?.address && (
            <ThemedButton
              title={t("directions")}
              icon={"map"}
              type={ButtonType.Primary}
              round
              onPress={() => openBrowser(accommodation.address)}
            />
          )}
          {accommodation?.website && (
            <ThemedButton
              title={t("reservation")}
              icon={"globe"}
              type={ButtonType.Secondary}
              round
              onPress={() => openBrowser(accommodation.website)}
            />
          )}
        </ThemedView>
        <ThemedView style={baseStyle.titleSectionGap}>
          <IconCaptionText text={t("yourTrip")} icon="pin" textType={TextType.Title} />
          <CardView style={baseStyle.smallGap}>
            <IconCaptionText
              icon="personArrive"
              caption={t("checkIn")}
              text={accommodation?.checkIn ? displayDate(accommodation.checkIn, "ddd, DD MMM • HH:mm") : " - "}
            />
            <HorizontalDivider />
            <IconCaptionText
              icon="personDeparture"
              caption={t("checkOut")}
              text={accommodation?.checkOut ? displayDate(accommodation.checkOut, "ddd, DD MMM • HH:mm") : " - "}
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
          <ThemedView style={baseStyle.titleSectionGap}>
            <IconCaptionText text={t("notes")} icon="book" textType={TextType.Title} />
            <CardSeeMore numberOfLines={4} content={accommodation.notes} />
          </ThemedView>
        )}
      </ThemedView>
    </HeroView>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: spacing.large,
  },
});
