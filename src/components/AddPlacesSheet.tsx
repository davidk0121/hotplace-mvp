"use client";

import Link from "next/link";
import { Place } from "@/lib/types";
import { categoryEmoji } from "@/lib/constants";
import { useI18n } from "@/i18n/I18nProvider";

interface AddPlacesSheetProps {
  open: boolean;
  onClose: () => void;
  /** 저장된 모든 장소 */
  places: Place[];
  /** 현재 리스트에 이미 들어있는 장소 id */
  selectedIds: string[];
  /** 장소를 누르면 추가/제거 토글 */
  onToggle: (placeId: string) => void;
}

export default function AddPlacesSheet({
  open,
  onClose,
  places,
  selectedIds,
  onToggle,
}: AddPlacesSheetProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* bottom sheet (모바일) / 중앙 모달 (데스크톱) */}
      <div className="relative flex max-h-[75vh] w-full max-w-lg flex-col rounded-t-3xl border border-border bg-card shadow-card sm:rounded-3xl">
        <div className="border-b border-border px-5 py-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted sm:hidden" />
          <h2 className="font-bold text-card-foreground">{t.addPlaces.title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t.addPlaces.subtitle}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {places.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="text-3xl">📍</div>
              <p className="text-sm text-muted-foreground">
                {t.addPlaces.empty}
              </p>
              <Link
                href="/places/new"
                className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                {t.addPlaces.goSave}
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {places.map((place) => {
                const added = selectedIds.includes(place.id);
                return (
                  <li key={place.id}>
                    <button
                      onClick={() => onToggle(place.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                        added ? "bg-primary-soft" : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                        {categoryEmoji(place.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-card-foreground">
                          {place.name}
                        </p>
                        {place.region && (
                          <p className="truncate text-xs text-muted-foreground">
                            📍 {place.region}
                          </p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          added
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {added ? t.addPlaces.added : "+"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            {t.addPlaces.done}
          </button>
        </div>
      </div>
    </div>
  );
}
