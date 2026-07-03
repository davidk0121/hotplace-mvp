"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import PlaceForm from "@/components/PlaceForm";
import { placesRepo } from "@/lib/storage";
import { NewPlaceInput, Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

export default function EditPlacePage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null | undefined>(undefined);

  useEffect(() => {
    setPlace(placesRepo.get(params.id) ?? null);
  }, [params.id]);

  function handleSubmit(input: NewPlaceInput) {
    placesRepo.update(params.id, input);
    router.push("/places");
  }

  if (place === undefined) return null;

  if (place === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.editPlace.notFound}</p>
        <Link
          href="/places"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t.editPlace.backToList}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/places"
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {t.editPlace.back}
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">{t.editPlace.title}</h1>
      <div className="mt-6">
        <PlaceForm
          initial={place}
          submitLabel={t.editPlace.submit}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
