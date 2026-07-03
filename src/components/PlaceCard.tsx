"use client";

import Link from "next/link";
import { Place } from "@/lib/types";
import { buildMapLinks, isUrl } from "@/lib/mapLinks";
import { categoryColor, categoryEmoji } from "@/lib/constants";
import CategoryBadge from "./CategoryBadge";
import { useI18n } from "@/i18n/I18nProvider";

interface PlaceCardProps {
  place: Place;
  /** 내 장소 목록에서: 수정 링크 + 완전 삭제 */
  onDelete?: (id: string) => void;
  /** 리스트 상세에서: 리스트에서만 제거 (장소 자체는 유지) */
  onRemoveFromList?: (id: string) => void;
}

export default function PlaceCard({
  place,
  onDelete,
  onRemoveFromList,
}: PlaceCardProps) {
  const { t } = useI18n();
  const mapQuery = [place.name, place.region].filter(Boolean).join(" ");
  const mapLinks = buildMapLinks(mapQuery);
  const hasOriginalLink = isUrl(place.originalInput);
  const hasActions = Boolean(onDelete || onRemoveFromList);
  const color = categoryColor(place.category);

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-0.5">
      {/* 카테고리 컬러 커버 + 이모지 */}
      <div
        className="relative flex h-24 items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}2e 0%, ${color}0d 100%)`,
        }}
      >
        <span className="text-4xl drop-shadow-sm">
          {categoryEmoji(place.category)}
        </span>
        <div className="absolute right-3 top-3">
          <CategoryBadge category={place.category} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-bold text-card-foreground">{place.name}</h3>
          {place.region && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              📍 {place.region}
            </p>
          )}
        </div>

        {place.memo && (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {place.memo}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <a
            href={mapLinks.google}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted"
          >
            Google Maps
          </a>
          <a
            href={mapLinks.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted"
          >
            Naver Map
          </a>
          <a
            href={mapLinks.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted"
          >
            Kakao Map
          </a>
          {hasOriginalLink && (
            <a
              href={place.originalInput}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground transition hover:opacity-80"
            >
              {t.card.originalLink}
            </a>
          )}
        </div>

        {hasActions && (
          <div className="mt-auto flex items-center justify-end gap-3 border-t border-border pt-3 text-xs">
            {onDelete && (
              <>
                <Link
                  href={`/places/${place.id}/edit`}
                  className="font-semibold text-muted-foreground transition hover:text-primary"
                >
                  {t.card.edit}
                </Link>
                <button
                  onClick={() => onDelete(place.id)}
                  className="font-semibold text-muted-foreground transition hover:text-primary"
                >
                  {t.card.delete}
                </button>
              </>
            )}
            {onRemoveFromList && (
              <button
                onClick={() => onRemoveFromList(place.id)}
                className="font-semibold text-muted-foreground transition hover:text-primary"
              >
                {t.listDetail.remove}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
