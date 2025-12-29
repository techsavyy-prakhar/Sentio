import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Sparkles, CheckCircle, Info } from "lucide-react-native";
import { router } from "expo-router";

export default function CreatePollScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    background: isDark ? "#0a0a0a" : "#f5f7fa",
    card: isDark ? "#1a1a1a" : "#ffffff",
    text: isDark ? "#ffffff" : "#1f2937",
    subtext: isDark ? "#9ca3af" : "#6b7280",
    border: isDark ? "#2a2a2a" : "#e5e7eb",
    inputBg: isDark ? "#111111" : "#f9fafb",
    primary: isDark ? "#3b82f6" : "#2563eb",
    success: "#10b981",
  };

  const handleCreatePoll = async () => {
    if (!question.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("http://127.0.0.1:8000/api/polls/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          description: description?.trim() || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create poll");
      }

      const data = await response.json();
      setShowSuccess(true);
      setShowSuccess(false);
      setQuestion("");
      setDescription("");
      router.replace("/");
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = question.trim().length > 0;

  if (showSuccess) {
    return (
      <View
        style={[
          styles.container,
          styles.successContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.successCard, { backgroundColor: colors.card }]}>
          <CheckCircle size={64} color={colors.success} />
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Poll Created!
          </Text>
          <Text style={[styles.successMessage, { color: colors.subtext }]}>
            Your poll has been published and is now live for voting.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Sparkles size={28} color={colors.primary} />
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Create Poll
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
              Ask the community anything
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Info size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.subtext }]}>
            All polls are Yes/No questions. Make your question clear and
            engaging!
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Question
              <Text style={{ color: colors.primary }}> *</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.questionInput,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g., Should AI be regulated by governments?"
              placeholderTextColor={colors.subtext}
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={200}
              editable={!isSubmitting}
            />
            <Text style={[styles.charCount, { color: colors.subtext }]}>
              {question.length}/200
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Description
              <Text style={[styles.optional, { color: colors.subtext }]}>
                {" "}
                (Optional)
              </Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Add more context to help people understand your poll..."
              placeholderTextColor={colors.subtext}
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              editable={!isSubmitting}
            />
            <Text style={[styles.charCount, { color: colors.subtext }]}>
              {description.length}/500
            </Text>
          </View>

          <View style={styles.previewSection}>
            <Text style={[styles.previewTitle, { color: colors.text }]}>
              Vote Options
            </Text>
            <View style={styles.optionsPreview}>
              <View
                style={[
                  styles.optionBadge,
                  { backgroundColor: `${colors.success}20` },
                ]}
              >
                <CheckCircle size={16} color={colors.success} />
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? colors.success : "#059669" },
                  ]}
                >
                  Yes
                </Text>
              </View>
              <View
                style={[styles.optionBadge, { backgroundColor: "#ef444420" }]}
              >
                <CheckCircle size={16} color={isDark ? "#ef4444" : "#dc2626"} />
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "#ef4444" : "#dc2626" },
                  ]}
                >
                  No
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor:
                isFormValid && !isSubmitting ? colors.primary : colors.border,
            },
          ]}
          onPress={handleCreatePoll}
          disabled={!isFormValid || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Sparkles
                size={20}
                color={isFormValid ? "#ffffff" : colors.subtext}
              />
              <Text
                style={[
                  styles.createButtonText,
                  { color: isFormValid ? "#ffffff" : colors.subtext },
                ]}
              >
                Create Poll
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.subtext }]}>
          By creating a poll, you agree that it will be publicly visible to all
          users.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    maxWidth: 400,
    width: "100%",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  optional: {
    fontWeight: "400",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  questionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "right",
  },
  previewSection: {
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsPreview: {
    flexDirection: "row",
    gap: 12,
  },
  optionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
});
