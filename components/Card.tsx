import { View, StyleSheet, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  border?: boolean;
  shadow?: boolean;
}

export function Card({
  children,
  style,
  padding = 16,
  border = true,
  shadow = true,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          padding,
          borderWidth: border ? 1 : 0,
          shadowOpacity: shadow ? 0.4 : 0,
          elevation: shadow ? 10 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141414",
    borderColor: "#1f1f1f",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
  },
});
