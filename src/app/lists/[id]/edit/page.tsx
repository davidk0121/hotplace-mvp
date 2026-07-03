"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import ListForm from "@/components/ListForm";
import { listsRepo } from "@/lib/storage";
import { NewPlaceListInput, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function EditListPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [list, setList] = useState<PlaceList | null | undefined>(undefined);

  useEffect(() => {
    setList(listsRepo.get(params.id) ?? null);
  }, [params.id]);

  function handleSubmit(input: NewPlaceListInput) {
    listsRepo.update(params.id, input);
    router.push(`/lists/${params.id}`);
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

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href={`/lists/${list.id}`}
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {t.listDetail.back}
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">{t.listForm.editTitle}</h1>
      <div className="mt-6">
        <ListForm
          initial={list}
          submitLabel={t.listForm.save}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
