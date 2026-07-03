"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { isUrl } from "@/lib/mapLinks";
import { Category, NewPlaceInput, Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface PlaceFormProps {
  initial?: Place;
  submitLabel: string;
  onSubmit: (input: NewPlaceInput) => void;
}

const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-soft";

export default function PlaceForm({
  initial,
  submitLabel,
  onSubmit,
}: PlaceFormProps) {
  const { t } = useI18n();
  const [originalInput, setOriginalInput] = useState(
    initial?.originalInput ?? ""
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [category, setCategory] = useState<Category>(
    initial?.category ?? "other"
  );
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [nameTouched, setNameTouched] = useState(Boolean(initial));

  function handleOriginalInputChange(value: string) {
    setOriginalInput(value);
    // 이름을 아직 직접 수정하지 않았고, 붙여넣은 게 링크가 아니면
    // 붙여넣은 텍스트를 장소 이름 초안으로 자동 채워준다.
    if (!nameTouched && !isUrl(value)) {
      setName(value);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!originalInput.trim()) return;
    onSubmit({
      originalInput: originalInput.trim(),
      name: name.trim() || originalInput.trim(),
      region: region.trim(),
      category,
      memo: memo.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.form.pasteLabel}
        </label>
        <textarea
          required
          rows={2}
          value={originalInput}
          onChange={(e) => handleOriginalInputChange(e.target.value)}
          placeholder={t.form.pastePlaceholder}
          className={`resize-none ${inputClass}`}
        />
        <p className="mt-1 text-xs text-muted-foreground">{t.form.pasteHint}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.form.nameLabel}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameTouched(true);
          }}
          placeholder={t.form.namePlaceholder}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">
            {t.form.regionLabel}
          </label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder={t.form.regionPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">
            {t.form.categoryLabel}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {t.categories[c.value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.form.memoLabel}
        </label>
        <textarea
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder={t.form.memoPlaceholder}
          className={`resize-none ${inputClass}`}
        />
      </div>

      <button
        type="submit"
        className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        {submitLabel}
      </button>
    </form>
  );
}
