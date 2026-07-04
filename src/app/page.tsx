"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import QuickSave from "@/components/QuickSave";
import NearbyExplore from "@/components/NearbyExplore";
import MockMap, { MapMode } from "@/components/MockMap";
import ListCard from "@/components/ListCard";
import SaveFromAnywhere from "@/components/SaveFromAnywhere";
import WaitlistForm from "@/components/WaitlistForm";
import { categoryEmoji } from "@/lib/constants";
import { AREA_KEYS, AreaKey } from "@/lib/nearby";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

type Mode = "nearme" | AreaKey;
// 위치 요청의 명확한 상태 머신 — 모든 단계가 화면에 보이도록 한다
type GeoStatus = "idle" | "locating" | "active" | "denied" | "unavailable";

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

  const refresh = useCallback(() => {
    setPlaces(placesRepo.list());
    setLists(listsRepo.list());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 실패 메시지는 잠시 보여주고 자동으로 지운다
  function fadeError(status: "denied" | "unavailable") {
    setGeoStatus(status);
    setTimeout(
      () =>
        setGeoStatus((s) => (s === "denied" || s === "unavailable" ? "idle" : s)),
      5000
    );
  }

  // "내 위치" — 좌표만 받고 mock에 사용 (외부 API 없음)
  function handleRequestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      fadeError("unavailable");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setMode("nearme");
        setGeoStatus("active");
      },
      (err) => {
        fadeError(err.code === 1 ? "denied" : "unavailable");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function pickArea(a: AreaKey) {
    setMode(a);
    // 위치 마커(userLocation)는 유지 — 실제 지도앱처럼 blue dot은 계속 보인다
    if (geoStatus === "active") setGeoStatus("idle");
  }

  function handleSaved(place: Place) {
    refresh();
    setSelectedId(place.id);
  }

  function handleViewOnMap(place: Place) {
    setSelectedId(place.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const locating = geoStatus === "locating";

  // 상태 칩 문구 (locating → 성공 배지 → 실패 안내)
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

  return (
    <div className="flex flex-col">
      <h1 className="sr-only">{t.home.title}</h1>

      {/* ── 풀블리드 지도 히어로 ─────────────────────────────── */}
      <div className="relative">
        <MockMap
          bleed
          className="h-[56dvh] min-h-[420px] w-full"
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
        <div className="absolute inset-x-3 top-3 z-30 mx-auto max-w-xl">
          <QuickSave onSaved={handleSaved} onViewOnMap={handleViewOnMap} />
        </div>

        {/* 플로팅 지역 칩 (글래스 pill) */}
        <div className="absolute inset-x-0 top-[72px] z-30 overflow-x-auto px-3">
          <div className="mx-auto flex w-max gap-2 pb-1">
            <button
              onClick={handleRequestLocation}
              disabled={locating}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
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
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
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

        {/* 위치 상태 칩 — 탭 직후부터 항상 보이는 피드백 */}
        {statusChip && (
          <p
            className="glass-strong absolute left-1/2 top-[122px] z-30 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-foreground"
            role="status"
          >
            {statusChip}
          </p>
        )}
      </div>

      {/* ── 글래스 바텀 시트 스타일 콘텐츠 ───────────────────── */}
      <div className="glass-strong relative z-10 -mt-5 rounded-t-3xl border-x-0 border-b-0 pb-6 pt-2">
        <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-muted-foreground/30" />
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
