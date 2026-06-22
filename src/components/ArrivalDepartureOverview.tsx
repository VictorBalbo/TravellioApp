import { dateDiff, displayDate, formatDuration } from "@/helpers/DateHelper";
import { getThemeProperty, useThemeColor } from "@/hooks";
import { useTripContext } from "@/hooks/useTrip";
import { Destination, Transportation, TransportTypes } from "@/models";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  CardView,
  Collapsable,
  HorizontalDivider,
  Icon,
  IconCaptionText,
  IconSymbols,
  Tag,
  TextType,
  ThemedText,
  ThemedView,
} from "./ui";

type Props = {
  destination: Destination;
  transportation: Transportation;
  type: "arrival" | "departure";
};

export const ArrivalDepartureOverview = ({ destination, transportation, type }: Props) => {
  const captionColor = useThemeColor("caption");
  const { trip } = useTripContext();
  const { t } = useTranslation();

  const legTypeIcon = (type: TransportTypes) => type.toLowerCase() as keyof IconSymbols;
  const legDuration = (departureTime?: Date, arrivalTime?: Date) => {
    if (!departureTime || !arrivalTime) return undefined;
    return formatDuration(dateDiff(arrivalTime, departureTime, "minutes"));
  };

  const relevantPlace =
    type === "arrival"
      ? trip?.destinations?.find((d) => d.id === transportation.departureDestinationId)
      : trip?.destinations?.find((d) => d.id === transportation.arrivalDestinationId);
  const relevantTime = type === "arrival" ? transportation.arrivalTime : transportation.departureTime;

  const departure = type === "arrival" ? relevantPlace?.name : destination.name;
  const arrival = type === "arrival" ? destination.name : relevantPlace?.name;
  return (
    <CardView>
      <Collapsable
        header={
          <ThemedView style={styles.header}>
            <Icon name={type} color={captionColor} />
            <ThemedView>
              <ThemedView style={styles.inlineInfo}>
                <ThemedText type={TextType.Headline}>
                  {type === "arrival" ? t("arrivalAt") : t("departureAt")}{" "}
                  {relevantTime && displayDate(relevantTime, "HH:mm")}
                </ThemedText>
                <ThemedText type={TextType.Caption}>
                  {relevantTime && displayDate(relevantTime, "ddd DD MMM")}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.inlineInfo}>
                <ThemedText type={TextType.Caption}>{departure}</ThemedText>
                <Icon name="arrowRight" size={12} color={captionColor} />
                <ThemedText type={TextType.Caption}>{arrival}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        }
        body={transportation.legs.map((leg, index) => (
          <ThemedView key={leg.id} style={styles.body}>
            {/* Type, Company, and Service Number */}
            <ThemedView style={styles.inlineInfo}>
              <Icon name={legTypeIcon(leg.type)} size={16} color={captionColor} />
              <ThemedText type={TextType.Caption}>
                {t(`transportation.${leg.type.toLowerCase()}`)}
                {" · "}
                {leg.company} {leg.serviceNumber}
              </ThemedText>
            </ThemedView>

            {/* Departure and Arrival Info */}
            <ThemedView style={[styles.inlineInfo, styles.placeNames]}>
              <IconCaptionText
                caption={leg.departurePlaceDescription}
                text={leg.departurePlaceShortName}
                textType={TextType.Title}
                invertCaptionText
                containerStyle={{ flex: 1 }}
              />
              <IconCaptionText
                caption={leg.arrivalPlaceDescription}
                text={leg.arrivalPlaceShortName}
                textType={TextType.Title}
                invertCaptionText
                containerStyle={{ flex: 1 }}
                alignText="right"
              />
            </ThemedView>

            {/* Departure and Arrival Times with Duration */}
            {(leg.departureTime || leg.arrivalTime) && (
              <ThemedView style={styles.inlineInfo}>
                <IconCaptionText
                  caption={leg.departureTime && displayDate(leg.departureTime, "ddd DD MMM")}
                  text={(leg.departureTime && displayDate(leg.departureTime, "HH:mm")) ?? ""}
                  textType={TextType.Headline}
                />
                {leg.departureTime && leg.arrivalTime && (
                  <Fragment>
                    <ThemedText type={TextType.Caption}> - - - - - </ThemedText>
                    <ThemedView style={styles.flightDuration}>
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
                  alignText="right"
                />
              </ThemedView>
            )}

            {/* Company and Service Number */}
            <ThemedView style={styles.inlineInfo}>
              <IconCaptionText text={leg.company ?? " - "} caption={t("transportation.company")} />
              <IconCaptionText
                text={leg.serviceNumber ?? " - "}
                caption={t(`transportation.serviceNumber.${leg.type.toLowerCase()}`)}
              />
            </ThemedView>

            {/* Seat and Reservation */}
            <ThemedView style={styles.inlineInfo}>
              <IconCaptionText text={leg.seat ?? " - "} caption={t("transportation.seat")} />
              <IconCaptionText text={leg.reservation ?? " - "} caption={t("reservation")} />
            </ThemedView>

            {/* Connection Time */}
            {index !== transportation.legs.length - 1 && (
              <ThemedView style={styles.inlineInfo}>
                <HorizontalDivider
                  centerContent={
                    <Tag
                      text={
                        legDuration(leg.arrivalTime, transportation.legs[index + 1]?.departureTime) +
                        " " +
                        t("transportation.connection")
                      }
                      style={styles.connectionDuration}
                    />
                  }
                />
              </ThemedView>
            )}
          </ThemedView>
        ))}
      />
    </CardView>
  );
};
const mediumSpacing = getThemeProperty("mediumSpacing");
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
  inlineInfo: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
  body: {
    gap: mediumSpacing,
  },
  placeNames: {
    alignItems: "flex-start",
  },
  flightDuration: {
    flexDirection: "column",
    alignItems: "center",
  },
  connectionDuration: {
    alignSelf: "center",
    marginVertical: mediumSpacing,
  },
});
