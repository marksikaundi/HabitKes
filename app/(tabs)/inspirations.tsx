import type { ComponentType } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { SvgProps } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FocusSvg from "@/assets/undraw/focus.svg";
import JourneySvg from "@/assets/undraw/journey.svg";
import MeditationSvg from "@/assets/undraw/meditation.svg";
import ReadingSvg from "@/assets/undraw/reading.svg";
import TeamSvg from "@/assets/undraw/team.svg";
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

type InspirationQuote = {
  id: string;
  text: string;
  author: string;
};

type SparkCard = {
  id: string;
  title: string;
  caption: string;
  Illustration: ComponentType<SvgProps>;
};

/** Illustrations from [unDraw](https://undraw.co/) — bundled SVGs, primary tint matches app lime. */
const DAILY_SPARKS: SparkCard[] = [
  {
    id: "1",
    title: "One breath before you begin",
    caption: "Pause for a single slow inhale before your next task.",
    Illustration: FocusSvg,
  },
  {
    id: "2",
    title: "Two-minute rule",
    caption: "If it takes less than two minutes, do it now.",
    Illustration: ReadingSvg,
  },
  {
    id: "3",
    title: "Gratitude tap",
    caption: "Name one thing that went okay today out loud.",
    Illustration: JourneySvg,
  },
];

const QUOTES: InspirationQuote[] = [
  {
    id: "q1",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant",
  },
  {
    id: "q2",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    id: "q3",
    text: "Small steps every day add up to pathways you never planned.",
    author: "Habora",
  },
  {
    id: "q4",
    text: "You do not rise to the level of your goals; you fall to the level of your systems.",
    author: "James Clear",
  },
];

export default function InspirationsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const sparkWidth = Math.min(280, width - 72);
  const heroW = Math.min(340, width - 56);
  const heroH = heroW * (618 / 818) * 0.42;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.page,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 120),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>Inspirations</Text>
        <Text style={styles.headline}>Fuel for the next small step</Text>
        <Text style={styles.lede}>
          Gentle prompts, quotes, and ideas—styled to match your streak energy.
        </Text>
      </View>

      <View style={styles.heroOuter}>
        <View style={styles.heroLime} />
        <View style={styles.heroFade} />
        <View style={styles.heroInner}>
          <View style={styles.heroIllustration}>
            <MeditationSvg width={heroW} height={heroH} />
          </View>
          <Text style={styles.heroTitle}>Today is enough</Text>
          <Text style={styles.heroBody}>
            You don&apos;t need a perfect week—only an honest next choice.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Daily sparks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sparkRow}
        decelerationRate="fast"
        snapToInterval={sparkWidth + 12}
        snapToAlignment="start"
      >
        {DAILY_SPARKS.map((item) => {
          const Illustration = item.Illustration;
          return (
            <View
              key={item.id}
              style={[styles.sparkCard, { width: sparkWidth }]}
            >
              <View style={styles.sparkIllustration}>
                <Illustration
                  width={Math.min(200, sparkWidth - 32)}
                  height={92}
                />
              </View>
              <Text style={styles.sparkTitle}>{item.title}</Text>
              <Text style={styles.sparkCaption}>{item.caption}</Text>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionLabel}>Words to carry</Text>
      <View style={styles.quoteStack}>
        {QUOTES.map((q, index) => (
          <View
            key={q.id}
            style={[styles.quoteCard, index === 0 && styles.quoteCardFeatured]}
          >
            {index === 0 ? (
              <View style={styles.quoteFeaturedArt}>
                <ReadingSvg width={52} height={40} />
              </View>
            ) : null}
            <Text
              style={[
                styles.quoteText,
                index === 0 && styles.quoteTextFeatured,
              ]}
            >
              {q.text}
            </Text>
            <Text style={styles.quoteAuthor}>— {q.author}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerHint}>
        <TeamSvg width={36} height={28} />
        <Text style={styles.footerHintText}>
          Illustrations from unDraw · customize colors anytime at undraw.co
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BACKGROUND_PAGE,
  },
  page: {
    paddingHorizontal: 20,
    gap: 4,
  },

  header: {
    marginBottom: 20,
  },
  kicker: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: ACCENT_LIME,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  headline: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  lede: {
    marginTop: 10,
    fontSize: 16,
    color: TEXT_SECONDARY,
    lineHeight: 24,
    maxWidth: 340,
  },

  heroOuter: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 28,
    backgroundColor: SURFACE_MUTED,
  },
  heroLime: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ACCENT_LIME,
    opacity: 0.95,
  },
  heroFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SURFACE_MUTED,
    opacity: 0.55,
  },
  heroInner: {
    padding: 20,
    paddingTop: 18,
  },
  heroIllustration: {
    alignItems: "center",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: ACCENT_ON_LIME,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  heroBody: {
    fontSize: 16,
    color: ACCENT_ON_LIME,
    opacity: 0.92,
    lineHeight: 24,
    maxWidth: 320,
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 14,
    marginTop: 8,
  },

  sparkRow: {
    gap: 12,
    paddingRight: 8,
    paddingBottom: 8,
  },
  sparkCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    shadowColor: ACCENT_ON_LIME,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sparkIllustration: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minHeight: 96,
  },
  sparkTitle: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  sparkCaption: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },

  quoteStack: {
    gap: 12,
  },
  quoteCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    overflow: "hidden",
  },
  quoteCardFeatured: {
    backgroundColor: BACKGROUND_PAGE,
    borderColor: ACCENT_LIME,
    borderWidth: 1.5,
  },
  quoteFeaturedArt: {
    position: "absolute",
    top: 14,
    right: 14,
    opacity: 0.95,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    lineHeight: 25,
    letterSpacing: -0.1,
  },
  quoteTextFeatured: {
    fontFamily: Fonts.semibold,
    fontSize: 17,
    lineHeight: 26,
    paddingRight: 56,
  },
  quoteAuthor: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },

  footerHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    backgroundColor: SURFACE_MUTED,
  },
  footerHintText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 19,
  },
});
