"use client";

import { useState } from "react";
import { categoryColor, categoryEmoji } from "@/lib/constants";
import {
  AREA_KEYS,
  AreaKey,
  getMockNearbyByArea,
  getMockNearbyByLocation,
  NearbyPlace,
} from "@/lib/nearby";
import { placesRepo } from "@/lib/storage";
import { useI18n } from "@/i18n/I18nProvider";

export default function NearbyExplore({ onSaved }: { onSaved?: () => void }) {
  const { t } = useI18n();
  // 기본은 Seoul을 보여줘 바로 발견/저장할 거리가 있게 한다.
  const [area, setArea] = useState<AreaKey>("seoul");
  const [usingLocation, setUsingLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const places: NearbyPlace[] = usingLocation
    ? getMockNearbyByLocation(0, 0)
    : getMockNearbyByArea(area);

  function keyOf(p: NearbyPlace) {
    return `${p.name}|${p.region}`;
  }

  function handleUseLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(true);
      return;
    }
    setLocating(true);
    setGeoError(false);
    navigator.geolocation.getCurrentPosition(
      () => {
        // 좌표는 받지만 실제 검색 API는 호출하지 않는다 (무료 mock).
        setUsingLocation(true);
        setLocating(false);
      },
      () => {
        setGeoError(true);
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  function pickArea(a: AreaKey) {
    setArea(a);
    setUsingLocation(false);
  }

  function handleSave(p: NearbyPlace) {
    placesRepo.create({
      name: p.name,
      region: p.region,
      category: p.category,
      memo: p.note,
      originalInput: p.name,
    });
    setSavedKeys((prev) => new Set(prev).add(keyOf(p)));
    onSaved?.();
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold">{t.nearby.title}</h2>
          <p className="text-sm text-muted-foreground">{t.nearby.subtitle}</p>
        </div>
        <button
          onClick={handleUseLocation}
          disabled={locating}
          className="shrink-0 rounded-full bg-primary-soft px-3.5 py-2 text-xs font-semibold text-primary-soft-foreground transition hover:opacity-80 disabled:opacity-60"
        >
          {locating ? t.nearby.locating : t.nearby.useLocation}
        </button>
      </div>

      {geoError && (
        <p className="mt-2 text-xs text-muted-foreground">{t.nearby.denied}</p>
      )}

      {/* 지역 칩 */}
      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {usingLocation ? t.nearby.nearYou : t.nearby.chooseArea}
        </p>
        <div className="flex flex-wrap gap-2">
          {AREA_KEYS.map((a) => {
            const active = !usingLocation && area === a;
            return (
              <button
                key={a}
                onClick={() => pickArea(a)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.areas[a]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 주변 mock 장소 카드 (가로 스크롤) */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {places.map((p) => {
          const saved = savedKeys.has(keyOf(p));
          const color = categoryColor(p.category);
          return (
            <div
              key={keyOf(p)}
              className="flex w-52 shrink-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card"
            >
              <div
                className="flex h-20 items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${color}2e 0%, ${color}0d 100%)`,
                }}
              >
                <span className="text-3xl">{categoryEmoji(p.category)}</span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="font-bold leading-tight text-card-foreground">
                  {p.name}
                </p>
                <p className="text-xs text-muted-foreground">📍 {p.region}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {p.note}
                </p>
                <button
                  onClick={() => handleSave(p)}
                  disabled={saved}
                  className={`mt-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    saved
                      ? "bg-primary-soft text-primary-soft-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary-hover"
                  }`}
                >
                  {saved ? t.nearby.saved : t.nearby.save}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
