import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Design, createTextStyle } from '@/constants/Design';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const inputStyles = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: error ? colors.danger : colors.border,
      color: colors.text,
    },
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={inputStyles}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.danger }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Design.spacing.md,
  },
  label: {
    ...createTextStyle('sm', 'medium'),
    marginBottom: Design.spacing.xs,
  },
  input: {
    height: Design.dimensions.inputHeight,
    borderWidth: 1,
    borderRadius: Design.borderRadius.lg,
    paddingHorizontal: Design.spacing.lg,
    ...createTextStyle('base'),
  },
  error: {
    ...createTextStyle('sm'),
    marginTop: Design.spacing.xs,
  },
});
