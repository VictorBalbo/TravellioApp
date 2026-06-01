import { dateDiff, displayDate, formatDuration } from "@/helpers/DateHelper";
import { getThemeProperty, useThemeColor } from "@/hooks";
import { useTripContext } from "@/hooks/useTrip";
import { Destination, Transportation, TransportTypes } from "@/models";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  CardCollapsable,
  HorizontalDivider,
  Icon,
  IconSymbols,
  IconTitleValue,
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
  const helperTextColor = useThemeColor("helperText");
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
  const departure = type === "arrival" ? relevantPlace?.place?.name : destination.place.name;
  const arrival = type === "arrival" ? destination.place.name : relevantPlace?.place?.name;
  return (
    <CardCollapsable
      header={
        <ThemedView style={styles.header}>
          <Icon name={type} />
          <ThemedView style={{ gap: smallSpacing }}>
            <ThemedView style={styles.inlineInfo}>
              <ThemedText type={TextType.Bold}>
                {t(type === "arrival" ? "arrivalAt" : "departureAt")}{" "}
                {relevantTime && displayDate(relevantTime, "HH:mm")}
              </ThemedText>
              <ThemedText type={TextType.Small}>{relevantTime && displayDate(relevantTime, "ddd DD MMM")}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.inlineInfo}>
              <ThemedText type={TextType.Small}>{departure}</ThemedText>
              <Icon name="arrowRight" size={12} color={helperTextColor} />
              <ThemedText type={TextType.Small}>{arrival}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      }
      body={transportation.legs.map((leg, index) => (
        <ThemedView key={leg.id} style={styles.body}>
          {/* Type, Company, and Service Number */}
          <ThemedView style={styles.inlineInfo}>
            <Icon name={legTypeIcon(leg.type)} size={16} color={helperTextColor} />
            <ThemedText type={TextType.Small}>
              {t(`transportation.${leg.type.toLowerCase()}`)}
              {" · "}
              {leg.company} {leg.serviceNumber}
            </ThemedText>
          </ThemedView>

          {/* Departure and Arrival Info */}
          <ThemedView style={styles.inlineInfo}>
            <IconTitleValue
              title={leg.departurePlace.name}
              value={leg.departurePlace.vicinity ?? ""}
              // url={leg.departurePlace.mapsUrl}
              valueType={TextType.Subtitle}
              displayTitleAfterText
            />
            <IconTitleValue
              title={leg.arrivalPlace.name}
              value={leg.arrivalPlace.vicinity ?? ""}
              // url={leg.arrivalPlace.mapsUrl}
              valueType={TextType.Subtitle}
              displayTitleAfterText
              alignText="right"
            />
          </ThemedView>

          {/* Departure and Arrival Times with Duration */}
          <ThemedView style={styles.inlineInfo}>
            <IconTitleValue
              title={leg.departureTime && displayDate(leg.departureTime, "ddd DD MMM")}
              value={(leg.departureTime && displayDate(leg.departureTime, "HH:mm")) ?? ""}
              valueType={TextType.Bold}
            />
            <ThemedText type={TextType.Small}> - - - - - </ThemedText>
            <ThemedView style={{ flexDirection: "column", alignItems: "center" }}>
              <Icon name={legTypeIcon(leg.type)} size={12} color={helperTextColor} />
              <ThemedText type={TextType.Small}>{legDuration(leg.departureTime, leg.arrivalTime)}</ThemedText>
            </ThemedView>
            <ThemedText type={TextType.Small}> - - - - - </ThemedText>
            <IconTitleValue
              title={leg.arrivalTime && displayDate(leg.arrivalTime, "ddd DD MMM")}
              value={(leg.arrivalTime && displayDate(leg.arrivalTime, "HH:mm")) ?? ""}
              valueType={TextType.Bold}
              alignText="right"
            />
          </ThemedView>

          {/* Company and Service Number */}
          <ThemedView style={styles.inlineInfo}>
            <IconTitleValue value={leg.company ?? " - "} title={t("transportation.company")} />
            <IconTitleValue
              value={leg.serviceNumber ?? " - "}
              title={t(`transportation.serviceNumber.${leg.type.toLowerCase()}`)}
            />
          </ThemedView>

          {/* Seat and Reservation */}
          <ThemedView style={styles.inlineInfo}>
            <IconTitleValue value={leg.seat ?? " - "} title={t("transportation.seat")} />
            <IconTitleValue value={leg.reservation ?? " - "} title={t("reservation")} />
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
                    style={styles.connectionTime}
                  />
                }
              />
            </ThemedView>
          )}
        </ThemedView>
      ))}
    />
  );
};
const smallSpacing = getThemeProperty("smallSpacing");
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
  connectionTime: {
    alignSelf: "center",
    marginVertical: mediumSpacing,
  },
});
