/**
 * 지원 언어 설정.
 *
 * 새 언어를 추가하려면:
 *   1. 아래 locales 배열에 코드 추가 (예: "ja")
 *   2. src/i18n/locales/ja.ts 파일을 만들고 en.ts와 같은 구조로 번역 작성
 *   3. src/i18n/locales/index.ts의 dictionaries에 등록
 * 이 세 단계 외에 앱 코드는 수정할 필요가 없다.
 */
export const locales = ["en", "ko"] as const;
// 나중에 추가 예정: "ja" (Japanese), "zh" (Chinese), "es" (Spanish)

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** 언어 스위처에 표시할 각 언어의 자기 표기 이름 */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  // ja: "日本語",
  // zh: "中文",
  // es: "Español",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
