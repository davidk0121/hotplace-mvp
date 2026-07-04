"use client";

import { useState } from "react";
import { categoryColor, categoryEmoji } from "@/lib/constants";
import { buildMapLinks } from "@/lib/mapLinks";
import { mockCoords } from "@/lib/mockMap";
import { Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export type MapMode = "map" | "satellite";

/**
 * 지도 뷰 공용 인터페이스.
 *
 * 나중에 실제 provider(Mapbox GL / Google Maps JS / Apple MapKit JS)로 교체할 때
 * 이 props 시그니처를 그대로 구현하는 <MapboxView>/<GoogleMapView>/<MapKitView>를
 * 만들어 MockMap 자리에 끼우면 된다. 호출부(Home)는 수정할 필요가 없다.
 *  - userLocation: 실제 지도에서는 카메라 센터/blue dot으로 사용
 *  - mockCoords(): 실제 좌표(lat/lng)→화면 투영으로 교체되는 부분
 *  - zoom: mock 전용 시각 효과 (실제 지도에서는 카메라 줌으로 대체)
 */
export interface MapViewProps {
  places: Place[];
  selectedPlaceId: string | null;
  /** 사용자의 현재 위치 (Geolocation 성공 시). mock에서는 중앙 blue dot으로 표시 */
  userLocation: { lat: number; lng: number } | null;
  mapMode: MapMode;
  locating?: boolean;
  onSelectPlace: (id: string | null) => void;
  onRequestLocation?: () => void;
  onRecenter?: () => void;
  onToggleMapMode: (mode: MapMode) => void;
  /** 높이 등 사이즈 클래스 (예: "h-[56dvh] min-h-[420px]") */
  className?: string;
  /** true면 풀블리드(테두리/라운드 없음) — Home 히어로용 */
  bleed?: boolean;
}

const ZOOM_LEVELS = [0.7, 1, 1.4, 1.9];

const glassBtn =
  "glass flex h-10 w-10 items-center justify-center rounded-full text-base text-foreground transition hover:opacity-90 active:scale-95";

/** 목업 지도 구현 — 실제 지도 API 없음. MapViewProps 인터페이스 참고. */
export default function MockMap({
  places,
  selectedPlaceId,
  userLocation,
  mapMode,
  locating = false,
  onSelectPlace,
  onRequestLocation,
  onRecenter,
  onToggleMapMode,
  className = "",
  bleed = false,
}: MapViewProps) {
  const { t } = useI18n();
  const [zoomIdx, setZoomIdx] = useState(1);
  const zoom = ZOOM_LEVELS[zoomIdx];
  const satellite = mapMode === "satellite";
  const selected = places.find((p) => p.id === selectedPlaceId) ?? null;

  // 줌: 중심(50,50) 기준으로 핀 좌표를 퍼뜨리거나 모은다
  function project(v: number): number {
    return Math.min(97, Math.max(3, 50 + (v - 50) * zoom));
  }

  function handleRecenter() {
    setZoomIdx(1);
    onSelectPlace(null);
    onRecenter?.();
  }

  const frame = bleed ? "" : "rounded-3xl border border-border shadow-card";

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
        onClick={() => onSelectPlace(null)}
        className="absolute inset-0 cursor-default"
      />

      {/* ── 사용자 현재 위치 마커 (iOS blue dot + 펄스) ──────── */}
      {userLocation && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[15] -translate-x-1/2 -translate-y-1/2"
          aria-label={t.nearby.usingLocation}
        >
          <div className="relative h-4 w-4">
            <span className="absolute -inset-2 animate-ping rounded-full bg-[#0a84ff]/30" />
            <span className="absolute -inset-1 rounded-full bg-[#0a84ff]/20" />
            <span className="relative block h-4 w-4 rounded-full border-2 border-white bg-[#0a84ff] shadow-md" />
          </div>
        </div>
      )}

      {/* ── 핀 ─────────────────────────────────────────────── */}
      {places.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
          <div className="glass-strong rounded-2xl px-5 py-4 text-center">
            <p className="text-sm font-bold text-foreground">
              {t.home.mapTitle}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.map.empty}</p>
          </div>
        </div>
      ) : (
        places.map((p) => {
          const { x, y } = mockCoords(p.id);
          const active = p.id === selectedPlaceId;
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
                onClick={() => onSelectPlace(p.id)}
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

      {/* ── 컨트롤 (우측, iOS 플로팅 글래스) ─────────────────── */}
      <div className="absolute bottom-24 right-3 z-30 flex flex-col gap-2">
        <button
          aria-label={t.map.zoomIn}
          onClick={() =>
            setZoomIdx((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))
          }
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
          onClick={handleRecenter}
          className={glassBtn}
        >
          ◎
        </button>
        {onRequestLocation && (
          <button
            aria-label={t.map.locate}
            onClick={onRequestLocation}
            disabled={locating}
            className={`${glassBtn} ${locating ? "animate-pulse" : ""}`}
          >
            📍
          </button>
        )}
      </div>

      {/* ── 지도/위성 세그먼트 (좌하단, iOS 스타일) ──────────── */}
      <div className="glass absolute bottom-3 left-3 z-30 flex items-center rounded-full p-1 text-xs font-semibold">
        <button
          onClick={() => onToggleMapMode("map")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            !satellite
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {t.map.mapMode}
        </button>
        <button
          onClick={() => onToggleMapMode("satellite")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            satellite
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {t.map.satellite}
        </button>
      </div>

      {/* preview 배지 — 핀 위치가 아직 실제가 아님을 분명히 (과하지 않게) */}
      <span className="glass absolute bottom-16 left-3 z-30 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground/80">
        🛈 {t.map.preview}
      </span>

      {/* ── 선택된 장소 플로팅 카드 (글래스, 가독성 강) ──────── */}
      {selected && (
        <div className="glass-strong absolute inset-x-3 bottom-14 z-40 rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: `${categoryColor(selected.category)}22` }}
            >
              {categoryEmoji(selected.category)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-foreground">
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
              type="button"
              aria-label="Close"
              onClick={() => onSelectPlace(null)}
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
                    className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Google
                  </a>
                  <a
                    href={links.naver}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Naver
                  </a>
                  <a
                    href={links.kakao}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
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
