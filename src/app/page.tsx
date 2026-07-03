"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import QuickSave from "@/components/QuickSave";
import NearbyExplore from "@/components/NearbyExplore";
import ListCard from "@/components/ListCard";
import WaitlistForm from "@/components/WaitlistForm";
import { categoryEmoji } from "@/lib/constants";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function Home() {
  const { t } = useI18n();
  const [places, setPlaces] = useState<Place[]>([]);
  const [lists, setLists] = useState<PlaceList[]>([]);

  const refresh = useCallback(() => {
    setPlaces(placesRepo.list());
    setLists(listsRepo.list());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const recent = [...places]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-6">
      {/* 1. Save-first: 빠른 저장 */}
      <QuickSave onSaved={refresh} />

      {/* 2. 주변 발견 (mock) */}
      <NearbyExplore onSaved={refresh} />

      {/* 3. 최근 저장 */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">{t.home.recentTitle}</h2>
            <Link
              href="/places"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t.home.recentSeeAll}
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {recent.map((p) => (
              <Link
                key={p.id}
                href="/places"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition hover:bg-muted"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                  {categoryEmoji(p.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-card-foreground">
                    {p.name}
                  </p>
                  {p.region && (
                    <p className="truncate text-xs text-muted-foreground">
                      📍 {p.region}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {t.categories[p.category]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. 리스트 미리보기 */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{t.home.listsTitle}</h2>
          {lists.length > 0 && (
            <Link
              href="/lists"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t.home.listsSeeAll}
            </Link>
          )}
        </div>
        {lists.length === 0 ? (
          <div className="mt-3 rounded-3xl border border-border bg-card p-5 text-center shadow-card">
            <p className="text-sm text-muted-foreground">{t.home.listsEmpty}</p>
            <Link
              href="/lists/new"
              className="mt-3 inline-block rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              {t.home.makeList}
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {lists.slice(0, 6).map((l) => (
              <div key={l.id} className="w-64 shrink-0">
                <ListCard list={l} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. 얇은 waitlist (early access) */}
      <section className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-muted/40 p-5 text-center">
        <h2 className="text-base font-bold">{t.landing.notifyMe}</h2>
        <WaitlistForm />
      </section>
    </div>
  );
}
