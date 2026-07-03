/**
 * 목업 지도용 좌표 계산.
 *
 * 실제 지도 API/위경도가 없으므로, place.id 문자열을 해시해서
 * 지도 패널 안의 안정적인 (x%, y%) 위치를 만들어낸다.
 * 같은 장소는 항상 같은 위치에 찍히고, 저장할 때마다 자연스럽게 흩어진다.
 *
 * 나중에 실제 좌표(lat/lng)가 생기면 이 함수를 좌표→화면 투영으로 교체하면 된다.
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface MockPoint {
  x: number; // 0–100 (%)
  y: number; // 0–100 (%)
}

export function mockCoords(id: string): MockPoint {
  const h = hash(id);
  // 가장자리에 붙지 않도록 10–90% 범위로 매핑
  const x = 10 + ((h % 1000) / 1000) * 80;
  const y = 10 + ((Math.floor(h / 1000) % 1000) / 1000) * 80;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}
