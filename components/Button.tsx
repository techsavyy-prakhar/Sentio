import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "large" | "medium" | "small";

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  onPress,
  label,
  variant = "primary",
  size = "large",
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case "medium":
        return { paddingVertical: 12, paddingHorizontal: 20 };
      case "large":
        return { paddingVertical: 15, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 13;
      case "medium":
        return 14;
      case "large":
        return 16;
    }
  };

  const renderButton = () => {
    switch (variant) {
      case "primary":
        return (
          <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
            style={[styles.buttonOuter, style]}
          >
            {isDisabled ? (
              <Text
                style={[
                  styles.label,
                  { fontSize: getFontSize(), paddingVertical: 15 },
                  styles.disabledText,
                ]}
              >
                {loading ? "" : label}
              </Text>
            ) : (
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, getPadding()]}
              >
                {loading && <ActivityIndicator color="#fff" />}
                {!loading && (
                  <Text style={[styles.label, { fontSize: getFontSize() }]}>
                    {label}
                  </Text>
                )}
                {!loading && icon && <>{icon}</>}
              </LinearGradient>
            )}
          </TouchableOpacity>
        );

      case "danger":
        return (
          <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
            style={[styles.buttonOuter, style]}
          >
            <LinearGradient
              colors={["#ef4444", "#dc2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradient, getPadding()]}
            >
              {loading && <ActivityIndicator color="#fff" />}
              {!loading && (
                <Text style={[styles.label, { fontSize: getFontSize() }]}>
                  {label}
                </Text>
              )}
              {!loading && icon && <>{icon}</>}
            </LinearGradient>
          </TouchableOpacity>
        );

      case "secondary":
        return (
          <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[styles.buttonOuter, style]}
          >
            <Text
              style={[
                styles.label,
                { fontSize: getFontSize(), paddingVertical: 15 },
                styles.secondaryText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );

      case "ghost":
        return (
          <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[styles.ghostButton, style]}
          >
            <Text
              style={[
                styles.label,
                { fontSize: getFontSize() },
                styles.ghostText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
    }
  };

  return renderButton();
}

const styles = StyleSheet.create({
  buttonOuter: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  disabledText: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    color: "#4b5563",
    paddingHorizontal: 24,
  },
  secondaryText: {
    backgroundColor: "#141414",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    color: "#ffffff",
    paddingHorizontal: 24,
  },
  ghostButton: {
    padding: 12,
  },
  ghostText: {
    color: "#6366f1",
    fontWeight: "600",
  },
});
