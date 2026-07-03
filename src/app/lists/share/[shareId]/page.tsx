"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import { listTagEmoji } from "@/lib/constants";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * 공유 링크로 열리는 보기 전용 페이지.
 *
 * MVP에서는 localStorage에서 shareId로 조회하므로 "같은 기기"에서만 동작한다.
 * Supabase 전환 시 이 컴포넌트의 데이터 로딩 부분만
 * `select * from place_lists where share_id = ...` 공개 쿼리로 교체하면
 * 실제 공유 기능이 된다 (UI는 그대로).
 */
export default function SharedListPage() {
  const { t } = useI18n();
  const params = useParams<{ shareId: string }>();
  const [list, setList] = useState<PlaceList | null | undefined>(undefined);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const found = listsRepo.getByShareId(params.shareId) ?? null;
    setList(found);
    if (found) {
      const all = placesRepo.list();
      setPlaces(
        found.placeIds
          .map((id) => all.find((p) => p.id === id))
          .filter((p): p is Place => Boolean(p))
      );
    }
  }, [params.shareId]);

  if (list === undefined) return null;

  if (list === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.listDetail.notFound}</p>
        <Link
          href="/"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          HotPlace →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          👀 {t.listDetail.sharedBadge}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold text-card-foreground">
          {list.title}
        </h1>
        {list.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {list.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary-soft-foreground">
            {t.lists.placeCount(list.placeIds.length)}
          </span>
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
        <p className="mt-3 text-xs text-muted-foreground">
          {t.listDetail.sharedHint}
        </p>
      </div>

      {places.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">📍</div>
          <p className="text-muted-foreground">{t.listDetail.empty}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
