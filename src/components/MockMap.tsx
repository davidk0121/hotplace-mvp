"use client";

import { categoryColor, categoryEmoji } from "@/lib/constants";
import { buildMapLinks } from "@/lib/mapLinks";
import { mockCoords } from "@/lib/mockMap";
import { Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface MockMapProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// 실제 지도 API 없이 만든 목업 지도. place.id 해시로 핀 위치를 정한다.
export default function MockMap({ places, selectedId, onSelect }: MockMapProps) {
  const { t } = useI18n();
  const selected = places.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      {/* 지도 패널 */}
      <div className="relative h-64 w-full bg-muted">
        {/* faux streets / grid */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* faux river */}
        <div
          className="absolute left-0 right-0 top-1/2 h-8 -translate-y-1/2 opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)",
            transform: "translateY(-50%) rotate(-8deg)",
          }}
        />
        {/* faux parks */}
        <div
          className="absolute h-16 w-24 rounded-full opacity-25"
          style={{ left: "12%", top: "16%", background: "var(--accent)" }}
        />
        <div
          className="absolute h-12 w-16 rounded-full opacity-20"
          style={{ right: "10%", bottom: "14%", background: "var(--accent)" }}
        />
        {/* faux main road */}
        <div
          className="absolute left-0 right-0 opacity-30"
          style={{
            top: "26%",
            height: 3,
            background: "var(--muted-foreground)",
            transform: "rotate(4deg)",
          }}
        />

        {/* preview 배지 — 지리적으로 정확한 지도가 아님을 은은하게 안내 */}
        <span className="absolute bottom-2 right-2 z-30 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur">
          {t.map.preview}
        </span>

        {places.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-sm text-muted-foreground">{t.map.empty}</p>
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
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: active ? 20 : 10,
                }}
              >
                {/* 선택된 핀 위에 장소 이름 라벨 */}
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
                    transform: `translate(-50%, -50%) scale(${
                      active ? 1.1 : 1
                    })`,
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
      </div>

      {/* 선택된 핀 상세 / 안내 */}
      <div className="border-t border-border p-4">
        {selected ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
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
                </p>
              </div>
            </div>
            {selected.memo && (
              <p className="text-sm text-muted-foreground">{selected.memo}</p>
            )}
            <div className="flex flex-wrap gap-1.5">
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
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            {t.map.tapHint}
          </p>
        )}
      </div>
    </div>
  );
}
