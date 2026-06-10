import { displayDate } from "@/helpers";
import { getThemeProperty, useInternalRouterContext, useThemeColor } from "@/hooks";
import { Activity, ActivityTypes } from "@/models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { CardView, HorizontalDivider, Icon, IconSymbols, PressableView, TextType, ThemedText, ThemedView } from "./ui";

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
    <CardView style={styles.container}>
      {Object.entries(activitiesByDate).map(([date, items], dateIndex) => (
        <ThemedView key={date} style={styles.group}>
          <ThemedText type={TextType.Caption}>
            {date === unscheduledIdentifier ? t("unscheduled") : displayDate(new Date(date), "ddd, DD MMM")}
          </ThemedText>
          {items.map((a) => (
            <PressableView key={a.id} style={styles.inlineInfo} onPress={() => goToPlace(a.placeId)}>
              <ThemedText type={TextType.Headline}>{a.scheduledAt && displayDate(a.scheduledAt, "HH:mm")}</ThemedText>
              <Icon name={getIconForActivity(a)} size={20} color={captionColor} />
              <ThemedView style={styles.activityInfo}>
                <ThemedText>{a.name}</ThemedText>
                {a.place?.address && <ThemedText type={TextType.Caption}>{a.place.address}</ThemedText>}
              </ThemedView>
              <Icon name="chevronRight" size={16} color={captionColor} />
            </PressableView>
          ))}
          {dateIndex !== Object.keys(activitiesByDate).length - 1 && <HorizontalDivider />}
        </ThemedView>
      ))}
    </CardView>
  );
};

const mediumSpacing = getThemeProperty("mediumSpacing");
const styles = StyleSheet.create({
  container: {
    gap: mediumSpacing,
  },
  group: {
    gap: mediumSpacing,
  },
  inlineInfo: {
    flexDirection: "row",
    gap: mediumSpacing,
    alignItems: "center",
  },
  activityInfo: {
    flex: 1,
  },
});
