"use client";

import { useState } from "react";
import { categoryColor, categoryEmoji } from "@/lib/constants";
import {
  AreaKey,
  getMockNearbyByArea,
  getMockNearbyByLocation,
  NearbyPlace,
} from "@/lib/nearby";
import { placesRepo } from "@/lib/storage";
import { Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface NearbyExploreProps {
  /** 지도 칩에서 선택된 모드 — 'nearme'(위치) 또는 지역 키 */
  mode: "nearme" | AreaKey;
  onSaved?: (place: Place) => void;
}

// "주변 둘러보기" 제안 섹션 — 지역/모드 선택은 지도 위 칩이 담당한다.
export default function NearbyExplore({ mode, onSaved }: NearbyExploreProps) {
  const { t } = useI18n();
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const places: NearbyPlace[] =
    mode === "nearme" ? getMockNearbyByLocation(0, 0) : getMockNearbyByArea(mode);

  function keyOf(p: NearbyPlace) {
    return `${p.name}|${p.region}`;
  }

  function handleSave(p: NearbyPlace) {
    const place = placesRepo.create({
      name: p.name,
      region: p.region,
      category: p.category,
      memo: p.note,
      originalInput: p.name,
    });
    setSavedKeys((prev) => new Set(prev).add(keyOf(p)));
    onSaved?.(place);
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold">{t.nearby.title}</h2>
        <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
          {mode === "nearme" ? `📍 ${t.nearby.nearYouBadge}` : t.areas[mode]}
        </span>
      </div>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {t.nearby.subtitle}
      </p>

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
