/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Modern design system with improved color palettes and semantic naming.
 */

const tintColorLight = "#6366F1"; // Modern indigo
const tintColorDark = "#8B5CF6"; // Modern purple

export const Colors = {
  light: {
    text: "#1F2937", // Rich dark gray
    background: "#F8FAFC", // Clean off-white
    tint: tintColorLight,
    icon: "#6B7280", // Balanced gray
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,
    card: "#FFFFFF",
    border: "#E5E7EB",
    // Additional modern colors
    primary: tintColorLight,
    secondary: "#10B981", // Emerald green
    accent: "#F59E0B", // Amber
    danger: "#EF4444", // Red
    warning: "#F59E0B", // Amber
    success: "#10B981", // Emerald
    muted: "#F3F4F6", // Light gray background
    mutedForeground: "#6B7280",
    surface: "#FFFFFF",
    surfaceSecondary: "#F9FAFB",
    // Gradient colors
    gradientStart: "#6366F1",
    gradientEnd: "#8B5CF6",
  },
  dark: {
    text: "#F9FAFB", // Clean white
    background: "#0F172A", // Deep slate
    tint: tintColorDark,
    icon: "#9CA3AF",
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,
    card: "#1E293B", // Slate 800
    border: "#334155", // Slate 600
    // Additional modern colors
    primary: tintColorDark,
    secondary: "#34D399", // Emerald 400
    accent: "#FBBF24", // Amber 400
    danger: "#F87171", // Red 400
    warning: "#FBBF24", // Amber 400
    success: "#34D399", // Emerald 400
    muted: "#1E293B", // Slate 800
    mutedForeground: "#94A3B8", // Slate 400
    surface: "#1E293B", // Slate 800
    surfaceSecondary: "#0F172A", // Slate 900
    // Gradient colors
    gradientStart: "#8B5CF6",
    gradientEnd: "#EC4899",
  },
};
