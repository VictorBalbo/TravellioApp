import { HeroView } from "@/components";
import {
  CardView,
  HorizontalDivider,
  Icon,
  IconCaptionText,
  IconSymbols,
  TextType,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { baseStyle } from "@/constants";
import { displayDate } from "@/helpers";
import { dateDiff, formatDuration } from "@/helpers/DateHelper";
import { useThemeColor, useTripContext } from "@/hooks";
import { TransportTypes } from "@/models";
import { useLocalSearchParams } from "expo-router";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";

type LocalSeachProps = {
  transportationId: string;
  transitReference: "arrival" | "departure";
};
export default function TransitDetails() {
  const { transportationId, transitReference } = useLocalSearchParams<LocalSeachProps>();
  const { transportations, destinations } = useTripContext();
  const { t } = useTranslation();
  const captionColor = useThemeColor("caption");

  const transportation = useMemo(
    () => transportations?.find((d) => d.id === transportationId),
    [transportationId, transportations],
  );
  const departureDestination = useMemo(
    () => destinations?.find((d) => d.id === transportation?.departureDestinationId),
    [transportation?.departureDestinationId, destinations],
  );
  const arrivalDestination = useMemo(
    () => destinations?.find((d) => d.id === transportation?.arrivalDestinationId),
    [transportation?.arrivalDestinationId, destinations],
  );

  const legTypeIcon = (type: TransportTypes) => type.toLowerCase() as keyof IconSymbols;
  const legDuration = (departureTime?: Date, arrivalTime?: Date) => {
    if (!departureTime || !arrivalTime) return undefined;
    return formatDuration(dateDiff(arrivalTime, departureTime, "minutes"));
  };

  return (
    <HeroView>
      <ThemedView style={baseStyle.viewHeader}>
        <ThemedText type={TextType.Display}>
          {transitReference === "arrival" ? t("arrivalIn") : t("departureIn")}{" "}
          {transitReference === "arrival" ? arrivalDestination?.name : departureDestination?.name}
        </ThemedText>
        <ThemedView style={baseStyle.inlineSectionGap}>
          <ThemedText type={TextType.Caption}>{departureDestination?.name}</ThemedText>
          <Icon name="arrowRight" size={12} color={captionColor} />
          <ThemedText type={TextType.Caption}>{arrivalDestination?.name}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={baseStyle.viewBody}>
        {transportation?.legs.map((leg) => (
          <CardView key={leg.id} style={baseStyle.smallGap}>
            {/* Type, Company, and Service Number */}
            <ThemedView style={baseStyle.inlineSectionGap}>
              <Icon name={legTypeIcon(leg.type)} size={14} color={captionColor} />
              <ThemedText type={TextType.Caption}>
                {t(`transportation.${leg.type.toLowerCase()}`)}
                {" · "}
                {leg.company} {leg.serviceNumber}
              </ThemedText>
            </ThemedView>
            <HorizontalDivider />

            {/* Departure and Arrival Info */}
            <ThemedView style={baseStyle.inlineSectionSpaceBetween}>
              <IconCaptionText
                caption={leg.departurePlaceDescription}
                text={leg.departurePlaceShortName}
                textType={TextType.Title}
                invertCaptionText
                containerStyle={{ maxWidth: "50%" }}
              />
              <IconCaptionText
                caption={leg.arrivalPlaceDescription}
                text={leg.arrivalPlaceShortName}
                textType={TextType.Title}
                invertCaptionText
                containerStyle={{ maxWidth: "50%" }}
                alignText="right"
              />
            </ThemedView>

            {/* Departure and Arrival Times with Duration */}
            {(leg.departureTime || leg.arrivalTime) && (
              <ThemedView style={baseStyle.inlineSectionSpaceBetween}>
                <IconCaptionText
                  caption={leg.departureTime && displayDate(leg.departureTime, "ddd DD MMM")}
                  text={(leg.departureTime && displayDate(leg.departureTime, "HH:mm")) ?? ""}
                  textType={TextType.Headline}
                  invertCaptionText
                />
                {leg.departureTime && leg.arrivalTime && (
                  <Fragment>
                    <ThemedText type={TextType.Caption}> - - - - - </ThemedText>
                    <ThemedView style={baseStyle.columnSectionCentered}>
                      <Icon name={legTypeIcon(leg.type)} size={12} color={captionColor} />
                      <ThemedText type={TextType.Caption}>{legDuration(leg.departureTime, leg.arrivalTime)}</ThemedText>
                    </ThemedView>
                    <ThemedText type={TextType.Caption}> - - - - - </ThemedText>
                  </Fragment>
                )}
                <IconCaptionText
                  caption={leg.arrivalTime && displayDate(leg.arrivalTime, "ddd DD MMM")}
                  text={(leg.arrivalTime && displayDate(leg.arrivalTime, "HH:mm")) ?? ""}
                  textType={TextType.Headline}
                  invertCaptionText
                  alignText="right"
                />
              </ThemedView>
            )}
            <HorizontalDivider />

            {/* Company and Service Number */}
            <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: "8" }}>
              <IconCaptionText
                text={leg.company ?? " - "}
                caption={t("transportation.company")}
                containerStyle={{ maxWidth: "50%" }}
              />
              <IconCaptionText
                text={leg.serviceNumber ?? " - "}
                caption={t(`transportation.serviceNumber.${leg.type.toLowerCase()}`)}
                containerStyle={{ maxWidth: "50%" }}
              />
            </ThemedView>

            {/* Seat and Reservation */}
            <ThemedView style={baseStyle.inlineSectionGap}>
              <IconCaptionText text={leg.seat ?? " - "} caption={t("transportation.seat")} />
              <IconCaptionText text={leg.reservation ?? " - "} caption={t("reservation")} />
            </ThemedView>
          </CardView>
        ))}
      </ThemedView>
    </HeroView>
  );
}
