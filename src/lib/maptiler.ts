/**
 * MapTiler 연동 (무료 티어). 키는 NEXT_PUBLIC_MAPTILER_KEY 환경변수로만 받는다.
 * 키가 없으면 hasMapKey()가 false → 앱은 기존 목업 지도(MockMap)로 폴백한다.
 *
 * 키는 클라이언트에 노출되는 값이므로(NEXT_PUBLIC), MapTiler 대시보드에서
 * 허용 도메인(Origin)으로 제한해 두는 것을 권장한다.
 */

const KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

export function hasMapKey(): boolean {
  return Boolean(KEY);
}

/**
 * 지도 스타일 URL.
 *  - map + light  → streets-v2
 *  - map + dark   → streets-v2-dark
 *  - satellite    → hybrid (위성 + 라벨), 라이트/다크 공통
 */
export function mapStyleUrl(
  mode: "map" | "satellite",
  theme: "light" | "dark"
): string {
  const id =
    mode === "satellite"
      ? "hybrid"
      : theme === "dark"
      ? "streets-v2-dark"
      : "streets-v2";
  return `https://api.maptiler.com/maps/${id}/style.json?key=${KEY}`;
}

export interface GeoCandidate {
  id: string;
  /** 짧은 이름 (예: "Onion") */
  name: string;
  /** 전체 라벨 (예: "Onion, Seongsu-dong, Seoul") */
  label: string;
  lat: number;
  lng: number;
}

/**
 * MapTiler Geocoding으로 장소 후보 검색 (최대 3개).
 * 키가 없거나 쿼리가 비면 빈 배열. 절대 자동으로 하나를 확정하지 않는다.
 */
export async function geocodePlaces(query: string): Promise<GeoCandidate[]> {
  const q = query.trim();
  if (!KEY || q.length < 2) return [];
  try {
    const url =
      `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json` +
      `?key=${KEY}&limit=3`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const features = Array.isArray(data.features) ? data.features : [];
    return features
      .filter((f: { center?: number[] }) => Array.isArray(f.center))
      .map(
        (f: {
          id?: string;
          text?: string;
          place_name?: string;
          center: number[];
        }) => ({
          id: String(f.id ?? f.place_name ?? f.text),
          name: f.text ?? f.place_name ?? q,
          label: f.place_name ?? f.text ?? q,
          lng: f.center[0],
          lat: f.center[1],
        })
      );
  } catch {
    return [];
  }
}
