"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import QuickSave from "@/components/QuickSave";
import NearbyExplore from "@/components/NearbyExplore";
import MockMap, { MapMode } from "@/components/MockMap";
import ListCard from "@/components/ListCard";
import SaveFromAnywhere from "@/components/SaveFromAnywhere";
import Footer from "@/components/Footer";
import { categoryEmoji } from "@/lib/constants";
import { AREA_KEYS, AreaKey } from "@/lib/nearby";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

type Mode = "nearme" | AreaKey;
type GeoStatus = "idle" | "locating" | "active" | "denied" | "unavailable";

// 바텀시트 collapsed 상태에서 보이는 peek(헤더) 높이
const PEEK = 76;

export default function Home() {
  const { t } = useI18n();
  const [places, setPlaces] = useState<Place[]>([]);
  const [lists, setLists] = useState<PlaceList[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("seoul");
  const [mapMode, setMapMode] = useState<MapMode>("map");
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const refresh = useCallback(() => {
    setPlaces(placesRepo.list());
    setLists(listsRepo.list());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function fadeError(status: "denied" | "unavailable") {
    setGeoStatus(status);
    setTimeout(
      () =>
        setGeoStatus((s) =>
          s === "denied" || s === "unavailable" ? "idle" : s
        ),
      5000
    );
  }

  function handleRequestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      fadeError("unavailable");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMode("nearme");
        setGeoStatus("active");
      },
      (err) => fadeError(err.code === 1 ? "denied" : "unavailable"),
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function pickArea(a: AreaKey) {
    setMode(a);
    if (geoStatus === "active") setGeoStatus("idle");
  }

  function handleSaved(place: Place) {
    refresh();
    setSelectedId(place.id);
  }

  // 저장 직후 "지도에서 보기": 핀 선택 + 시트 접어서 지도를 보여준다
  function handleViewOnMap(place: Place) {
    setSelectedId(place.id);
    setSheetOpen(false);
  }

  const locating = geoStatus === "locating";
  const statusChip =
    geoStatus === "locating"
      ? t.nearby.locating
      : geoStatus === "active" && mode === "nearme"
      ? `📍 ${t.nearby.nearYouBadge}`
      : geoStatus === "denied"
      ? t.nearby.deniedBlocked
      : geoStatus === "unavailable"
      ? t.nearby.unavailable
      : null;

  const recent = [...places]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);
  const hasContent = places.length > 0;

  const recentSection = recent.length > 0 && (
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
            className="tap flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-card transition hover:bg-muted"
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
  );

  const collectionsSection = (
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
            className="tap mt-3 inline-block rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
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
  );

  const exploreSection = <NearbyExplore mode={mode} onSaved={handleSaved} />;

  return (
    <div className="relative h-[calc(100dvh-3.5rem-5rem)] overflow-hidden sm:h-[calc(100dvh-3.5rem)]">
      <h1 className="sr-only">{t.home.title}</h1>

      {/* 배경 지도 (전체) */}
      <MockMap
        bleed
        contentInset={PEEK + 12}
        className="absolute inset-0 h-full w-full"
        places={places}
        selectedPlaceId={selectedId}
        userLocation={userLocation}
        mapMode={mapMode}
        locating={locating}
        onSelectPlace={setSelectedId}
        onRequestLocation={handleRequestLocation}
        onToggleMapMode={setMapMode}
      />

      {/* 플로팅 붙여넣기 바 (primary action) */}
      <div className="absolute inset-x-3 top-3 z-40 mx-auto max-w-xl">
        <QuickSave onSaved={handleSaved} onViewOnMap={handleViewOnMap} />
      </div>

      {/* 플로팅 지역 칩 */}
      <div className="absolute inset-x-0 top-[72px] z-30 overflow-x-auto px-3">
        <div className="mx-auto flex w-max gap-2 pb-1">
          <button
            onClick={handleRequestLocation}
            disabled={locating}
            className={`tap shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              mode === "nearme"
                ? "bg-primary text-primary-foreground shadow-md"
                : "glass text-foreground"
            }`}
          >
            {locating ? t.nearby.locating : `📍 ${t.areas.nearme}`}
          </button>
          {AREA_KEYS.map((a) => (
            <button
              key={a}
              onClick={() => pickArea(a)}
              className={`tap shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                mode === a
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "glass text-foreground"
              }`}
            >
              {t.areas[a]}
            </button>
          ))}
        </div>
      </div>

      {/* 위치 상태 칩 */}
      {statusChip && (
        <p
          className="glass-strong absolute left-1/2 top-[122px] z-30 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-foreground"
          role="status"
        >
          {statusChip}
        </p>
      )}

      {/* ── 2단계 바텀 시트 (collapsed / expanded) ───────────── */}
      <div
        className="absolute inset-x-0 bottom-0 z-40 flex h-[82%] flex-col rounded-t-3xl border-t border-border bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out"
        style={{
          transform: sheetOpen
            ? "translateY(0)"
            : `translateY(calc(100% - ${PEEK}px))`,
        }}
      >
        {/* peek 헤더 — 탭하면 열고 닫힘 */}
        <button
          onClick={() => setSheetOpen((v) => !v)}
          aria-label="Toggle sheet"
          className="shrink-0 px-4 pb-2 pt-2"
          style={{ height: PEEK }}
        >
          <span className="mx-auto block h-1 w-10 rounded-full bg-muted-foreground/30" />
          <span className="mt-3 flex items-center justify-between">
            <span className="text-base font-extrabold text-foreground">
              {t.home.sheetTitle}
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {t.lists.placeCount(places.length)}
              <span
                className="transition-transform duration-300"
                style={{ transform: sheetOpen ? "rotate(180deg)" : "none" }}
              >
                ⌃
              </span>
            </span>
          </span>
        </button>

        {/* 스크롤 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {hasContent ? (
              <>
                {recentSection}
                {collectionsSection}
                {exploreSection}
              </>
            ) : (
              <>
                {exploreSection}
                {collectionsSection}
              </>
            )}
            <SaveFromAnywhere />
            <Footer embedded />
          </div>
        </div>
      </div>
    </div>
  );
}
