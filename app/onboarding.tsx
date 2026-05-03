import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  Fonts,
  SURFACE_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";

const MIND_OPTIONS: { emoji: string; label: string }[] = [
  { emoji: "😊", label: "Elevate mood" },
  { emoji: "😌", label: "Reduce stress and anxiety" },
  { emoji: "😴", label: "Improve sleep" },
  { emoji: "⚡", label: "Increase productivity" },
  { emoji: "❓", label: "Something else" },
];

const AGE_OPTIONS = [
  "Under 18",
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55–64",
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [step, setStep] = useState(0);
  const [mindIndex, setMindIndex] = useState(1);
  const [ageIndex, setAgeIndex] = useState(2);

  const progress = step === 0 ? 0.45 : 0.9;

  const finish = () => router.replace("/(tabs)");
  const goContinue = () => {
    if (step === 0) setStep(1);
    else finish();
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable
          style={styles.circleBtn}
          onPress={() => {
            if (step > 0) setStep(0);
            else if (router.canGoBack()) router.back();
            else router.replace("/(tabs)");
          }}
          accessibilityRole="button"
          accessibilityLabel={step === 0 ? "Go back" : "Previous step"}
        >
          <IconSymbol name="chevron.left" size={22} color={TEXT_PRIMARY} />
        </Pressable>
        <View style={[styles.progressTrack, { width: width * 0.42 }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Pressable style={styles.skipPill} onPress={finish}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {step === 0 ? (
        <>
          <Text style={styles.title}>What&apos;s on your mind?</Text>
          <Text style={styles.subtitle}>
            Your answers will help shape the app around your need
          </Text>
          <View style={styles.list}>
            {MIND_OPTIONS.map((item, i) => {
              const selected = mindIndex === i;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => setMindIndex(i)}
                  style={[
                    styles.option,
                    selected && styles.optionSelected,
                  ]}
                >
                  <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      selected && styles.optionLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>How old are you?</Text>
          <Text style={styles.subtitle}>
            Your answers will help shape the app around your needs.
          </Text>
          <View style={styles.list}>
            {AGE_OPTIONS.map((label, i) => {
              const selected = ageIndex === i;
              return (
                <Pressable
                  key={label}
                  onPress={() => setAgeIndex(i)}
                  style={[
                    styles.option,
                    styles.optionPlain,
                    selected && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.ageLabel,
                      selected && styles.optionLabelSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <View style={styles.footer}>
        <Pressable style={styles.continueBtn} onPress={goContinue}>
          <Text style={styles.continueLabel}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND_PAGE,
    paddingHorizontal: 22,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SURFACE_MUTED,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: SURFACE_MUTED,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: ACCENT_LIME,
  },
  skipPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: SURFACE_MUTED,
  },
  skipText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 28,
  },
  list: {
    gap: 12,
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: SURFACE_MUTED,
  },
  optionPlain: {
    justifyContent: "center",
  },
  optionSelected: {
    backgroundColor: ACCENT_LIME,
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    textAlign: "center",
    flexShrink: 1,
  },
  optionLabelSelected: {
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },
  ageLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  footer: {
    paddingTop: 12,
  },
  continueBtn: {
    backgroundColor: ACCENT_LIME,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueLabel: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },
});
