import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Design, createButtonStyle, createTextStyle } from '@/constants/Design';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: any; // Use any for now to avoid icon name conflicts
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const buttonStyles = [
    styles.button,
    createButtonStyle(),
    {
      backgroundColor: getBackgroundColor(variant, colors),
      borderColor: getBorderColor(variant, colors),
      borderWidth: variant === 'ghost' || variant === 'secondary' ? 1 : 0,
      height: getButtonHeight(size),
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  const textStyles = [
    createTextStyle(getTextSize(size), 'semibold'),
    {
      color: getTextColor(variant, colors),
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor(variant, colors)}
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && (
            <IconSymbol
              name={icon}
              size={getIconSize(size)}
              color={getTextColor(variant, colors)}
              style={styles.buttonIcon}
            />
          )}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Helper functions
const getBackgroundColor = (variant: string, colors: any) => {
  switch (variant) {
    case 'primary':
      return colors.primary;
    case 'secondary':
      return colors.secondary;
    case 'danger':
      return colors.danger;
    case 'ghost':
      return 'transparent';
    default:
      return colors.primary;
  }
};

const getBorderColor = (variant: string, colors: any) => {
  switch (variant) {
    case 'secondary':
      return colors.secondary;
    case 'ghost':
      return colors.border;
    case 'danger':
      return colors.danger;
    default:
      return 'transparent';
  }
};

const getTextColor = (variant: string, colors: any) => {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'danger':
      return '#FFFFFF';
    case 'ghost':
      return colors.text;
    default:
      return '#FFFFFF';
  }
};

const getButtonHeight = (size: string) => {
  switch (size) {
    case 'sm':
      return 36;
    case 'lg':
      return 56;
    default:
      return Design.dimensions.buttonHeight;
  }
};

const getTextSize = (size: string): keyof typeof Design.typography.fontSize => {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    default:
      return 'base';
  }
};

const getIconSize = (size: string) => {
  switch (size) {
    case 'sm':
      return 16;
    case 'lg':
      return 24;
    default:
      return 20;
  }
};

const styles = StyleSheet.create({
  button: {
    ...createButtonStyle(),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: Design.spacing.sm,
  },
});
