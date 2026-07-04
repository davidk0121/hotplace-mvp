"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FEEDBACK_FORM_URL, hasFeedbackForm } from "@/lib/config";
import { useI18n } from "@/i18n/I18nProvider";

// embedded=true면 Home 바텀시트 안에서 쓰기 위해 pathname 체크를 건너뛴다.
export default function Footer({ embedded = false }: { embedded?: boolean }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [showSoon, setShowSoon] = useState(false);

  // Home('/')은 지도 전용 화면이라 전역 푸터를 숨기고, 피드백은 시트 안에 둔다
  if (!embedded && pathname === "/") return null;

  return (
    <footer className={embedded ? "" : "border-t border-border"}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center">
        {hasFeedbackForm() ? (
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tap rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {t.footer.feedback}
          </a>
        ) : (
          <button
            onClick={() => setShowSoon(true)}
            className="tap rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {t.footer.feedback}
          </button>
        )}
        {showSoon && (
          <p className="text-xs text-muted-foreground">
            {t.footer.feedbackComingSoon}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{t.footer.beta}</p>
      </div>
    </footer>
  );
}
