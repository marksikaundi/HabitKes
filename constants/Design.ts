/**
 * Modern Design System
 * Consistent spacing, typography, shadows, and border radius values
 */

export const Design = {
  // Spacing scale (4px base unit)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },

  // Typography scale
  typography: {
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
      '6xl': 48,
    },
    // Font weights
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // Border radius scale
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },

  // Shadow presets
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Animation durations
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
  },

  // Common dimensions
  dimensions: {
    buttonHeight: 48,
    inputHeight: 44,
    tabBarHeight: 80,
    headerHeight: 60,
    iconSize: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    },
  },
};

// Utility functions for consistent styling
export const createButtonStyle = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  const baseStyle = {
    height: Design.dimensions.buttonHeight,
    borderRadius: Design.borderRadius.lg,
    paddingHorizontal: Design.spacing.xl,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    ...Design.shadow.sm,
  };

  return baseStyle;
};

export const createCardStyle = (elevated: boolean = true) => ({
  borderRadius: Design.borderRadius.xl,
  padding: Design.spacing.xl,
  ...(elevated ? Design.shadow.md : {}),
});

export const createTextStyle = (
  size: keyof typeof Design.typography.fontSize,
  weight: keyof typeof Design.typography.fontWeight = 'normal'
) => ({
  fontSize: Design.typography.fontSize[size],
  fontWeight: Design.typography.fontWeight[weight],
  lineHeight: Design.typography.fontSize[size] * Design.typography.lineHeight.normal,
});
