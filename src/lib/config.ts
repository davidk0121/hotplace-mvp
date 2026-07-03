/**
 * 교체 가능한 외부 링크/설정 모음.
 * 실제 값이 생기면 이 파일만 바꾸면 되고, 코드 다른 곳은 손댈 필요 없다.
 */

// 피드백 수집용 Google Form 링크 (무료). 아직 없으면 빈 문자열로 두면
// UI가 "준비 중" 안내로 자연스럽게 대체된다.
// 예시: "https://forms.gle/여기에_폼_ID"
export const FEEDBACK_FORM_URL = "";

export function hasFeedbackForm(): boolean {
  return FEEDBACK_FORM_URL.trim().length > 0;
}
