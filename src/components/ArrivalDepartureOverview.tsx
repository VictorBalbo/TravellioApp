import { baseStyle } from "@/constants";
import { displayDate } from "@/helpers/DateHelper";
import { useInternalRouterContext, useThemeColor } from "@/hooks";
import { useTripContext } from "@/hooks/useTrip";
import { Destination, Transportation } from "@/models";
import { useTranslation } from "react-i18next";
import { CardView, Icon, PressableView, TextType, ThemedText, ThemedView } from "./ui";

type Props = {
  destination: Destination;
  transportation: Transportation;
  type: "arrival" | "departure";
};

export const ArrivalDepartureOverview = ({ destination, transportation, type }: Props) => {
  const captionColor = useThemeColor("caption");
  const { trip } = useTripContext();
  const { t } = useTranslation();
  const { goToTransit } = useInternalRouterContext();

  const relevantPlace =
    type === "arrival"
      ? trip?.destinations?.find((d) => d.id === transportation.departureDestinationId)
      : trip?.destinations?.find((d) => d.id === transportation.arrivalDestinationId);
  const relevantTime = type === "arrival" ? transportation.arrivalTime : transportation.departureTime;

  const departure = type === "arrival" ? relevantPlace?.name : destination.name;
  const arrival = type === "arrival" ? destination.name : relevantPlace?.name;
  return (
    <CardView>
      <PressableView onPress={() => goToTransit(type, transportation.id)} style={baseStyle.inlineSectionGap}>
        <Icon name={type} color={captionColor} />
        <ThemedView style={{ flex: 1 }}>
          <ThemedView style={baseStyle.inlineSectionGap}>
            <ThemedText type={TextType.Headline}>
              {type === "arrival" ? t("arrivalAt") : t("departureAt")}{" "}
              {relevantTime && displayDate(relevantTime, "HH:mm")}
            </ThemedText>
            <ThemedText type={TextType.Caption}>{relevantTime && displayDate(relevantTime, "ddd, DD MMM")}</ThemedText>
          </ThemedView>
          <ThemedView style={baseStyle.inlineSectionGap}>
            <ThemedText type={TextType.Caption}>{departure}</ThemedText>
            <Icon name="arrowRight" size={12} color={captionColor} />
            <ThemedText type={TextType.Caption}>{arrival}</ThemedText>
          </ThemedView>
        </ThemedView>
        <Icon name="chevronRight" size={16} color={captionColor} />
      </PressableView>
    </CardView>
  );
};
