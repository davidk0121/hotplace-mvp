"use client";

import Link from "next/link";
import { useState } from "react";
import PlaceForm from "@/components/PlaceForm";
import { placesRepo } from "@/lib/storage";
import { NewPlaceInput } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

type Phase = "input" | "confirm" | "saved";

// Home 상단의 save-first 빠른 저장 박스.
// 1) 붙여넣기/입력 → 2) 최소 필드 확인(PlaceForm) → 3) 저장 완료 + 다음 행동 CTA
export default function QuickSave({ onSaved }: { onSaved?: () => void }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("input");
  const [raw, setRaw] = useState("");
  const [savedName, setSavedName] = useState("");

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!raw.trim()) return;
    setPhase("confirm");
  }

  function handleSave(input: NewPlaceInput) {
    placesRepo.create(input);
    setSavedName(input.name);
    setPhase("saved");
    onSaved?.();
  }

  function reset() {
    setRaw("");
    setSavedName("");
    setPhase("input");
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <h1 className="text-xl font-extrabold text-card-foreground">
        {t.home.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.home.subtitle}</p>

      {phase === "input" && (
        <form onSubmit={handleStart} className="mt-4 flex flex-col gap-2">
          <textarea
            rows={2}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={t.quickSave.placeholder}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-soft"
          />
          <button
            type="submit"
            disabled={!raw.trim()}
            className="rounded-2xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
          >
            {t.quickSave.start}
          </button>
        </form>
      )}

      {phase === "confirm" && (
        <div className="mt-4">
          <PlaceForm
            draftInput={raw}
            submitLabel={t.quickSave.start}
            onSubmit={handleSave}
            onCancel={reset}
          />
        </div>
      )}

      {phase === "saved" && (
        <div className="mt-4 rounded-2xl bg-primary-soft p-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-card text-xl shadow-sm">
            ✓
          </div>
          <p className="mt-2 font-bold text-card-foreground">
            {t.quickSave.savedTitle}
          </p>
          <p className="text-sm text-muted-foreground">{savedName}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/lists/new"
              className="flex-1 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              {t.quickSave.makeList}
            </Link>
            <button
              onClick={reset}
              className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {t.quickSave.saveAnother}
            </button>
          </div>
          <Link
            href="/places"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            {t.quickSave.viewPlaces} →
          </Link>
        </div>
      )}
    </section>
  );
}
