"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import QuickSave from "@/components/QuickSave";
import NearbyExplore from "@/components/NearbyExplore";
import MockMap from "@/components/MockMap";
import ListCard from "@/components/ListCard";
import SaveFromAnywhere from "@/components/SaveFromAnywhere";
import WaitlistForm from "@/components/WaitlistForm";
import { categoryEmoji } from "@/lib/constants";
import { AREA_KEYS, AreaKey } from "@/lib/nearby";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

type Mode = "nearme" | AreaKey;

export default function Home() {
  const { t } = useI18n();
  const [places, setPlaces] = useState<Place[]>([]);
  const [lists, setLists] = useState<PlaceList[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 위치/지역 모드 — 기본은 지역(첫 유스케이스인 서울), "Near me" 칩으로 위치 모드 전환
  const [mode, setMode] = useState<Mode>("seoul");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(false);

  const refresh = useCallback(() => {
    setPlaces(placesRepo.list());
    setLists(listsRepo.list());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // "내 위치" — 좌표만 받고 mock에 사용 (외부 API 없음). 거부 시 지역 선택 유지.
  function handleLocate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(true);
      setTimeout(() => setGeoError(false), 4000);
      return;
    }
    setLocating(true);
    setGeoError(false);
    navigator.geolocation.getCurrentPosition(
      () => {
        setMode("nearme");
        setLocating(false);
      },
      () => {
        setGeoError(true);
        setLocating(false);
        setTimeout(() => setGeoError(false), 4000);
      },
      { timeout: 8000 }
    );
  }

  function handleSaved(place: Place) {
    refresh();
    setSelectedId(place.id);
  }

  function handleViewOnMap(place: Place) {
    setSelectedId(place.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const recent = [...places]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="flex flex-col">
      <h1 className="sr-only">{t.home.title}</h1>

      {/* ── 풀블리드 지도 히어로 ─────────────────────────────── */}
      <div className="relative">
        <MockMap
          bleed
          className="h-[56dvh] min-h-[420px] w-full"
          places={places}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onLocate={handleLocate}
          locating={locating}
        />

        {/* 플로팅 붙여넣기 바 (primary action) */}
        <div className="absolute inset-x-3 top-3 z-30 mx-auto max-w-xl">
          <QuickSave onSaved={handleSaved} onViewOnMap={handleViewOnMap} />
        </div>

        {/* 플로팅 지역 칩 */}
        <div className="absolute inset-x-0 top-[72px] z-30 overflow-x-auto px-3">
          <div className="mx-auto flex w-max gap-2 pb-1">
            <button
              onClick={handleLocate}
              disabled={locating}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-md backdrop-blur transition ${
                mode === "nearme"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card/85 text-muted-foreground hover:bg-card"
              }`}
            >
              {locating ? t.nearby.locating : `📍 ${t.areas.nearme}`}
            </button>
            {AREA_KEYS.map((a) => (
              <button
                key={a}
                onClick={() => setMode(a)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-md backdrop-blur transition ${
                  mode === a
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/85 text-muted-foreground hover:bg-card"
                }`}
              >
                {t.areas[a]}
              </button>
            ))}
          </div>
        </div>

        {/* 위치 거부/실패 안내 */}
        {geoError && (
          <p className="absolute left-1/2 top-[120px] z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-md backdrop-blur">
            {t.nearby.denied}
          </p>
        )}
      </div>

      {/* ── 바텀 시트 스타일 콘텐츠 ─────────────────────────── */}
      <div className="relative z-10 -mt-5 rounded-t-3xl border-t border-border bg-background pb-6 pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-muted" />
        <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
          {t.home.mapTitle}
        </p>

        <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-8 px-4">
          {/* 주변 둘러보기 */}
          <NearbyExplore mode={mode} onSaved={handleSaved} />

          {/* 최근 저장 */}
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
                  <button
                    key={p.id}
                    onClick={() => handleViewOnMap(p)}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-card transition hover:bg-muted"
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
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 컬렉션 미리보기 */}
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
                <p className="text-sm text-muted-foreground">
                  {t.home.listsEmpty}
                </p>
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
                    <ListCard list={l} places={places} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 어디서든 저장하기 안내 */}
          <SaveFromAnywhere />

          {/* 얇은 waitlist */}
          <section className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-muted/40 p-5 text-center">
            <h2 className="text-base font-bold">{t.landing.notifyMe}</h2>
            <WaitlistForm />
          </section>
        </div>
      </div>
    </div>
  );
}
