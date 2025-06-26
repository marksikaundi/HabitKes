import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { HABIT_COLORS, HABIT_EMOJIS, HabitType } from '@/types/habit';

interface CreateStepHabitFormProps {
  onSubmit: (habitData: {
    name: string;
    description?: string;
    color: string;
    emoji?: string;
    type: HabitType;
    targetValue: number;
    unit: string;
  }) => void;
  onCancel: () => void;
}

export const CreateStepHabitForm: React.FC<CreateStepHabitFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState('👟');
  const [targetSteps, setTargetSteps] = useState('10000');
  const [habitType, setHabitType] = useState<HabitType>('steps');

  const primaryColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const backgroundColor = useThemeColor({}, 'background');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const target = parseInt(targetSteps) || 0;
    if (target <= 0) {
      Alert.alert('Error', 'Please enter a valid target number');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color: selectedColor,
      emoji: selectedEmoji,
      type: habitType,
      targetValue: target,
      unit: habitType === 'steps' ? 'steps' : 'units',
    });
  };

  const stepPresets = [
    { label: '5,000 steps', value: 5000 },
    { label: '10,000 steps', value: 10000 },
    { label: '15,000 steps', value: 15000 },
    { label: '20,000 steps', value: 20000 },
  ];

  const habitTypes: { type: HabitType; label: string; icon: string; description: string }[] = [
    {
      type: 'steps',
      label: 'Step Tracking',
      icon: '👟',
      description: 'Track daily steps using your device sensor',
    },
    {
      type: 'numeric',
      label: 'Numeric Goal',
      icon: '📊',
      description: 'Track any measurable activity (glasses of water, minutes, etc.)',
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Create Movement Habit</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Habit Type Selection */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.sectionTitle}>Habit Type</ThemedText>
          <View style={styles.typeGrid}>
            {habitTypes.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: habitType === type.type ? primaryColor + '20' : cardColor,
                    borderColor: habitType === type.type ? primaryColor : textColor + '20',
                  },
                ]}
                onPress={() => setHabitType(type.type)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <ThemedText style={styles.typeLabel}>{type.label}</ThemedText>
                <ThemedText style={[styles.typeDescription, { color: textColor + '80' }]}>
                  {type.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Habit Name */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.sectionTitle}>Habit Name</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
            value={name}
            onChangeText={setName}
            placeholder={habitType === 'steps' ? 'Daily Steps' : 'Enter habit name'}
            placeholderTextColor={textColor + '60'}
          />
        </View>

        {/* Description (Optional) */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.sectionTitle}>Description (Optional)</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description..."
            placeholderTextColor={textColor + '60'}
            multiline
          />
        </View>

        {/* Target Value */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.sectionTitle}>
            {habitType === 'steps' ? 'Daily Step Goal' : 'Target Value'}
          </ThemedText>
          
          {habitType === 'steps' && (
            <View style={styles.presetsContainer}>
              {stepPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.presetButton,
                    {
                      backgroundColor: parseInt(targetSteps) === preset.value ? primaryColor : 'transparent',
                      borderColor: primaryColor,
                    },
                  ]}
                  onPress={() => setTargetSteps(preset.value.toString())}
                >
                  <Text style={[
                    styles.presetText,
                    { color: parseInt(targetSteps) === preset.value ? 'white' : primaryColor }
                  ]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
            value={targetSteps}
            onChangeText={setTargetSteps}
            placeholder={habitType === 'steps' ? '10000' : 'Enter target value'}
            placeholderTextColor={textColor + '60'}
            keyboardType="numeric"
          />
        </View>

        {/* Emoji Selection */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.sectionTitle}>Choose Emoji</ThemedText>
          <View style={styles.emojiGrid}>
            {HABIT_EMOJIS.slice(0, 16).map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiButton,
                  {
                    backgroundColor: selectedEmoji === emoji ? primaryColor + '20' : 'transparent',
                    borderColor: selectedEmoji === emoji ? primaryColor : 'transparent',
                  },
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.sectionTitle}>Choose Color</ThemedText>
          <View style={styles.colorGrid}>
            {HABIT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: color,
                    borderColor: selectedColor === color ? textColor : 'transparent',
                    borderWidth: selectedColor === color ? 3 : 0,
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: primaryColor }]}
          onPress={handleSubmit}
        >
          <Text style={styles.createButtonText}>Create Habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeGrid: {
    gap: 12,
  },
  typeCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  createButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
