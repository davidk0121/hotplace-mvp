/**
 * 붙여넣은 값의 출처를 로컬에서 감지한다 (API 호출 없음).
 * URL 호스트/패턴만 보고 지도앱·소셜 출처를 구분한다.
 */

export type SourceKey =
  | "google"
  | "apple"
  | "naver"
  | "kakao"
  | "instagram"
  | "tiktok"
  | "link"
  | "text";

export const SOURCE_EMOJI: Record<SourceKey, string> = {
  google: "🗺️",
  apple: "🍎",
  naver: "🟢",
  kakao: "💬",
  instagram: "📸",
  tiktok: "🎵",
  link: "🔗",
  text: "📝",
};

export function isUrlish(value: string): boolean {
  const v = value.trim();
  return /^https?:\/\//i.test(v) || /^[\w-]+\.[\w.]+\/\S/.test(v);
}

export function detectSource(value: string): SourceKey {
  const v = value.trim().toLowerCase();
  if (!v) return "text";
  if (!isUrlish(v)) return "text";

  // 지도 앱
  if (/(naver\.me|map\.naver|place\.naver|m\.place\.naver)/.test(v))
    return "naver";
  if (/(kakao\.com\/map|map\.kakao|place\.map\.kakao|kko\.to|kko\.kakao)/.test(v))
    return "kakao";
  if (/maps\.apple\.com/.test(v)) return "apple";
  if (
    /(maps\.google|google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/.test(
      v
    )
  )
    return "google";

  // 소셜
  if (/(instagram\.com|instagr\.am)/.test(v)) return "instagram";
  if (/(tiktok\.com|vt\.tiktok|vm\.tiktok)/.test(v)) return "tiktok";

  // URL이지만 출처 미상
  return "link";
}
