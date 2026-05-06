import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  BORDER_SUBTLE,
  Fonts,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import { useAccountabilityBoard } from "@/lib/accountability-board";

export default function AddActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addActivity } = useAccountabilityBoard();

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const save = async () => {
    const trimmed = title.trim();
    if (!trimmed || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const result = await addActivity({
        title: trimmed,
        detail: detail.trim() || undefined,
      });
      if (result.ok) {
        router.back();
        return;
      }
      Alert.alert(
        "Couldn't save activity",
        result.error ?? "Check your Appwrite connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <Text style={styles.subtitle}>
          Log something you did or want to remember for your streak.
        </Text>

        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Morning walk"
          placeholderTextColor={TEXT_SECONDARY}
          style={styles.input}
          editable={!submitting}
          autoFocus
          returnKeyType="next"
        />

        <Text style={styles.fieldLabel}>Notes (optional)</Text>
        <TextInput
          value={detail}
          onChangeText={setDetail}
          placeholder="Add a bit more context…"
          placeholderTextColor={TEXT_SECONDARY}
          style={[styles.input, styles.inputMultiline]}
          editable={!submitting}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            (!title.trim() || submitting) && styles.primaryBtnDisabled,
            pressed && styles.primaryBtnPressed,
          ]}
          onPress={() => void save()}
          disabled={!title.trim() || submitting}
        >
          <Text style={styles.primaryBtnText}>
            {submitting ? "Saving…" : "Save activity"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelBtn}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BACKGROUND_PAGE,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 8,
    gap: 8,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: Fonts.sans,
    color: TEXT_PRIMARY,
    backgroundColor: BACKGROUND_PAGE,
  },
  inputMultiline: {
    minHeight: 110,
    paddingTop: 14,
  },
  primaryBtn: {
    marginTop: 28,
    backgroundColor: ACCENT_LIME,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnPressed: {
    opacity: 0.92,
  },
  primaryBtnText: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },
  cancelBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
});
