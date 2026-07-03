import {
  Category,
  NewPlaceInput,
  NewPlaceListInput,
  Place,
  PlaceList,
} from "./types";
import { SAMPLE_LISTS, SAMPLE_PLACES } from "./demoData";

/**
 * MVP 단계 데이터 저장소.
 *
 * 지금은 localStorage만 사용하는 anonymous(임시) 사용자 모델이다.
 * 나중에 Supabase Auth + `places` 테이블로 옮길 때, 호출부(app 코드)는
 * 그대로 두고 이 파일의 함수 내부 구현만 Supabase 클라이언트 호출로
 * 바꾸면 되도록 인터페이스를 고정해 두었다.
 */

const PLACES_KEY = "hotplace_mvp_places_v1";
const LISTS_KEY = "hotplace_mvp_lists_v1";
const WAITLIST_KEY = "hotplace_mvp_waitlist_v1";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2)}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

// i18n 도입 전에는 카테고리를 한국어 문자열로 저장했다.
// 기존 localStorage 데이터를 언어 중립 키로 자동 변환한다.
const LEGACY_CATEGORY_MAP: Record<string, Category> = {
  맛집: "food",
  카페: "cafe",
  데이트: "date",
  가족: "family",
  여행: "travel",
  "선물/쇼핑": "shopping",
  기타: "other",
};

const VALID_CATEGORIES: Category[] = [
  "food",
  "cafe",
  "date",
  "family",
  "travel",
  "shopping",
  "other",
];

function normalizeCategory(value: string): Category {
  if ((VALID_CATEGORIES as string[]).includes(value)) return value as Category;
  return LEGACY_CATEGORY_MAP[value] ?? "other";
}

function readAll(): Place[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PLACES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p: Place) => ({
      ...p,
      category: normalizeCategory(p.category),
    }));
  } catch {
    return [];
  }
}

function writeAll(places: Place[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLACES_KEY, JSON.stringify(places));
}

export const placesRepo = {
  list(): Place[] {
    return readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  get(id: string): Place | undefined {
    return readAll().find((p) => p.id === id);
  },

  create(input: NewPlaceInput): Place {
    const now = new Date().toISOString();
    const place: Place = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const all = readAll();
    all.push(place);
    writeAll(all);
    return place;
  },

  update(id: string, updates: Partial<NewPlaceInput>): Place | undefined {
    const all = readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated: Place = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    writeAll(all);
    return updated;
  },

  remove(id: string): void {
    writeAll(readAll().filter((p) => p.id !== id));
    // 삭제된 장소를 참조하는 리스트에서도 제거한다
    // (DB에서는 list_places의 on delete cascade가 담당하는 부분).
    const lists = readLists();
    let changed = false;
    for (const list of lists) {
      if (list.placeIds.includes(id)) {
        list.placeIds = list.placeIds.filter((pid) => pid !== id);
        changed = true;
      }
    }
    if (changed) writeLists(lists);
  },
};

// ---------------------------------------------------------------------------
// 리스트 저장소 — Supabase place_lists / list_places와 같은 shape.
// placeIds 배열이 list_places join 테이블 역할을 한다.
// ---------------------------------------------------------------------------

function generateShareId(): string {
  // Supabase 스키마의 share_id(6바이트 hex)와 동일한 형식
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function readLists(): PlaceList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LISTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLists(lists: PlaceList[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}

export const listsRepo = {
  list(): PlaceList[] {
    return readLists().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  get(id: string): PlaceList | undefined {
    return readLists().find((l) => l.id === id);
  },

  // 공유 링크(/lists/share/[shareId])에서 사용.
  // Supabase 전환 시 share_id로 SELECT하는 공개 쿼리로 교체된다.
  getByShareId(shareId: string): PlaceList | undefined {
    return readLists().find((l) => l.shareId === shareId);
  },

  create(input: NewPlaceListInput): PlaceList {
    const now = new Date().toISOString();
    const list: PlaceList = {
      ...input,
      id: generateId(),
      placeIds: [],
      shareId: generateShareId(),
      createdAt: now,
      updatedAt: now,
    };
    const all = readLists();
    all.push(list);
    writeLists(all);
    return list;
  },

  update(
    id: string,
    updates: Partial<NewPlaceListInput>
  ): PlaceList | undefined {
    const all = readLists();
    const idx = all.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLists(all);
    return all[idx];
  },

  remove(id: string): void {
    writeLists(readLists().filter((l) => l.id !== id));
  },

  addPlace(listId: string, placeId: string): void {
    const all = readLists();
    const list = all.find((l) => l.id === listId);
    if (!list || list.placeIds.includes(placeId)) return;
    list.placeIds.push(placeId);
    list.updatedAt = new Date().toISOString();
    writeLists(all);
  },

  removePlace(listId: string, placeId: string): void {
    const all = readLists();
    const list = all.find((l) => l.id === listId);
    if (!list) return;
    list.placeIds = list.placeIds.filter((id) => id !== placeId);
    list.updatedAt = new Date().toISOString();
    writeLists(all);
  },
};

function readWaitlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const waitlistRepo = {
  // TODO: Supabase 연결 후에는 이 함수 내부를
  // `supabase.from("waitlist_emails").insert({ email })` 호출로 교체한다.
  add(email: string): { alreadyExists: boolean } {
    const emails = readWaitlist();
    if (emails.includes(email)) {
      return { alreadyExists: true };
    }
    emails.push(email);
    window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(emails));
    return { alreadyExists: false };
  },
};

// ---------------------------------------------------------------------------
// 데모/개발용 유틸
// ---------------------------------------------------------------------------

/**
 * 샘플 장소 + 샘플 리스트를 저장한다.
 * 빈 상태의 "샘플 불러오기" 버튼에서 호출. 기존 데이터에 덧붙인다.
 */
export function seedDemoData(): void {
  const now = new Date().toISOString();
  const createdPlaces: Place[] = SAMPLE_PLACES.map((seed) => ({
    ...seed,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));
  writeAll([...readAll(), ...createdPlaces]);

  const createdLists: PlaceList[] = SAMPLE_LISTS.map((seed) => ({
    title: seed.title,
    description: seed.description,
    tags: seed.tags,
    // demoData의 인덱스를 방금 만든 장소 id로 변환
    placeIds: seed.placeIndexes
      .map((i) => createdPlaces[i]?.id)
      .filter((id): id is string => Boolean(id)),
    id: generateId(),
    shareId: generateShareId(),
    createdAt: now,
    updatedAt: now,
  }));
  writeLists([...readLists(), ...createdLists]);
}

/**
 * 장소/리스트 데이터를 모두 지운다 (waitlist/테마/언어 설정은 유지).
 * 개발/데모 리셋용 — window.hotplace.reset()으로도 호출 가능.
 */
export function clearAllData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PLACES_KEY);
  window.localStorage.removeItem(LISTS_KEY);
}
