"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIST_TAGS } from "@/lib/constants";
import { ListTag, NewPlaceListInput, PlaceList } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface ListFormProps {
  initial?: PlaceList;
  submitLabel: string;
  onSubmit: (input: NewPlaceListInput) => void;
}

const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-soft";

export default function ListForm({
  initial,
  submitLabel,
  onSubmit,
}: ListFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState<ListTag[]>(initial?.tags ?? []);

  function toggleTag(tag: ListTag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      tags,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.listForm.nameLabel}
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.listForm.namePlaceholder}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.listForm.descLabel}
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.listForm.descPlaceholder}
          className={`resize-none ${inputClass}`}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.listForm.tagsLabel}
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          {t.listForm.tagsHint}
        </p>
        <div className="flex flex-wrap gap-2">
          {LIST_TAGS.map((tag) => {
            const selected = tags.includes(tag.value);
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {tag.emoji} {t.listTags[tag.value]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
        >
          {t.listForm.cancel}
        </button>
        <button
          type="submit"
          className="flex-1 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
