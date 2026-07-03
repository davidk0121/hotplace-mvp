"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ListCard from "@/components/ListCard";
import { listsRepo, placesRepo } from "@/lib/storage";
import { Place, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function ListsPage() {
  const { t } = useI18n();
  const [lists, setLists] = useState<PlaceList[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLists(listsRepo.list());
    setPlaces(placesRepo.list());
    setLoaded(true);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{t.lists.title}</h1>
          <p className="text-sm text-muted-foreground">{t.lists.subtitle}</p>
        </div>
        <Link
          href="/lists/new"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          {t.lists.create}
        </Link>
      </div>

      {loaded && lists.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">🗂️</div>
          <p className="max-w-sm text-muted-foreground">{t.lists.empty}</p>
          <Link
            href="/lists/new"
            className="mt-1 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            {t.lists.createFirst}
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <ListCard key={list.id} list={list} places={places} />
        ))}
      </div>
    </div>
  );
}
