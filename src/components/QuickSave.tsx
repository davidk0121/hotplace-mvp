"use client";

import Link from "next/link";
import { useState } from "react";
import PlaceForm from "@/components/PlaceForm";
import { listsRepo, placesRepo } from "@/lib/storage";
import { detectSource, SOURCE_EMOJI } from "@/lib/source";
import { NewPlaceInput, Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

type Phase = "bar" | "confirm" | "saved";

interface QuickSaveProps {
  onSaved?: (place: Place) => void;
  onViewOnMap?: (place: Place) => void;
}

/**
 * 지도 위에 떠 있는 붙여넣기 바 (primary action).
 * 입력 → 오버레이 시트에서 출처 확인 + 최소 필드 → 지도에 저장.
 */
export default function QuickSave({ onSaved, onViewOnMap }: QuickSaveProps) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("bar");
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
    setPhase("bar");
  }

  return (
    <>
      {/* 플로팅 붙여넣기 바 (frosted) */}
      <form
        onSubmit={handleStart}
        className="glass-strong flex items-center gap-2 rounded-full p-1.5 pl-4"
      >
        <span className="shrink-0 text-base">🔍</span>
        <input
          type="text"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={t.quickSave.placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!raw.trim()}
          className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
        >
          {t.quickSave.start}
        </button>
      </form>

      {/* 확인 / 저장 완료 오버레이 시트 */}
      {phase !== "bar" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close"
            onClick={reset}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="glass-strong relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted sm:hidden" />

            {phase === "confirm" && (
              <>
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
              </>
            )}

            {phase === "saved" && savedPlace && (
              <div className="text-center">
                {/* 컬렉션이 없으면 빈 목록 대신 바로 만들기 화면으로 보낸다 */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-2xl">
                  ✓
                </div>
                <p className="mt-3 font-bold text-card-foreground">
                  {t.quickSave.savedTitle}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t.quickSave.savedBody(savedPlace.name)}
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => {
                      onViewOnMap?.(savedPlace);
                      reset();
                    }}
                    className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                  >
                    📍 {t.quickSave.viewOnMap}
                  </button>
                  <Link
                    href={listsRepo.list().length > 0 ? "/lists" : "/lists/new"}
                    className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    {listsRepo.list().length > 0
                      ? t.quickSave.addToList
                      : t.quickSave.makeList}
                  </Link>
                </div>
                <button
                  onClick={reset}
                  className="mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  {t.quickSave.saveAnother}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
