"use client";

import Link from "next/link";
import { useState } from "react";
import PlaceForm from "@/components/PlaceForm";
import SaveFromAnywhere from "@/components/SaveFromAnywhere";
import { placesRepo } from "@/lib/storage";
import { detectSource, SOURCE_EMOJI } from "@/lib/source";
import { NewPlaceInput, Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

type Phase = "input" | "confirm" | "saved";

interface QuickSaveProps {
  onSaved?: (place: Place) => void;
  onViewOnMap?: (place: Place) => void;
}

// Home 상단 save-first 박스: 붙여넣기 → 출처 감지 + 최소 확인 → 지도에 저장
export default function QuickSave({ onSaved, onViewOnMap }: QuickSaveProps) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("input");
  const [raw, setRaw] = useState("");
  const [savedPlace, setSavedPlace] = useState<Place | null>(null);

  const source = detectSource(raw);

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!raw.trim()) return;
    setPhase("confirm");
  }

  function handleSave(input: NewPlaceInput) {
    const place = placesRepo.create(input);
    setSavedPlace(place);
    setPhase("saved");
    onSaved?.(place);
  }

  function reset() {
    setRaw("");
    setSavedPlace(null);
    setPhase("input");
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <h1 className="text-xl font-extrabold text-card-foreground">
        {t.home.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.home.subtitle}</p>

      {phase === "input" && (
        <>
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
          <p className="mt-2 text-xs text-muted-foreground">{t.quickSave.hint}</p>
          <div className="mt-4">
            <SaveFromAnywhere />
          </div>
        </>
      )}

      {phase === "confirm" && (
        <div className="mt-4">
          {/* 감지된 출처 배지 */}
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span>{SOURCE_EMOJI[source]}</span>
            <span>
              {t.quickSave.detectedFrom} {t.source[source]}
            </span>
          </div>
          <PlaceForm
            draftInput={raw}
            submitLabel={t.quickSave.start}
            onSubmit={handleSave}
            onCancel={reset}
          />
        </div>
      )}

      {phase === "saved" && savedPlace && (
        <div className="mt-4 rounded-2xl bg-primary-soft p-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-card text-xl shadow-sm">
            ✓
          </div>
          <p className="mt-2 font-bold text-card-foreground">
            {t.quickSave.savedTitle}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.quickSave.savedBody(savedPlace.name)}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => {
                onViewOnMap?.(savedPlace);
                reset();
              }}
              className="flex-1 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              📍 {t.quickSave.viewOnMap}
            </button>
            <Link
              href="/lists"
              className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {t.quickSave.addToList}
            </Link>
          </div>
          <button
            onClick={reset}
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            {t.quickSave.saveAnother}
          </button>
        </div>
      )}
    </section>
  );
}
