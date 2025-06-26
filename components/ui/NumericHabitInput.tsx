import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface NumericHabitInputProps {
  habitName: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  onValueChange: (value: number) => void;
  onSave: () => void;
  emoji?: string;
}

export const NumericHabitInput: React.FC<NumericHabitInputProps> = ({
  habitName,
  unit,
  targetValue,
  currentValue,
  onValueChange,
  onSave,
  emoji,
}) => {
  const [inputValue, setInputValue] = useState(currentValue.toString());
  const [isEditing, setIsEditing] = useState(false);
  
  const primaryColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  const handleSave = () => {
    const numValue = parseFloat(inputValue) || 0;
    onValueChange(numValue);
    setIsEditing(false);
    onSave();
  };

  const handleCancel = () => {
    setInputValue(currentValue.toString());
    setIsEditing(false);
  };

  const incrementValue = () => {
    const newValue = currentValue + 1;
    setInputValue(newValue.toString());
    onValueChange(newValue);
  };

  const decrementValue = () => {
    const newValue = Math.max(0, currentValue - 1);
    setInputValue(newValue.toString());
    onValueChange(newValue);
  };

  const getProgressPercentage = () => {
    return Math.min((currentValue / targetValue) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return '#4CAF50'; // Green
    if (percentage >= 75) return '#FF9800'; // Orange
    return primaryColor;
  };

  const isGoalAchieved = currentValue >= targetValue;

  return (
    <ThemedView style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.header}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <ThemedText style={styles.habitName}>{habitName}</ThemedText>
      </View>

      <View style={styles.valueContainer}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: primaryColor }]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={textColor + '80'}
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: '#4CAF50' }]}
                onPress={handleSave}
              >
                <Ionicons name="checkmark" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: '#FF5252' }]}
                onPress={handleCancel}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.displayContainer}>
            <View style={styles.valueDisplay}>
              <View style={styles.controls}>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: primaryColor }]}
                  onPress={decrementValue}
                >
                  <Ionicons name="remove" size={20} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.valueButton}
                  onPress={() => setIsEditing(true)}
                >
                  <ThemedText style={[styles.currentValue, { color: textColor }]}>
                    {currentValue}
                  </ThemedText>
                  <ThemedText style={styles.unit}>{unit}</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: primaryColor }]}
                  onPress={incrementValue}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.targetInfo}>
        <ThemedText style={styles.targetText}>
          Target: {targetValue} {unit}
        </ThemedText>
        <ThemedText style={[styles.remainingText, { color: isGoalAchieved ? '#4CAF50' : textColor }]}>
          {isGoalAchieved 
            ? `🎉 Goal achieved! +${currentValue - targetValue} extra ${unit}`
            : `${targetValue - currentValue} ${unit} remaining`
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
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  valueContainer: {
    marginBottom: 16,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 100,
    marginRight: 12,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayContainer: {
    alignItems: 'center',
  },
  valueDisplay: {
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 120,
  },
  currentValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: -4,
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
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
  },
});
