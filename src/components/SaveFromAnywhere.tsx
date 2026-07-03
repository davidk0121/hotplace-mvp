"use client";

import { useI18n } from "@/i18n/I18nProvider";

// 짧고 친근한 "어디서든 저장" 안내. Home 빠른 저장 근처에 배치.
export default function SaveFromAnywhere() {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <p className="text-sm font-bold text-foreground">
        {t.saveFromAnywhere.title}
      </p>
      <ol className="mt-2 flex flex-col gap-1.5">
        {t.saveFromAnywhere.steps.map((step, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary-soft-foreground">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
