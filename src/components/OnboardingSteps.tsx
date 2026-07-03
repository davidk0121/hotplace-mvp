"use client";

import { useI18n } from "@/i18n/I18nProvider";

// 빈 My Places 상태에서 "이 앱으로 뭘 하는지" 3단계로 보여준다.
export default function OnboardingSteps() {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <h2 className="text-center text-sm font-bold text-card-foreground">
        {t.onboarding.title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {t.onboarding.steps.map((step, i) => (
          <div
            key={step.title}
            className="flex items-start gap-3 rounded-2xl bg-muted p-3 sm:flex-col sm:items-center sm:text-center"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-lg shadow-sm">
              {step.emoji}
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground">
                <span className="text-primary">{i + 1}</span> · {step.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
