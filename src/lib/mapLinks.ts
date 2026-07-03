/**
 * 지도 API를 호출하지 않고, 장소명(+지역)으로 검색 URL을 만들어
 * 새 탭에서 각 지도 앱을 여는 방식만 사용한다 (자동 sync 아님).
 */
export function buildMapLinks(query: string) {
  const q = encodeURIComponent(query);
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    naver: `https://map.naver.com/v5/search/${q}`,
    kakao: `https://map.kakao.com/?q=${q}`,
  };
}

export function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}
