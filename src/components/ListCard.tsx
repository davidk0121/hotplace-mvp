"use client";

import Link from "next/link";
import { categoryColor, listTagEmoji } from "@/lib/constants";
import { Category, Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface ListCardProps {
  list: PlaceList;
  /** 미니 핀 미리보기용 — 전체 저장 장소 (있으면 컬렉션 안 장소의 카테고리 점을 보여줌) */
  places?: Place[];
}

export default function ListCard({ list, places }: ListCardProps) {
  const { t } = useI18n();

  // 컬렉션에 담긴 장소들의 카테고리 → 미니 핀 색상
  const cats: Category[] = places
    ? list.placeIds
        .map((id) => places.find((p) => p.id === id)?.category)
        .filter((c): c is Category => Boolean(c))
    : [];
  const previewCats = cats.slice(0, 6);
  const extra = list.placeIds.length - previewCats.length;

  return (
    <Link
      href={`/lists/${list.id}`}
      className="group flex h-full flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-card-foreground">{list.title}</h3>
        <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-soft-foreground">
          {t.lists.placeCount(list.placeIds.length)}
        </span>
      </div>

      {list.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {list.description}
        </p>
      )}

      {/* 미니 핀 미리보기 (지도 컬렉션 느낌) */}
      {previewCats.length > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {previewCats.map((c, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full border-2 border-card"
                style={{ background: categoryColor(c) }}
              />
            ))}
          </div>
          {extra > 0 && (
            <span className="text-xs text-muted-foreground">+{extra}</span>
          )}
        </div>
      )}

      {list.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5">
          {list.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              <span>{listTagEmoji(tag)}</span>
              <span>{t.listTags[tag]}</span>
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
