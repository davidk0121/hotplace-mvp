"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import OnboardingSteps from "@/components/OnboardingSteps";
import { CATEGORIES } from "@/lib/constants";
import { placesRepo, seedDemoData } from "@/lib/storage";
import { Category, Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function PlacesPage() {
  const { t } = useI18n();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPlaces(placesRepo.list());
    setLoaded(true);
  }, []);

  function handleDelete(id: string) {
    if (!confirm(t.places.deleteConfirm)) return;
    placesRepo.remove(id);
    setPlaces(placesRepo.list());
  }

  function handleLoadSample() {
    seedDemoData();
    setPlaces(placesRepo.list());
  }

  const filtered = useMemo(
    () =>
      filter === "all" ? places : places.filter((p) => p.category === filter),
    [places, filter]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{t.places.title}</h1>
          <p className="text-sm text-muted-foreground">{t.places.subtitle}</p>
        </div>
        <Link
          href="/places/new"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          {t.places.add}
        </Link>
      </div>

      {/* 필터는 저장한 장소가 있을 때만 노출 */}
      {places.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.places.all}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === c.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {c.emoji} {t.categories[c.value]}
            </button>
          ))}
        </div>
      )}

      {/* 완전히 빈 상태: 온보딩 3단계 + 첫 저장/샘플 불러오기 */}
      {loaded && places.length === 0 && (
        <div className="mt-6 flex flex-col gap-6">
          <OnboardingSteps />
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="max-w-xs text-muted-foreground">
              {t.places.emptyNone}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/places/new"
                className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                {t.places.addFirst}
              </Link>
              <button
                onClick={handleLoadSample}
                className="rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                {t.demo.load}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 장소는 있지만 이 카테고리에만 없을 때 */}
      {loaded && places.length > 0 && filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">📍</div>
          <p className="max-w-xs text-muted-foreground">
            {t.places.emptyCategory}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((place) => (
          <PlaceCard key={place.id} place={place} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
