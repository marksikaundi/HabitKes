import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  BORDER_SUBTLE,
  Fonts,
  SURFACE_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import type { CheckInChartDay } from "@/lib/daily-checkin-history";

type Props = {
  week: CheckInChartDay[];
};

export function WeeklyReviewCard({ week }: Props) {
  const [open, setOpen] = useState(false);
  const todayIsSunday = new Date().getDay() === 0;

  const summary = useMemo(() => {
    const withData = week.filter((d) => d.hasSnapshot);
    if (withData.length === 0) {
      return {
        consistency: 0,
        bestDay: "N/A",
        bestCompleted: 0,
        insight: "Check in daily to unlock your weekly reflection.",
      };
    }
    const totalDone = withData.reduce((acc, d) => acc + d.completed, 0);
    const totalPossible = withData.reduce((acc, d) => acc + d.total, 0);
    const best = withData.reduce((max, d) =>
      d.completed > max.completed ? d : max,
    );
    const consistency =
      totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

    const firstHalf = withData.slice(0, Math.ceil(withData.length / 2));
    const secondHalf = withData.slice(Math.ceil(withData.length / 2));
    const firstAvg =
      firstHalf.length === 0
        ? 0
        : firstHalf.reduce((a, d) => a + d.completed, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.length === 0
        ? 0
        : secondHalf.reduce((a, d) => a + d.completed, 0) / secondHalf.length;
    const delta = secondAvg - firstAvg;
    let insight = "Consistency grows quietly. Keep showing up.";
    if (delta > 0.4) insight = "Your focus improved in the second half of the week.";
    if (delta < -0.4) insight = "Your focus dipped midweek. A lighter Thursday plan may help.";

    return {
      consistency,
      bestDay: best.weekdayShort,
      bestCompleted: best.completed,
      insight,
    };
  }, [week]);

  return (
    <View style={styles.shell}>
      <Text style={styles.kicker}>Weekly review</Text>
      <Text style={styles.title}>You showed up {summary.consistency}% this week.</Text>
      <Text style={styles.copy}>
        Best day: {summary.bestDay} ({summary.bestCompleted} habits). {summary.insight}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.88 }]}
      >
        <Text style={styles.ctaLabel}>
          {todayIsSunday ? "Open Sunday recap" : "Open weekly recap"}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Week Recap</Text>
            <Text style={styles.modalBody}>Consistency: {summary.consistency}%</Text>
            <Text style={styles.modalBody}>Best day: {summary.bestDay}</Text>
            <Text style={styles.modalBody}>
              Missed habits: {Math.max(0, 100 - summary.consistency)}% gap to perfect week
            </Text>
            <Text style={styles.modalBody}>{summary.insight}</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.modalBtn}>
              <Text style={styles.modalBtnLabel}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 24,
    padding: 16,
    gap: 8,
  },
  kicker: {
    fontSize: 12,
    color: ACCENT_LIME,
    fontFamily: Fonts.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 20,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
    letterSpacing: -0.3,
  },
  copy: {
    fontSize: 13,
    lineHeight: 18,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  cta: {
    marginTop: 6,
    backgroundColor: ACCENT_LIME,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  ctaLabel: {
    color: ACCENT_ON_LIME,
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    padding: 16,
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.bold,
  },
  modalBody: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    fontFamily: Fonts.medium,
  },
  modalBtn: {
    marginTop: 6,
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: SURFACE_MUTED,
  },
  modalBtnLabel: {
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
  },
});
