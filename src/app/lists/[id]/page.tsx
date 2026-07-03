"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AddPlacesSheet from "@/components/AddPlacesSheet";
import PlaceCard from "@/components/PlaceCard";
import { listTagEmoji } from "@/lib/constants";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function ListDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [list, setList] = useState<PlaceList | null | undefined>(undefined);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => {
    setList(listsRepo.get(params.id) ?? null);
    setAllPlaces(placesRepo.list());
  }, [params.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleToggle(placeId: string) {
    if (!list) return;
    if (list.placeIds.includes(placeId)) {
      listsRepo.removePlace(list.id, placeId);
    } else {
      listsRepo.addPlace(list.id, placeId);
    }
    refresh();
  }

  function handleRemoveFromList(placeId: string) {
    if (!list) return;
    listsRepo.removePlace(list.id, placeId);
    refresh();
  }

  function handleDeleteList() {
    if (!list) return;
    if (!confirm(t.lists.deleteConfirm)) return;
    listsRepo.remove(list.id);
    router.push("/lists");
  }

  async function handleShare() {
    if (!list) return;
    // MVP: 이 기기에서만 열리는 mock 공유 링크.
    // Supabase 전환 시 share_id로 공개 조회하는 실제 공유 링크가 된다.
    const url = `${window.location.origin}/lists/share/${list.shareId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard API를 못 쓰는 환경 fallback
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (list === undefined) return null;

  if (list === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.listDetail.notFound}</p>
        <Link
          href="/lists"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t.listDetail.backToLists}
        </Link>
      </div>
    );
  }

  const placesInList = list.placeIds
    .map((id) => allPlaces.find((p) => p.id === id))
    .filter((p): p is Place => Boolean(p));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/lists"
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {t.listDetail.back}
      </Link>

      {/* 리스트 헤더 */}
      <div className="mt-3 rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-card-foreground">
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
          </div>
          <div className="flex shrink-0 gap-3 text-xs">
            <Link
              href={`/lists/${list.id}/edit`}
              className="font-semibold text-muted-foreground transition hover:text-primary"
            >
              {t.listDetail.edit}
            </Link>
            <button
              onClick={handleDeleteList}
              className="font-semibold text-muted-foreground transition hover:text-primary"
            >
              {t.listDetail.delete}
            </button>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setSheetOpen(true)}
            className="flex-1 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            {t.listDetail.addPlaces}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {copied ? t.listDetail.copied : t.listDetail.share}
          </button>
          <Link
            href={`/plan?list=${list.id}`}
            className="flex-1 rounded-2xl bg-primary-soft px-4 py-2.5 text-center text-sm font-semibold text-primary-soft-foreground transition hover:opacity-80"
          >
            {t.listDetail.aiPlan}
          </Link>
        </div>
        {copied && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t.listDetail.shareHint}
          </p>
        )}
      </div>

      {/* 장소 카드 */}
      {placesInList.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">📍</div>
          <p className="max-w-sm text-muted-foreground">{t.listDetail.empty}</p>
          <button
            onClick={() => setSheetOpen(true)}
            className="mt-1 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            {t.listDetail.addPlaces}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placesInList.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onRemoveFromList={handleRemoveFromList}
            />
          ))}
        </div>
      )}

      <AddPlacesSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        places={allPlaces}
        selectedIds={list.placeIds}
        onToggle={handleToggle}
      />
    </div>
  );
}
