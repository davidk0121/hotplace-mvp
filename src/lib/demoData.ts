import { Category, ListTag } from "./types";

/**
 * 처음 온 사용자가 앱을 바로 이해할 수 있도록 하는 샘플 데이터.
 * 빈 상태의 "샘플 불러오기" 버튼에서만 사용한다 (기본은 빈 상태로 시작).
 *
 * 실제 저장은 storage.seedDemoData()가 담당하며, 여기서는 내용만 정의한다.
 */

export interface DemoPlaceSeed {
  name: string;
  region: string;
  category: Category;
  memo: string;
  originalInput: string;
}

export interface DemoListSeed {
  title: string;
  description: string;
  tags: ListTag[];
  /** SAMPLE_PLACES 배열의 인덱스 (이 리스트에 담길 장소들) */
  placeIndexes: number[];
}

export const SAMPLE_PLACES: DemoPlaceSeed[] = [
  {
    name: "Onion Seongsu",
    region: "Seongsu",
    category: "cafe",
    memo: "Industrial-style bakery cafe. Get there early on weekends.",
    originalInput: "Onion Seongsu cafe",
  },
  {
    name: "Gwangjang Market",
    region: "Jongno",
    category: "food",
    memo: "Bindaetteok and mayak gimbap. Cash is handy.",
    originalInput: "Gwangjang Market street food",
  },
  {
    name: "Bukchon Hanok Village",
    region: "Bukchon",
    category: "date",
    memo: "Beautiful at golden hour. Comfy shoes recommended.",
    originalInput: "https://maps.app.goo.gl/example-bukchon",
  },
  {
    name: "Seongsu-dong Shopping Street",
    region: "Seongsu",
    category: "shopping",
    memo: "Pop-up stores and select shops.",
    originalInput: "Seongsu shopping",
  },
];

export const SAMPLE_LISTS: DemoListSeed[] = [
  {
    title: "Seoul date weekend",
    description: "A relaxed day around Seongsu and Bukchon.",
    tags: ["date", "cafe"],
    placeIndexes: [0, 2, 1],
  },
];
