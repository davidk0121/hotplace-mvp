"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import PlaceForm from "@/components/PlaceForm";
import { placesRepo } from "@/lib/storage";
import { NewPlaceInput } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function NewPlacePage() {
  const { t } = useI18n();
  const router = useRouter();

  function handleSubmit(input: NewPlaceInput) {
    placesRepo.create(input);
    router.push("/places");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/places"
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {t.newPlace.back}
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">{t.newPlace.title}</h1>
      <div className="mt-6">
        <PlaceForm submitLabel={t.newPlace.submit} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
