"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { categoryEmoji } from "@/lib/constants";
import { buildMapLinks } from "@/lib/mapLinks";
import {
  generatePlan,
  GeneratedPlan,
  MIN_PLACES_FOR_GOOD_PLAN,
  PlanSlotKey,
} from "@/lib/plan";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

const SLOT_EMOJI: Record<PlanSlotKey, string> = {
  morning: "🌅",
  lunch: "🍽️",
  afternoon: "🏙️",
  evening: "🌙",
};

// useSearchParams는 Suspense 경계가 필요하므로 내부 컴포넌트로 분리한다.
export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <PlanPageInner />
    </Suspense>
  );
}

function PlanPageInner() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listId = searchParams.get("list");

  const [list, setList] = useState<PlaceList | null>(null);
  const [contextPlaces, setContextPlaces] = useState<Place[]>([]);
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const all = placesRepo.list();
    if (listId) {
      const found = listsRepo.get(listId) ?? null;
      setList(found);
      setContextPlaces(
        found
          ? found.placeIds
              .map((id) => all.find((p) => p.id === id))
              .filter((p): p is Place => Boolean(p))
          : []
      );
    } else {
      setList(null);
      setContextPlaces(all);
    }
  }, [listId]);

  // plan 슬롯의 placeId를 실제 Place로 빠르게 변환하기 위한 맵
  const placeById = useMemo(() => {
    const map = new Map<string, Place>();
    contextPlaces.forEach((p) => map.set(p.id, p));
    return map;
  }, [contextPlaces]);

  function runGenerate(nextSeed: number) {
    setGenerating(true);
    // 실제 AI 호출처럼 살짝의 텀을 준다 (mock).
    setTimeout(() => {
      setPlan(
        generatePlan(
          { prompt, listId: listId ?? null, places: contextPlaces },
          nextSeed
        )
      );
      setGenerating(false);
    }, 450);
  }

  function handleGenerate() {
    setSeed(0);
    runGenerate(0);
  }

  function handleShuffle() {
    const next = seed + 1;
    setSeed(next);
    runGenerate(next);
  }

  const backHref = listId ? `/lists/${listId}` : "/lists";
  const hasContext = contextPlaces.length > 0;
  const nonEmptySlots = plan?.slots.filter((s) => s.placeIds.length > 0) ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={backHref}
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {t.plan.back}
      </Link>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-2xl">🗺️</span>
        <h1 className="text-2xl font-extrabold">{t.plan.title}</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{t.plan.subtitle}</p>

      {/* 리스트 컨텍스트 */}
      {list && (
        <div className="mt-5 rounded-3xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.plan.fromListLabel}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <h2 className="font-bold text-card-foreground">{list.title}</h2>
            <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-soft-foreground">
              {t.lists.placeCount(list.placeIds.length)}
            </span>
          </div>
          {contextPlaces.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {contextPlaces.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <span>{categoryEmoji(p.category)}</span>
                  <span>{p.name}</span>
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/lists/${list.id}`}
            className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
          >
            {t.plan.viewList}
          </Link>
        </div>
      )}

      {/* 컨텍스트가 아예 없을 때 */}
      {!hasContext ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">🧭</div>
          <p className="max-w-xs text-muted-foreground">
            {t.plan.emptyContext}
          </p>
          <Link
            href="/places/new"
            className="mt-1 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            {t.plan.goSavePlaces}
          </Link>
        </div>
      ) : (
        <>
          {/* 입력 */}
          <div className="mt-6">
            <label className="mb-1 block text-sm font-semibold text-foreground">
              {t.plan.promptLabel}
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.plan.promptPlaceholder}
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-soft"
            />
            <p className="mb-2 mt-3 text-xs text-muted-foreground">
              {t.plan.examplesLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.plan.examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted"
                >
                  {ex}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-5 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
            >
              {generating ? t.plan.generating : t.plan.generate}
            </button>

            {contextPlaces.length < MIN_PLACES_FOR_GOOD_PLAN && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {t.plan.tooFew}
              </p>
            )}
          </div>

          {/* 결과 */}
          {plan && !generating && (
            <div className="mt-8">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold">{t.plan.resultTitle}</h2>
                <button
                  onClick={handleShuffle}
                  className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted"
                >
                  {t.plan.regenerate}
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.plan.resultIntro(contextPlaces.length)}
              </p>

              <div className="mt-5 space-y-6">
                {nonEmptySlots.map((slot) => (
                  <div key={slot.key}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">{SLOT_EMOJI[slot.key]}</span>
                      <h3 className="font-bold text-foreground">
                        {t.plan.slots[slot.key]}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {slot.placeIds.map((id) => {
                        const place = placeById.get(id);
                        if (!place) return null;
                        const mapQuery = [place.name, place.region]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                              {categoryEmoji(place.category)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-card-foreground">
                                {place.name}
                              </p>
                              {place.region && (
                                <p className="truncate text-xs text-muted-foreground">
                                  📍 {place.region}
                                </p>
                              )}
                            </div>
                            <a
                              href={buildMapLinks(mapQuery).google}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted"
                            >
                              Map
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                {t.plan.disclaimer}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
