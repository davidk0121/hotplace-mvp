"use client";

import { useEffect } from "react";
import { clearAllData, seedDemoData } from "@/lib/storage";

/**
 * 개발/데모 편의용 전역 헬퍼. 브라우저 콘솔에서:
 *   window.hotplace.reset()  → 장소/리스트 전부 삭제 후 새로고침
 *   window.hotplace.seed()   → 샘플 데이터 추가 후 새로고침
 * UI에는 노출하지 않는다 (베타 테스터가 실수로 누르지 않도록).
 */
export default function DevGlobals() {
  useEffect(() => {
    (window as unknown as { hotplace?: unknown }).hotplace = {
      reset() {
        clearAllData();
        window.location.reload();
      },
      seed() {
        seedDemoData();
        window.location.reload();
      },
    };
  }, []);

  return null;
}
