import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { POLL_CATEGORIES } from "@/lib/constants/categories";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  mode: "create" | "feed";
  selectedCategory: string[];
  setSelectedCategory: (category: string[]) => void;
};

const CategoryChips = ({
  mode,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    card: isDark ? "#1a1a1a" : "#ffffff",
    text: isDark ? "#ffffff" : "#1f2937",
    border: isDark ? "#2a2a2a" : "#e5e7eb",
    primary: isDark ? "#3b82f6" : "#2563eb",
  };

  const renderChips = () =>
    POLL_CATEGORIES.map((category) => {
      const isSelected = selectedCategory.includes(category);

      return (
        <TouchableOpacity
          key={category}
          onPress={() => {
            if (mode === "feed") {
              setSelectedCategory(isSelected ? [] : [category]);
              return;
            }

            if (isSelected) {
              setSelectedCategory(
                selectedCategory.filter((c) => c !== category)
              );
            } else {
              if (selectedCategory.length >= 3) return;
              setSelectedCategory([...selectedCategory, category]);
            }
          }}
          style={[
            styles.chip,
            {
              backgroundColor: isSelected ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={{
              color: isSelected ? "#fff" : colors.text,
              fontWeight: "600",
            }}
          >
            {category}
          </Text>
        </TouchableOpacity>
      );
    });

  return mode === "create" ? (
    <View style={styles.wrapContainer}>{renderChips()}</View>
  ) : (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 2 }}
    >
      {renderChips()}
    </ScrollView>
  );
};

export default CategoryChips;

const styles = StyleSheet.create({
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 4,
  },
});
