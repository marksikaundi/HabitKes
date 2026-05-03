/**
 * Design tokens — lime accent, charcoal text, Outfit (loaded in app/_layout).
 */

import { Platform } from "react-native";

/** Primary lime from UI mockups (~#C7F432 / neon lime) */
export const ACCENT_LIME = "#C7F432";
export const ACCENT_ON_LIME = "#1C2011";
export const TEXT_PRIMARY = "#1C2011";
export const TEXT_SECONDARY = "#6D7588";
export const BACKGROUND_PAGE = "#FFFFFF";
export const SURFACE_MUTED = "#F5F6FA";
export const BORDER_SUBTLE = "#E8EAEF";

export const Colors = {
  light: {
    text: TEXT_PRIMARY,
    textSecondary: TEXT_SECONDARY,
    background: BACKGROUND_PAGE,
    tint: ACCENT_LIME,
    accent: ACCENT_LIME,
    accentForeground: ACCENT_ON_LIME,
    accentDark: ACCENT_ON_LIME,
    icon: TEXT_SECONDARY,
    tabIconDefault: TEXT_SECONDARY,
    tabIconSelected: ACCENT_LIME,
    surfaceMuted: SURFACE_MUTED,
    border: BORDER_SUBTLE,
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9CA3AF",
    background: "#0F1112",
    tint: ACCENT_LIME,
    accent: ACCENT_LIME,
    accentForeground: ACCENT_ON_LIME,
    accentDark: ACCENT_ON_LIME,
    icon: TEXT_SECONDARY,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: ACCENT_LIME,
    surfaceMuted: "#1A1D21",
    border: "rgba(255,255,255,0.08)",
  },
};

export type AppFonts = {
  sans: string;
  medium: string;
  semibold: string;
  bold: string;
};

const outfitNative: AppFonts = {
  sans: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
};

const outfitWeb: AppFonts = {
  sans: "Outfit, system-ui, sans-serif",
  medium: "Outfit, system-ui, sans-serif",
  semibold: "Outfit, system-ui, sans-serif",
  bold: "Outfit, system-ui, sans-serif",
};

export const Fonts = Platform.select({
  ios: outfitNative,
  android: outfitNative,
  web: outfitWeb,
}) as AppFonts;
