import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BACKGROUND_PAGE, BORDER_SUBTLE, Fonts, SURFACE_MUTED, TEXT_PRIMARY, TEXT_SECONDARY } from "@/constants/theme";
import type { Activity } from "@/lib/accountability-board";

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type Props = {
  activity: Activity[];
  selectedDate: Date;
};

export function HomeActivityCalendar({ activity, selectedDate }: Props) {
  const selectedActivities = useMemo(() => {
    return activity.filter((item) => sameDay(new Date(item.createdAtISO), selectedDate));
  }, [activity, selectedDate]);

  return (
    <View style={styles.shell}>
      {selectedActivities.length === 0 ? (
        <Text style={styles.emptyText}>No tasks created for this date.</Text>
      ) : (
        selectedActivities.map((item) => (
          <View key={item.id} style={styles.activityItem}>
            <View style={styles.activityTopRow}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
            <Text style={styles.activityDetail}>{item.detail}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
  },
  activityItem: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    flex: 1,
  },
  activityTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activityTime: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  activityDetail: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
  },
});
