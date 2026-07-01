import { baseStyle, spacing } from "@/constants";
import { displayDate } from "@/helpers";
import { useInternalRouterContext, useThemeColor } from "@/hooks";
import { Activity, ActivityTypes } from "@/models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  CardView,
  HorizontalDivider,
  Icon,
  IconCaptionText,
  IconSymbols,
  PressableView,
  TextType,
  ThemedText,
  ThemedView,
} from "./ui";

type Props = {
  activities: Activity[];
};

export const ActivitiesItinerary = ({ activities }: Props) => {
  const { t } = useTranslation();
  const { goToPlace } = useInternalRouterContext();
  const captionColor = useThemeColor("caption");
  const unscheduledIdentifier = "###";
  const activitiesByDate = useMemo(
    () =>
      activities.reduce<Record<string, Activity[]>>((acc, activity) => {
        const key = activity.scheduledAt ? displayDate(activity.scheduledAt, "YYYY-MM-DD") : unscheduledIdentifier;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(activity);
        return acc;
      }, {}),
    [activities],
  );

  const getIconForActivity = (activity: Activity): keyof IconSymbols => {
    switch (activity.type) {
      case ActivityTypes.Restaurant:
        return "restaurant";
      case ActivityTypes.Coffee:
        return "coffee";
      case ActivityTypes.Nightlife:
        return "nightlife";
      case ActivityTypes.Bakery:
        return "bakery";
      case ActivityTypes.Museum:
        return "museum";
      case ActivityTypes.Nature:
        return "nature";
      case ActivityTypes.Beach:
        return "beach";
      case ActivityTypes.Shopping:
        return "shopping";
      case ActivityTypes.Tour:
        return "tour";
      case ActivityTypes.Activity:
        return "activity";
      case ActivityTypes.PhotoSpot:
        return "camera";
      case ActivityTypes.Wellness:
        return "wellness";
      default:
        return "pin";
    }
  };

  return (
    <CardView>
      {Object.entries(activitiesByDate).map(([date, items], dateIndex) => (
        <ThemedView key={date}>
          <ThemedText type={TextType.Caption}>
            {date === unscheduledIdentifier ? t("unscheduled") : displayDate(new Date(date), "ddd, DD MMM")}
          </ThemedText>
          {items.map((a) => (
            <PressableView key={a.id} style={baseStyle.inlineSectionGap} onPress={() => goToPlace(a.placeId)}>
              <ThemedText type={TextType.Headline} style={styles.activityTime}>
                {a.scheduledAt && displayDate(a.scheduledAt, "HH:mm")}
              </ThemedText>
              <IconCaptionText
                icon={getIconForActivity(a)}
                iconSize={20}
                text={a.name}
                caption={a.address}
                invertCaptionText
              />
              <Icon name="chevronRight" size={16} color={captionColor} />
            </PressableView>
          ))}
          {dateIndex !== Object.keys(activitiesByDate).length - 1 && (
            <HorizontalDivider marginVertical={spacing.small} />
          )}
        </ThemedView>
      ))}
    </CardView>
  );
};

const styles = StyleSheet.create({
  activityTime: {
    minWidth: 45,
  },
});
