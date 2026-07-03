"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ListForm from "@/components/ListForm";
import { listsRepo } from "@/lib/storage";
import { NewPlaceListInput } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function NewListPage() {
  const { t } = useI18n();
  const router = useRouter();

  function handleSubmit(input: NewPlaceListInput) {
    const list = listsRepo.create(input);
    // 만들자마자 장소를 채울 수 있게 상세 페이지로 이동
    router.push(`/lists/${list.id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/lists"
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {t.listDetail.back}
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">{t.listForm.createTitle}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t.listForm.createSubtitle}
      </p>
      <div className="mt-6">
        <ListForm submitLabel={t.listForm.create} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
