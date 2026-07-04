import { Category } from "./types";

/**
 * "주변 둘러보기" mock 데이터 제공자.
 *
 * 지금은 실제 장소 검색 API(Google Places / Mapbox / Naver / Kakao) 없이
 * 무료 mock만 사용한다. 브라우저 Geolocation으로 좌표는 받지만, 좌표로 실제
 * 검색은 하지 않고 큐레이션된 mock을 보여준다.
 *
 * 나중에 실제 API를 붙일 때는 이 파일의 두 함수 내부만 fetch 호출로 교체하면
 * 되고, 반환 타입(NearbyPlace)과 호출부(app 코드)는 그대로 둔다.
 * 지역 목록은 한국 전용이 아니다 — 어느 도시든 AREA에 추가하면 된다.
 */

// i18n areas 키와 1:1 대응 ("nearme"는 지역이 아니라 위치 모드라 여기 없음)
export type AreaKey =
  | "la"
  | "oc"
  | "seoul"
  | "seongsu"
  | "hongdae"
  | "gangnam"
  | "jeju"
  | "busan";

export const AREA_KEYS: AreaKey[] = [
  "la",
  "oc",
  "seoul",
  "seongsu",
  "hongdae",
  "gangnam",
  "jeju",
  "busan",
];

export interface NearbyPlace {
  name: string;
  region: string;
  category: Category;
  note: string;
}

// 지역별 큐레이션 mock (US + 한국). 실제 API 연동 시 이 상수는 제거.
const MOCK_BY_AREA: Record<AreaKey, NearbyPlace[]> = {
  la: [
    { name: "Grand Central Market", region: "DTLA", category: "food", note: "Historic food hall" },
    { name: "Griffith Observatory", region: "Los Feliz", category: "date", note: "Sunset city views" },
    { name: "Salt & Straw", region: "Larchmont", category: "cafe", note: "Small-batch ice cream" },
  ],
  oc: [
    { name: "The LAB Anti-Mall", region: "Costa Mesa", category: "shopping", note: "Indie shops & patios" },
    { name: "Laguna Beach", region: "Laguna", category: "date", note: "Coves & coastal walk" },
    { name: "Kéan Coffee", region: "Newport Beach", category: "cafe", note: "Local roaster" },
  ],
  seoul: [
    { name: "Gwangjang Market", region: "Jongno", category: "food", note: "Bindaetteok & mayak gimbap" },
    { name: "N Seoul Tower", region: "Yongsan", category: "date", note: "City-view landmark" },
    { name: "Ikseon-dong Hanok Street", region: "Jongno", category: "cafe", note: "Hanok cafes & alleys" },
  ],
  seongsu: [
    { name: "Onion Seongsu", region: "Seongsu", category: "cafe", note: "Industrial bakery cafe" },
    { name: "Daelim Changgo", region: "Seongsu", category: "cafe", note: "Warehouse gallery cafe" },
    { name: "Seongsu Yeonbang", region: "Seongsu", category: "shopping", note: "Select shops & pop-ups" },
  ],
  hongdae: [
    { name: "Hongdae Walking Street", region: "Mapo", category: "shopping", note: "Street performances & shops" },
    { name: "Gyeongui Line Book Street", region: "Mapo", category: "date", note: "Leafy walk & benches" },
    { name: "Zapangi Cafe", region: "Mapo", category: "cafe", note: "Pink vending-machine door" },
  ],
  gangnam: [
    { name: "Garosu-gil", region: "Gangnam", category: "shopping", note: "Tree-lined boutiques" },
    { name: "Bongeunsa Temple", region: "Gangnam", category: "date", note: "Temple beside COEX" },
    { name: "Mingles", region: "Gangnam", category: "food", note: "Modern Korean fine dining" },
  ],
  jeju: [
    { name: "Seongsan Ilchulbong", region: "Jeju", category: "travel", note: "Sunrise peak (UNESCO)" },
    { name: "Woljeongri Beach", region: "Jeju", category: "date", note: "Beachfront cafes" },
    { name: "Osulloc Tea Museum", region: "Jeju", category: "cafe", note: "Green-tea fields & cafe" },
  ],
  busan: [
    { name: "Gamcheon Culture Village", region: "Busan", category: "travel", note: "Colorful hillside village" },
    { name: "Haeundae Beach", region: "Busan", category: "date", note: "Iconic city beach" },
    { name: "Jagalchi Market", region: "Busan", category: "food", note: "Fresh seafood market" },
  ],
};

/** 지역 선택 시 mock 장소 목록. (나중에 area→API 검색으로 교체) */
export function getMockNearbyByArea(area: AreaKey): NearbyPlace[] {
  return MOCK_BY_AREA[area] ?? [];
}

/**
 * 좌표 기반 "내 주변" mock.
 * 지금은 좌표를 사용하지 않고 여러 도시의 인기 스팟을 섞어 보여준다.
 * (나중에 lat/lng로 실제 반경 검색 API를 호출하도록 교체)
 */
export function getMockNearbyByLocation(
  _lat: number,
  _lng: number
): NearbyPlace[] {
  return [
    MOCK_BY_AREA.la[0],
    MOCK_BY_AREA.oc[2],
    MOCK_BY_AREA.seongsu[0],
    MOCK_BY_AREA.seoul[0],
  ];
}
