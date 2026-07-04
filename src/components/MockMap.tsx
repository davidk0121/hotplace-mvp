"use client";

import { useState } from "react";
import { categoryColor, categoryEmoji } from "@/lib/constants";
import { buildMapLinks } from "@/lib/mapLinks";
import { mockCoords } from "@/lib/mockMap";
import { Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface MockMapProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** "내 위치" 컨트롤 → 상위(Home)의 geolocation 트리거 */
  onLocate?: () => void;
  locating?: boolean;
  /** 높이 등 사이즈 클래스 (예: "h-[56dvh] min-h-[420px]") */
  className?: string;
  /** true면 풀블리드(테두리/라운드 없음) — Home 히어로용 */
  bleed?: boolean;
}

const ZOOM_LEVELS = [0.7, 1, 1.4, 1.9];

const glassBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/85 text-base shadow-md backdrop-blur transition hover:bg-card";

/**
 * 목업 지도 표시 컴포넌트 — 실제 지도 API 없음.
 * 핀 좌표는 lib/mockMap.ts(id 해시)에서 온다. 나중에 실제 provider
 * (Mapbox/Google/MapKit)로 교체할 때 이 컴포넌트만 갈아끼우면 된다.
 */
export default function MockMap({
  places,
  selectedId,
  onSelect,
  onLocate,
  locating = false,
  className = "",
  bleed = false,
}: MockMapProps) {
  const { t } = useI18n();
  const [zoomIdx, setZoomIdx] = useState(1);
  const [satellite, setSatellite] = useState(false);
  const zoom = ZOOM_LEVELS[zoomIdx];
  const selected = places.find((p) => p.id === selectedId) ?? null;

  // 줌: 중심(50,50) 기준으로 핀 좌표를 퍼뜨리거나 모은다
  function project(v: number): number {
    return Math.min(97, Math.max(3, 50 + (v - 50) * zoom));
  }

  const frame = bleed
    ? ""
    : "rounded-3xl border border-border shadow-card";

  return (
    <div
      className={`relative overflow-hidden ${frame} ${
        satellite ? "bg-[#18241b]" : "bg-muted"
      } ${className}`}
    >
      {/* ── 지도 표면 ───────────────────────────────────────── */}
      {satellite ? (
        // 위성 모드 (시각적 mock)
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 28%, #33502f 0%, transparent 34%)," +
              "radial-gradient(circle at 72% 58%, #3e5a38 0%, transparent 40%)," +
              "radial-gradient(circle at 48% 84%, #2a4526 0%, transparent 30%)," +
              "radial-gradient(circle at 85% 15%, #4a5a40 0%, transparent 26%)," +
              "linear-gradient(160deg, #202f22 0%, #17231a 100%)",
          }}
        />
      ) : (
        // 일반 지도 모드: 도로 그리드
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: `${44 * zoom}px ${44 * zoom}px`,
          }}
        />
      )}

      {/* 강 */}
      <div
        className="absolute left-0 right-0 top-1/2 h-8"
        style={{
          opacity: satellite ? 0.55 : 0.4,
          background:
            "linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)",
          transform: "translateY(-50%) rotate(-8deg)",
        }}
      />
      {/* 공원 */}
      <div
        className="absolute h-16 w-24 rounded-full"
        style={{
          left: "12%",
          top: "16%",
          background: "var(--accent)",
          opacity: satellite ? 0.35 : 0.25,
        }}
      />
      <div
        className="absolute h-12 w-16 rounded-full"
        style={{
          right: "10%",
          bottom: "18%",
          background: "var(--accent)",
          opacity: satellite ? 0.3 : 0.2,
        }}
      />
      {/* 간선도로 */}
      {!satellite && (
        <div
          className="absolute left-0 right-0 opacity-30"
          style={{
            top: "26%",
            height: 3,
            background: "var(--muted-foreground)",
            transform: "rotate(4deg)",
          }}
        />
      )}

      {/* 배경 탭 → 선택 해제 */}
      <button
        type="button"
        aria-label="Deselect"
        onClick={() => onSelect(null)}
        className="absolute inset-0 cursor-default"
      />

      {/* ── 핀 ─────────────────────────────────────────────── */}
      {places.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
          <div className="rounded-2xl border border-border bg-card/85 px-5 py-4 text-center shadow-md backdrop-blur">
            <p className="text-sm font-bold text-card-foreground">
              {t.home.mapTitle}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.map.empty}</p>
          </div>
        </div>
      ) : (
        places.map((p) => {
          const { x, y } = mockCoords(p.id);
          const active = p.id === selectedId;
          const color = categoryColor(p.category);
          return (
            <div
              key={p.id}
              className="absolute"
              style={{
                left: `${project(x)}%`,
                top: `${project(y)}%`,
                zIndex: active ? 20 : 10,
              }}
            >
              {active && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background shadow-md"
                  style={{ bottom: 28 }}
                >
                  {p.name}
                </span>
              )}
              <button
                onClick={() => onSelect(p.id)}
                aria-label={p.name}
                className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform"
                style={{
                  width: active ? 40 : 30,
                  height: active ? 40 : 30,
                  background: color,
                  transform: `translate(-50%, -50%) scale(${active ? 1.1 : 1})`,
                  outline: active ? "3px solid var(--primary-soft)" : "none",
                }}
              >
                <span style={{ fontSize: active ? 18 : 14 }}>
                  {categoryEmoji(p.category)}
                </span>
              </button>
            </div>
          );
        })
      )}

      {/* ── 컨트롤 (우측) ───────────────────────────────────── */}
      <div className="absolute bottom-24 right-3 z-30 flex flex-col gap-2">
        <button
          aria-label={t.map.zoomIn}
          onClick={() => setZoomIdx((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
          className={glassBtn}
        >
          ＋
        </button>
        <button
          aria-label={t.map.zoomOut}
          onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
          className={glassBtn}
        >
          −
        </button>
        <button
          aria-label={t.map.recenter}
          onClick={() => {
            setZoomIdx(1);
            onSelect(null);
          }}
          className={glassBtn}
        >
          ◎
        </button>
        {onLocate && (
          <button
            aria-label={t.map.locate}
            onClick={onLocate}
            disabled={locating}
            className={`${glassBtn} ${locating ? "animate-pulse" : ""}`}
          >
            📍
          </button>
        )}
      </div>

      {/* ── 지도/위성 토글 (좌하단) ─────────────────────────── */}
      <div className="absolute bottom-3 left-3 z-30 flex overflow-hidden rounded-full border border-border bg-card/85 text-xs font-semibold shadow-md backdrop-blur">
        <button
          onClick={() => setSatellite(false)}
          className={`px-3.5 py-2 transition ${
            !satellite
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {t.map.mapMode}
        </button>
        <button
          onClick={() => setSatellite(true)}
          className={`px-3.5 py-2 transition ${
            satellite
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {t.map.satellite}
        </button>
      </div>

      {/* preview 배지 (우하단) */}
      <span className="absolute bottom-3 right-3 z-30 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur">
        {t.map.preview}
      </span>

      {/* ── 선택된 장소 플로팅 카드 ─────────────────────────── */}
      {selected && (
        <div className="absolute inset-x-3 bottom-14 z-40 rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: `${categoryColor(selected.category)}22` }}
            >
              {categoryEmoji(selected.category)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-card-foreground">
                {selected.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {[selected.region, t.categories[selected.category]]
                  .filter(Boolean)
                  .join(" · ")}
                {selected.memo ? ` · ${selected.memo}` : ""}
              </p>
            </div>
            <button
              aria-label="Close"
              onClick={() => onSelect(null)}
              className="shrink-0 text-lg text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(() => {
              const q = [selected.name, selected.region]
                .filter(Boolean)
                .join(" ");
              const links = buildMapLinks(q);
              return (
                <>
                  <a
                    href={links.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Google
                  </a>
                  <a
                    href={links.naver}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Naver
                  </a>
                  <a
                    href={links.kakao}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Kakao
                  </a>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
