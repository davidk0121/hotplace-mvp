// 카테고리는 언어와 무관한 키로 저장한다 (DB/localStorage에 이 값이 들어감).
// 화면에 보이는 라벨은 i18n 사전(t.categories[key])에서 가져온다.
// Supabase places 테이블의 category 컬럼 check 제약과 동일한 값 집합.
export type Category =
  | "food"
  | "cafe"
  | "date"
  | "family"
  | "travel"
  | "shopping"
  | "other";

export interface Place {
  id: string;
  name: string;
  region: string;
  category: Category;
  memo: string;
  /** 사용자가 처음 붙여넣은 원본 텍스트 또는 지도 링크 */
  originalInput: string;
  /**
   * 실좌표 (MapTiler geocoding으로 확정 시 저장). 없을 수 있다 —
   * 좌표 없는 장소는 목록엔 나오지만 실제 지도에 핀으로 찍히지 않는다.
   * (localStorage 하위 호환: 기존 장소는 lat/lng가 undefined)
   */
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
}

export type NewPlaceInput = Omit<Place, "id" | "createdAt" | "updatedAt">;

// 리스트의 목적 태그. 카테고리처럼 언어 중립 키로 저장하고
// 라벨은 i18n 사전(t.listTags[key])에서 번역한다.
// Supabase place_lists.tags (text[]) 컬럼과 동일한 값 집합.
export type ListTag =
  | "date"
  | "family"
  | "trip"
  | "food"
  | "cafe"
  | "shopping"
  | "other";

/**
 * Supabase place_lists 테이블과 1:1 대응.
 * placeIds는 DB에서는 list_places join 테이블로 분리되지만,
 * localStorage 단계에서는 배열로 embed한다 (마이그레이션 시 rows로 변환).
 */
export interface PlaceList {
  id: string;
  title: string;
  description: string;
  tags: ListTag[];
  placeIds: string[];
  /** 공유 링크용 짧은 랜덤 slug (/lists/share/[shareId]) */
  shareId: string;
  createdAt: string;
  updatedAt: string;
}

export type NewPlaceListInput = Pick<
  PlaceList,
  "title" | "description" | "tags"
>;
