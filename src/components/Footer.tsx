"use client";

import { useState } from "react";
import { FEEDBACK_FORM_URL, hasFeedbackForm } from "@/lib/config";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  const [showSoon, setShowSoon] = useState(false);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center">
        {hasFeedbackForm() ? (
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {t.footer.feedback}
          </a>
        ) : (
          <button
            onClick={() => setShowSoon(true)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
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
