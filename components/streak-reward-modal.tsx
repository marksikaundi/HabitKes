import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  Fonts,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import { useStreakGamification } from "@/lib/streak-gamification";

export function StreakRewardModal() {
  const { pendingMilestone, dismissPendingMilestone, snapshot } =
    useStreakGamification();

  if (!pendingMilestone) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={dismissPendingMilestone}
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={dismissPendingMilestone}
          accessibilityLabel="Dismiss"
        />
        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>
            <Text style={styles.spark}>✨</Text>
            <Text style={styles.badge}>Streak reward</Text>
            <Text style={styles.title}>{pendingMilestone.title}</Text>
            <Text style={styles.subtitle}>{pendingMilestone.subtitle}</Text>
            <View style={styles.bonusRow}>
              <Text style={styles.bonusLabel}>Spark bonus</Text>
              <Text style={styles.bonusValue}>
                +{pendingMilestone.sparkBonus}
              </Text>
            </View>
            <Text style={styles.balance}>
              Total Spark points: {snapshot.sparkPoints}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
              onPress={dismissPendingMilestone}
            >
              <Text style={styles.ctaText}>Claim & continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 32, 17, 0.45)",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 28,
    padding: 24,
    backgroundColor: BACKGROUND_PAGE,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  spark: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 4,
  },
  badge: {
    alignSelf: "center",
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 8,
  },
  bonusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "rgba(199, 244, 50, 0.35)",
    borderWidth: 1,
    borderColor: ACCENT_LIME,
  },
  bonusLabel: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },
  bonusValue: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: ACCENT_ON_LIME,
  },
  balance: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 4,
  },
  cta: {
    marginTop: 16,
    backgroundColor: ACCENT_LIME,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },
});
