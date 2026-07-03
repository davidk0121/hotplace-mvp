"use client";

import Link from "next/link";
import { PlaceList } from "@/lib/types";
import { listTagEmoji } from "@/lib/constants";
import { useI18n } from "@/i18n/I18nProvider";

export default function ListCard({ list }: { list: PlaceList }) {
  const { t } = useI18n();

  return (
    <Link
      href={`/lists/${list.id}`}
      className="group flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary"
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

      {list.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
