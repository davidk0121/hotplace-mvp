"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { categoryColor, categoryEmoji } from "@/lib/constants";
import { buildMapLinks } from "@/lib/mapLinks";
import { mapStyleUrl } from "@/lib/maptiler";
import { Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { useTheme } from "@/components/ThemeProvider";
import type { MapViewProps } from "@/components/MockMap";

const DEFAULT_CENTER: [number, number] = [126.978, 37.5665]; // 서울
const glassBtn =
  "tap glass flex h-10 w-10 items-center justify-center rounded-full text-base text-foreground hover:opacity-90";

// place.id → 핀 DOM 마커
function buildPinEl(place: Place, active: boolean, onClick: () => void) {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", place.name);
  const size = active ? 40 : 30;
  el.style.cssText = `width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;border:2px solid #fff;background:${categoryColor(
    place.category
  )};box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;transition:transform .15s ease;${
    active ? "outline:3px solid var(--primary-soft);" : ""
  }`;
  el.innerHTML = `<span style="font-size:${active ? 18 : 14}px">${categoryEmoji(
    place.category
  )}</span>`;
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  return el;
}

function buildUserEl() {
  const el = document.createElement("div");
  el.style.cssText = "width:16px;height:16px;position:relative;";
  el.innerHTML = `
    <span style="position:absolute;inset:-8px;border-radius:9999px;background:rgba(10,132,255,.3);animation:hp-ping 1.2s cubic-bezier(0,0,.2,1) infinite"></span>
    <span style="position:absolute;inset:0;border-radius:9999px;border:2px solid #fff;background:#0a84ff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`;
  return el;
}

/**
 * 실제 MapLibre + MapTiler 지도. MapViewProps를 구현하므로 MockMap과 교체 가능.
 * (Home은 NEXT_PUBLIC_MAPTILER_KEY 유무로 이 컴포넌트/MockMap 중 하나를 렌더)
 */
export default function MapLibreView({
  places,
  selectedPlaceId,
  userLocation,
  center,
  mapMode,
  locating = false,
  onSelectPlace,
  onRequestLocation,
  onToggleMapMode,
  className = "",
  contentInset = 12,
}: MapViewProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [ready, setReady] = useState(false);

  const selected = places.find((p) => p.id === selectedPlaceId) ?? null;

  // 지도 초기화 (mount 1회)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyleUrl(mapMode, theme),
      center: center ? [center.lng, center.lat] : DEFAULT_CENTER,
      zoom: 12,
      attributionControl: { compact: true },
    });
    map.on("load", () => setReady(true));
    map.on("click", () => onSelectPlace(null));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      userMarkerRef.current = null;
      setReady(false);
    };
    // 초기화는 1회만; 이후 변경은 별도 effect가 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스타일(지도/위성 · 라이트/다크) 변경 — 마커는 DOM이라 유지된다
  useEffect(() => {
    if (mapRef.current && ready) {
      mapRef.current.setStyle(mapStyleUrl(mapMode, theme));
    }
  }, [mapMode, theme, ready]);

  // 저장된 장소 핀 (lat/lng 있는 것만)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const seen = new Set<string>();
    for (const p of places) {
      if (typeof p.lat !== "number" || typeof p.lng !== "number") continue;
      seen.add(p.id);
      const existing = markersRef.current.get(p.id);
      if (existing) existing.remove();
      const el = buildPinEl(p, p.id === selectedPlaceId, () => onSelectPlace(p.id));
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
      markersRef.current.set(p.id, marker);
    }
    // 사라진 마커 정리
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }
  }, [places, selectedPlaceId, ready, onSelectPlace]);

  // 사용자 위치 파란 점
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (!userLocation) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }
    if (!userMarkerRef.current) {
      userMarkerRef.current = new maplibregl.Marker({ element: buildUserEl() }).addTo(
        map
      );
    }
    userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
  }, [userLocation, ready]);

  // 중심 이동 (지역칩/내 위치)
  useEffect(() => {
    if (mapRef.current && ready && center) {
      mapRef.current.flyTo({ center: [center.lng, center.lat], zoom: 12, duration: 700 });
    }
  }, [center?.lat, center?.lng, ready]);

  // 선택된 핀으로 이동
  useEffect(() => {
    if (mapRef.current && ready && selected?.lat != null && selected?.lng != null) {
      mapRef.current.easeTo({
        center: [selected.lng, selected.lat],
        zoom: Math.max(mapRef.current.getZoom(), 14),
        duration: 600,
      });
    }
  }, [selectedPlaceId, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  function recenter() {
    const map = mapRef.current;
    if (!map) return;
    const c = userLocation ?? center;
    map.flyTo({
      center: c ? [c.lng, c.lat] : DEFAULT_CENTER,
      zoom: 12,
      duration: 600,
    });
    onSelectPlace(null);
  }

  const satellite = mapMode === "satellite";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />

      {/* 우측 컨트롤 */}
      <div
        className="absolute right-3 z-30 flex flex-col gap-2"
        style={{ bottom: contentInset + 52 }}
      >
        <button
          aria-label={t.map.zoomIn}
          onClick={() => mapRef.current?.zoomIn()}
          className={glassBtn}
        >
          ＋
        </button>
        <button
          aria-label={t.map.zoomOut}
          onClick={() => mapRef.current?.zoomOut()}
          className={glassBtn}
        >
          −
        </button>
        <button aria-label={t.map.recenter} onClick={recenter} className={glassBtn}>
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

      {/* 지도/위성 세그먼트 */}
      <div
        className="glass absolute left-3 z-30 flex items-center rounded-full p-1 text-xs font-semibold"
        style={{ bottom: contentInset }}
      >
        <button
          onClick={() => onToggleMapMode("map")}
          className={`tap rounded-full px-3.5 py-1.5 transition-colors ${
            !satellite
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {t.map.mapMode}
        </button>
        <button
          onClick={() => onToggleMapMode("satellite")}
          className={`tap rounded-full px-3.5 py-1.5 transition-colors ${
            satellite
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {t.map.satellite}
        </button>
      </div>

      {/* 선택된 장소 카드 */}
      {selected && (
        <div
          className="glass-strong absolute inset-x-3 z-40 rounded-2xl p-3"
          style={{ bottom: contentInset }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: `${categoryColor(selected.category)}22` }}
            >
              {categoryEmoji(selected.category)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-foreground">{selected.name}</p>
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
              const q = [selected.name, selected.region].filter(Boolean).join(" ");
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
