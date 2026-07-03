import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { ko } from "./ko";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ko,
  // 새 언어 추가 시 여기에 등록:
  // ja,
  // zh,
  // es,
};
