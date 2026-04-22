export const getActiveCategory = (selectedCategory: string[]): string =>
  selectedCategory.length > 0 && !selectedCategory.includes("All")
    ? selectedCategory[0]
    : "All";

export const applyLocalFilters = (data: any[], hiddenPolls: string[]): any[] =>
  data.filter((poll) => !hiddenPolls.includes(poll.id));

export const filterPollsBySearch = (polls: any[], searchQuery: string): any[] => {
  if (!searchQuery.trim()) return polls;
  const queryWords = searchQuery.toLowerCase().split(/\s+/);
  return polls.filter((poll) => {
    const searchableText = (
      poll.question + " " + (poll.description ?? "")
    ).toLowerCase();
    return queryWords.some((word) => searchableText.includes(word));
  });
};
