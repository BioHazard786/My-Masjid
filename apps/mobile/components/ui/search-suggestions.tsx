import { cn } from "@mobile/lib/utils";
import * as React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  className?: string;
}

export function SearchSuggestions({
  suggestions,
  onSuggestionPress,
  className,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const renderSuggestion = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => onSuggestionPress(item)}
      className="py-3 px-4 border-b border-border active:bg-muted/50"
    >
      <Text className="text-foreground">{item}</Text>
    </Pressable>
  );

  return (
    <View
      className={cn("bg-card border border-border rounded-lg mt-2", className)}
    >
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderSuggestion}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
