/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// New palette inspired by user's design
const ACCENT_LIME = "#C8FF1A";
const ACCENT_DARK = "#1C2011";
const BACKGROUND_LIGHT = "#F5F6FA";
const MUTED_BLUE = "#6D7588";

export const Colors = {
  light: {
    text: "#11181C",
    background: BACKGROUND_LIGHT,
    bold: 'Outfit_700Bold',
    rounded: 'Outfit_600SemiBold',
    icon: MUTED_BLUE,
    tabIconDefault: MUTED_BLUE,
    tabIconSelected: ACCENT_LIME,
    accent: ACCENT_LIME,
    bold: 'Outfit_700Bold',
    rounded: 'Outfit_600SemiBold',
  },
  dark: {
    text: "#ECEDEE",
    rounded: "Outfit, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    background: "#0F1112",
    tint: ACCENT_LIME,
    icon: MUTED_BLUE,
    tabIconDefault: MUTED_BLUE,
    tabIconSelected: ACCENT_LIME,
    accent: ACCENT_LIME,
    accentDark: ACCENT_DARK,
  },
};

// Platform font fallbacks left intentionally minimal; Outfit family is loaded at app startup.

export const Fonts = Platform.select({
  ios: {
    sans: "Outfit_400Regular",
    semibold: "Outfit_600SemiBold",
    bold: "Outfit_700Bold",
  },
  android: {
    sans: "Outfit_400Regular",
    semibold: "Outfit_600SemiBold",
    bold: "Outfit_700Bold",
  },
  web: {
    sans: "Outfit, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
});
