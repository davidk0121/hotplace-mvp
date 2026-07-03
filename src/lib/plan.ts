import { Category, Place } from "./types";

/**
 * 로컬 mock 코스 생성기.
 *
 * 지금은 실제 AI/OpenAI 호출 없이, 사용자가 저장한 장소를 카테고리 기반으로
 * 시간대(아침/점심/오후/저녁)에 배치해 "그럴듯한" 하루 코스를 만든다.
 *
 * 나중에 실제 AI를 붙일 때는 generatePlan()의 내부만 API 호출로 교체하면 되고,
 * 반환 타입(GeneratedPlan)은 그대로 유지된다. GeneratedPlan은 향후
 * Supabase `saved_plans` 테이블(id, list_id, prompt, slots jsonb, created_at)과
 * 1:1로 대응하도록 설계했다 (이번 배치에서는 저장하지 않음).
 */

export type PlanSlotKey = "morning" | "lunch" | "afternoon" | "evening";

export const PLAN_SLOT_ORDER: PlanSlotKey[] = [
  "morning",
  "lunch",
  "afternoon",
  "evening",
];

export interface PlanSlot {
  key: PlanSlotKey;
  /** 이 시간대에 배치된 장소 id들 (list_places처럼 참조만 저장) */
  placeIds: string[];
}

export interface GeneratedPlan {
  id: string;
  /** 사용자가 입력한 자연어 요청 */
  prompt: string;
  /** 이 plan이 특정 리스트 기반이면 그 리스트 id, 아니면 null */
  listId: string | null;
  slots: PlanSlot[];
  createdAt: string;
}

export interface GeneratePlanInput {
  prompt: string;
  listId: string | null;
  /** 코스에 사용할 후보 장소들 (리스트 장소 또는 전체 저장 장소) */
  places: Place[];
}

// 코스를 자연스럽게 보이려면 장소가 최소 이 정도는 필요하다.
export const MIN_PLACES_FOR_GOOD_PLAN = 3;

// 카테고리별로 어울리는 시간대 우선순위. 앞쪽일수록 선호.
// 모든 카테고리가 4개 슬롯을 전부 포함해 항상 배치될 곳이 있다.
function slotOrderForCategory(category: Category): PlanSlotKey[] {
  switch (category) {
    case "cafe":
      return ["morning", "afternoon", "evening", "lunch"];
    case "food":
      return ["lunch", "evening", "afternoon", "morning"];
    case "date":
      return ["evening", "afternoon", "morning", "lunch"];
    case "shopping":
      return ["afternoon", "morning", "evening", "lunch"];
    case "family":
      return ["afternoon", "morning", "lunch", "evening"];
    case "travel":
      return ["morning", "afternoon", "evening", "lunch"];
    default:
      return ["afternoon", "morning", "evening", "lunch"];
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `plan_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

/**
 * 장소들을 시간대에 배치한다.
 * 각 장소는 카테고리 선호 순서 중 "지금 가장 적게 찬" 슬롯에 들어가,
 * 카테고리 성향을 지키면서도 시간대가 한쪽에 몰리지 않게 퍼진다.
 * @param seed 같은 입력이라도 seed를 바꾸면 배치가 살짝 달라진다 ("셔플" 용도)
 */
export function generatePlan(
  input: GeneratePlanInput,
  seed = 0
): GeneratedPlan {
  const counts: Record<PlanSlotKey, string[]> = {
    morning: [],
    lunch: [],
    afternoon: [],
    evening: [],
  };

  // seed에 따라 순회 시작 위치를 돌려 배치를 살짝 바꾼다 (mock "다시 추천").
  const ordered = input.places.slice();
  if (seed > 0 && ordered.length > 1) {
    const shift = seed % ordered.length;
    ordered.push(...ordered.splice(0, shift));
  }

  for (const place of ordered) {
    const order = slotOrderForCategory(place.category);
    let best = order[0];
    for (const slot of order) {
      if (counts[slot].length < counts[best].length) best = slot;
    }
    counts[best].push(place.id);
  }

  return {
    id: newId(),
    prompt: input.prompt.trim(),
    listId: input.listId,
    slots: PLAN_SLOT_ORDER.map((key) => ({ key, placeIds: counts[key] })),
    createdAt: new Date().toISOString(),
  };
}
