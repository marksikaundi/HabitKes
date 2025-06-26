import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface StatItemProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, color }) => {
  const textColor = useThemeColor({}, 'text');
  
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <ThemedText style={[styles.statValue, { color: textColor }]}>
        {value}
      </ThemedText>
      <ThemedText style={[styles.statLabel, { color: textColor + '70' }]}>
        {label}
      </ThemedText>
    </View>
  );
};

interface HabitSummaryStatsProps {
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  activeStreak?: number;
}

export const HabitSummaryStats: React.FC<HabitSummaryStatsProps> = ({
  totalHabits,
  completedHabits,
  completionRate,
  activeStreak = 0,
}) => {
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const getCompletionColor = () => {
    if (completionRate >= 80) return '#4CAF50';
    if (completionRate >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: cardColor, borderColor }]}>
      <View style={styles.statsGrid}>
        <StatItem
          icon="list-outline"
          value={totalHabits}
          label="Total"
          color="#2196F3"
        />
        <StatItem
          icon="checkmark-circle"
          value={completedHabits}
          label="Completed"
          color="#4CAF50"
        />
        <StatItem
          icon="analytics"
          value={`${completionRate}%`}
          label="Success Rate"
          color={getCompletionColor()}
        />
        <StatItem
          icon="flame"
          value={activeStreak}
          label="Streak"
          color="#FF5722"
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
