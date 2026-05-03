import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";
import type { SvgProps } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

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

// On New Architecture this API is a no-op and logs a warning; only enable on legacy bridge.
const shouldUseLegacyAndroidLayoutAnimationFlag =
  Platform.OS === "android" &&
  typeof UIManager.setLayoutAnimationEnabledExperimental === "function" &&
  // Fabric is present when New Architecture is on
  (global as { nativeFabricUIManager?: unknown }).nativeFabricUIManager == null;

if (shouldUseLegacyAndroidLayoutAnimationFlag) {
  UIManager.setLayoutAnimationEnabledExperimental!(true);
}

type CollectionItem = {
  id: string;
  title: string;
  detail: string;
};

type Collection = {
  id: string;
  title: string;
  tagline: string;
  Illustration: ComponentType<SvgProps>;
  items: CollectionItem[];
};

const COLLECTIONS: Collection[] = [
  {
    id: "morning",
    title: "Morning fuel",
    tagline: "Start the day with clarity—small rituals that stack.",
    Illustration: FocusSvg,
    items: [
      {
        id: "m1",
        title: "Sunlight first",
        detail: "Open curtains or step outside within 10 minutes of waking.",
      },
      {
        id: "m2",
        title: "Hydrate before caffeine",
        detail: "One glass of water conditions your system for focus.",
      },
      {
        id: "m3",
        title: "Three priorities",
        detail: "Write down three outcomes that would make today a win.",
      },
      {
        id: "m4",
        title: "Movement snack",
        detail: "Two minutes of stretching or a short walk unlocks momentum.",
      },
    ],
  },
  {
    id: "wind-down",
    title: "Wind-down",
    tagline: "Signals that tell your mind the day is closing gently.",
    Illustration: MeditationSvg,
    items: [
      {
        id: "w1",
        title: "Dim & dimmer",
        detail: "Lower lights and screens 45 minutes before bed.",
      },
      {
        id: "w2",
        title: "Brain dump",
        detail: "List loose thoughts on paper so they stop looping.",
      },
      {
        id: "w3",
        title: "Same wake time",
        detail: "Anchor sleep quality with a consistent alarm—weekends too.",
      },
    ],
  },
  {
    id: "deep-work",
    title: "Deep sessions",
    tagline: "Protect attention blocks that actually move the needle.",
    Illustration: ReadingSvg,
    items: [
      {
        id: "d1",
        title: "Single tab rule",
        detail: "One browser tab or doc during the block—no peeking.",
      },
      {
        id: "d2",
        title: "Timer boundary",
        detail: "25–50 minute sprints with a visible countdown.",
      },
      {
        id: "d3",
        title: "Shutdown phrase",
        detail: "When the timer ends, close with one line of progress.",
      },
    ],
  },
  {
    id: "together",
    title: "Together",
    tagline: "Stay accountable without the guilt spiral.",
    Illustration: TeamSvg,
    items: [
      {
        id: "t1",
        title: "Weekly check-in",
        detail: "Share one win and one friction with someone you trust.",
      },
      {
        id: "t2",
        title: "Micro-commitments",
        detail: "Promise only what you can do before the next message.",
      },
      {
        id: "t3",
        title: "Celebrate small",
        detail: "React to others’ streaks—social proof compounds.",
      },
    ],
  },
  {
    id: "path",
    title: "Path forward",
    tagline: "Review and adjust without throwing away the whole plan.",
    Illustration: JourneySvg,
    items: [
      {
        id: "p1",
        title: "Friday retro",
        detail: "What worked once? Double down next week.",
      },
      {
        id: "p2",
        title: "Cut one thing",
        detail: "Remove the lowest-value habit before adding a new one.",
      },
      {
        id: "p3",
        title: "Rewrite one rule",
        detail: "If you broke a streak, redefine “minimum viable” success.",
      },
    ],
  },
];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const featuredWidth = Math.min(300, width - 56);
  const [expandedId, setExpandedId] = useState<string | null>(COLLECTIONS[0]?.id ?? null);

  const animateLayout = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const toggle = useCallback((id: string) => {
    animateLayout();
    if (Platform.OS === "ios") {
      void Haptics.selectionAsync();
    }
    setExpandedId((prev) => (prev === id ? null : id));
  }, [animateLayout]);

  const openCollection = useCallback(
    (id: string) => {
      animateLayout();
      if (Platform.OS === "ios") {
        void Haptics.selectionAsync();
      }
      setExpandedId(id);
    },
    [animateLayout],
  );

  const featured = COLLECTIONS.slice(0, 3);

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
        <Text style={styles.kicker}>Library</Text>
        <Text style={styles.headline}>Collections built for real streaks</Text>
        <Text style={styles.lede}>
          Curated packs of ideas you can borrow—mix and match what fits your
          week.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredRow}
        decelerationRate="fast"
        snapToInterval={featuredWidth + 14}
        snapToAlignment="start"
      >
        {featured.map((c) => {
          const Ill = c.Illustration;
          return (
            <Pressable
              key={c.id}
              onPress={() => openCollection(c.id)}
              style={({ pressed }) => [
                styles.featuredCard,
                { width: featuredWidth },
                pressed && styles.featuredPressed,
              ]}
            >
              <View style={styles.featuredArt}>
                <Ill width={featuredWidth - 48} height={88} />
              </View>
              <Text style={styles.featuredTitle}>{c.title}</Text>
              <Text style={styles.featuredTagline}>{c.tagline}</Text>
              <View style={styles.featuredChip}>
                <Text style={styles.featuredChipText}>
                  {c.items.length} ideas
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={[styles.sectionLabel, styles.sectionSpaced]}>
        Browse collections
      </Text>

      {COLLECTIONS.map((collection) => {
        const Ill = collection.Illustration;
        const open = expandedId === collection.id;

        return (
          <View key={collection.id} style={styles.collectionShell}>
            <Pressable
              onPress={() => toggle(collection.id)}
              style={({ pressed }) => [
                styles.collectionHeader,
                pressed && styles.collectionHeaderPressed,
              ]}
            >
              <View style={styles.collectionThumb}>
                <Ill width={56} height={48} />
              </View>
              <View style={styles.collectionTitles}>
                <Text style={styles.collectionTitle}>{collection.title}</Text>
                <Text style={styles.collectionTagline}>{collection.tagline}</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{collection.items.length}</Text>
              </View>
              <Text style={styles.chevron}>{open ? "▾" : "▸"}</Text>
            </Pressable>

            {open ? (
              <View style={styles.itemsBlock}>
                {collection.items.map((item, idx) => (
                  <View
                    key={item.id}
                    style={[
                      styles.itemRow,
                      idx < collection.items.length - 1 && styles.itemRowSep,
                    ]}
                  >
                    <View style={styles.itemBullet} />
                    <View style={styles.itemCopy}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDetail}>{item.detail}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          Tap a featured card or any collection to expand ideas. Use what helps,
          skip what doesn&apos;t—your streak stays yours.
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
  },

  header: {
    marginBottom: 22,
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
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  sectionSpaced: {
    marginTop: 28,
  },

  featuredRow: {
    gap: 14,
    paddingBottom: 8,
    paddingRight: 8,
  },
  featuredCard: {
    borderRadius: 26,
    padding: 16,
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  featuredPressed: {
    opacity: 0.92,
  },
  featuredArt: {
    alignItems: "center",
    marginBottom: 12,
    minHeight: 92,
    justifyContent: "center",
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  featuredTagline: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredChip: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT_LIME,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  featuredChipText: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },

  collectionShell: {
    marginBottom: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    backgroundColor: BACKGROUND_PAGE,
    overflow: "hidden",
  },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  collectionHeaderPressed: {
    backgroundColor: SURFACE_MUTED,
  },
  collectionThumb: {
    width: 64,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(199, 244, 50, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  collectionTitles: {
    flex: 1,
    gap: 4,
  },
  collectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  collectionTagline: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  countBadge: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: SURFACE_MUTED,
    alignItems: "center",
  },
  countBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  chevron: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    width: 20,
    textAlign: "center",
  },

  itemsBlock: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_SUBTLE,
  },
  itemRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  itemRowSep: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_SUBTLE,
  },
  itemBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_LIME,
    marginTop: 6,
  },
  itemCopy: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  itemDetail: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },

  footerNote: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: SURFACE_MUTED,
    marginBottom: 8,
  },
  footerNoteText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 21,
  },
});
