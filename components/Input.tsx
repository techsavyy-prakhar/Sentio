import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  error?: boolean;
}

export function Input({
  icon,
  trailingIcon,
  containerStyle,
  error = false,
  ...props
}: InputProps) {
  return (
    <View
      style={[
        styles.container,
        error && styles.errorContainer,
        containerStyle,
      ]}
    >
      {icon && <View style={styles.iconLeft}>{icon}</View>}
      <TextInput
        {...props}
        placeholderTextColor="#4b5563"
        style={[styles.input, { flex: 1 }]}
      />
      {trailingIcon && <View style={styles.iconRight}>{trailingIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#242424",
    paddingHorizontal: 14,
    height: 52,
  },
  errorContainer: {
    borderColor: "#ef4444",
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    fontSize: 15,
    color: "#ffffff",
    paddingHorizontal: 10,
  },
  iconRight: {
    marginLeft: 8,
  },
});
