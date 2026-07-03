import { Category, ListTag } from "./types";

/**
 * 카테고리 목록. 표시 이름은 하드코딩하지 않고
 * i18n 사전(t.categories[value])에서 가져온다.
 */
export const CATEGORIES: { value: Category; emoji: string }[] = [
  { value: "food", emoji: "🍽️" },
  { value: "cafe", emoji: "☕" },
  { value: "date", emoji: "💕" },
  { value: "family", emoji: "👨‍👩‍👧" },
  { value: "travel", emoji: "✈️" },
  { value: "shopping", emoji: "🎁" },
  { value: "other", emoji: "📍" },
];

export function categoryEmoji(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.emoji ?? "📍";
}

// 장소 카드 커버에 쓰는 카테고리별 액센트 색상 (Figma의 컬러 태그 느낌).
// 사진이 없는 MVP에서 카드에 시각적 다양성을 준다.
const CATEGORY_COLORS: Record<Category, string> = {
  food: "#ff6b35",
  cafe: "#c08457",
  date: "#ff385c",
  family: "#7b61ff",
  travel: "#00a6d4",
  shopping: "#e85cb0",
  other: "#6b6880",
};

export function categoryColor(category: Category): string {
  return CATEGORY_COLORS[category] ?? "#6b6880";
}

/** 리스트 목적 태그 목록. 표시 이름은 t.listTags[value]에서 번역한다. */
export const LIST_TAGS: { value: ListTag; emoji: string }[] = [
  { value: "date", emoji: "💕" },
  { value: "family", emoji: "👨‍👩‍👧" },
  { value: "trip", emoji: "✈️" },
  { value: "food", emoji: "🍽️" },
  { value: "cafe", emoji: "☕" },
  { value: "shopping", emoji: "🛍️" },
  { value: "other", emoji: "📌" },
];

export function listTagEmoji(tag: ListTag): string {
  return LIST_TAGS.find((t) => t.value === tag)?.emoji ?? "📌";
}
