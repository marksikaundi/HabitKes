import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Design, createCardStyle, createTextStyle } from '@/constants/Design';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  padding?: keyof typeof Design.spacing;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = true,
  padding = 'xl',
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cardStyles = [
    createCardStyle(elevated),
    {
      backgroundColor: colors.surface,
      padding: Design.spacing[padding],
    },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

interface ProgressCardProps {
  current: number;
  total: number;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  current,
  total,
  title,
  subtitle,
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const progressWidth = total > 0 ? (current / total) * 100 : 0;

  return (
    <Card style={style}>
      <View style={styles.progressHeader}>
        <View style={styles.progressInfo}>
          <Text style={[createTextStyle('3xl', 'bold'), { color: colors.text }]}>
            {current}/{total}
          </Text>
          <Text style={[createTextStyle('base', 'medium'), { color: colors.mutedForeground }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[createTextStyle('sm'), { color: colors.mutedForeground, marginTop: Design.spacing.xs }]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
          <Text style={[createTextStyle('lg', 'bold'), { color: colors.primary }]}>
            {percentage}%
          </Text>
        </View>
      </View>
      
      <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressWidth}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  progressCard: {
    // Additional styles will be applied via createCardStyle
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Design.spacing.lg,
  },
  progressInfo: {
    flex: 1,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Design.spacing.lg,
  },
  progressBar: {
    height: 8,
    borderRadius: Design.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Design.borderRadius.full,
  },
});
