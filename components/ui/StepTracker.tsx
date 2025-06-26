import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useStepCounter } from '@/hooks/useStepCounter';
import { Ionicons } from '@expo/vector-icons';

interface StepTrackerProps {
  targetSteps: number;
  onStepsUpdate: (steps: number) => void;
  currentSteps?: number;
}

export const StepTracker: React.FC<StepTrackerProps> = ({
  targetSteps,
  onStepsUpdate,
  currentSteps = 0,
}) => {
  const { stepData, isTracking, startTracking, stopTracking, getTodaySteps } = useStepCounter();
  const [displaySteps, setDisplaySteps] = useState(currentSteps);
  
  const primaryColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  useEffect(() => {
    if (stepData.steps > 0) {
      setDisplaySteps(stepData.steps);
      onStepsUpdate(stepData.steps);
    }
  }, [stepData.steps, onStepsUpdate]);

  const refreshSteps = async () => {
    try {
      const todaySteps = await getTodaySteps();
      setDisplaySteps(todaySteps);
      onStepsUpdate(todaySteps);
    } catch (err) {
      console.error('Error refreshing steps:', err);
      Alert.alert('Error', 'Failed to get step count');
    }
  };

  const getProgressPercentage = () => {
    return Math.min((displaySteps / targetSteps) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return '#4CAF50'; // Green
    if (percentage >= 75) return '#FF9800'; // Orange
    return primaryColor;
  };

  const isGoalAchieved = displaySteps >= targetSteps;

  if (!stepData.isAvailable) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: cardColor }]}>
        <ThemedText style={styles.errorText}>
          {stepData.error || 'Step tracking is not available on this device'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.header}>
        <Ionicons name="footsteps" size={24} color={primaryColor} />
        <ThemedText style={styles.title}>Step Tracker</ThemedText>
        <TouchableOpacity onPress={refreshSteps} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.stepDisplay}>
        <ThemedText style={[styles.stepCount, { color: textColor }]}>
          {displaySteps.toLocaleString()}
        </ThemedText>
        <ThemedText style={styles.stepLabel}>steps</ThemedText>
      </View>

      <View style={styles.targetInfo}>
        <ThemedText style={styles.targetText}>
          Target: {targetSteps.toLocaleString()} steps
        </ThemedText>
        <ThemedText style={[styles.remainingText, { color: isGoalAchieved ? '#4CAF50' : textColor }]}>
          {isGoalAchieved 
            ? `🎉 Goal achieved! +${(displaySteps - targetSteps).toLocaleString()} extra steps`
            : `${(targetSteps - displaySteps).toLocaleString()} steps remaining`
          }
        </ThemedText>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${getProgressPercentage()}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          {getProgressPercentage().toFixed(0)}%
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={startTracking}
          >
            <Ionicons name="play" size={16} color="white" />
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF5252' }]}
            onPress={stopTracking}
          >
            <Ionicons name="stop" size={16} color="white" />
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  refreshButton: {
    padding: 4,
  },
  stepDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  targetInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  targetText: {
    fontSize: 14,
    opacity: 0.8,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
  },
  actions: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
