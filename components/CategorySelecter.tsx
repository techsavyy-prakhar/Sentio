import { useEffect, useRef } from 'react';
import {
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  View,
  LayoutChangeEvent,
} from 'react-native';

/* =======================
   Types
======================= */
interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

/* =======================
   Component
======================= */
export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const scrollRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<Record<string, { x: number; width: number }>>({});

  useEffect(() => {
    const layout = itemLayouts.current[selectedCategory];
    if (layout && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: Math.max(layout.x - 40, 0),
        animated: true,
      });
    }
  }, [selectedCategory]);

  const onItemLayout =
    (category: string) =>
    (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      itemLayouts.current[category] = { x, width };
    };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(category => {
          const isSelected = category === selectedCategory;

          return (
            <Pressable
              key={category}
              onPress={() => onSelectCategory(category)}
              onLayout={onItemLayout(category)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* =======================
   Styles
======================= */
const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },

  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },

  chipSelected: {
    backgroundColor: '#2563EB',
  },

  chipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },

  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});