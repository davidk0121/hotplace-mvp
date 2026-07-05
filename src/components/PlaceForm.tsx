"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { isUrl } from "@/lib/mapLinks";
import { GeoCandidate, geocodePlaces, hasMapKey } from "@/lib/maptiler";
import { Category, NewPlaceInput, Place } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";

interface PlaceFormProps {
  /** 수정 모드: 기존 장소 */
  initial?: Place;
  /** 빠른 저장: 붙여넣은 원본 텍스트로 초안 채우기 */
  draftInput?: string;
  submitLabel: string;
  onSubmit: (input: NewPlaceInput) => void;
  onCancel?: () => void;
}

const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-soft";

function seedFrom(initial?: Place, draftInput?: string) {
  if (initial) {
    return {
      name: initial.name,
      region: initial.region,
      category: initial.category as Category | null,
      memo: initial.memo,
      source: initial.originalInput,
      coords:
        typeof initial.lat === "number" && typeof initial.lng === "number"
          ? { lat: initial.lat, lng: initial.lng }
          : null,
    };
  }
  const draft = (draftInput ?? "").trim();
  if (draft && isUrl(draft)) {
    // 붙여넣은 게 링크면 → source에 넣고 이름은 사용자가 입력
    return { name: "", region: "", category: null, memo: "", source: draft, coords: null };
  }
  // 링크가 아니면 → 이름 초안으로
  return { name: draft, region: "", category: null, memo: "", source: "", coords: null };
}

export default function PlaceForm({
  initial,
  draftInput,
  submitLabel,
  onSubmit,
  onCancel,
}: PlaceFormProps) {
  const { t } = useI18n();
  const seed = seedFrom(initial, draftInput);

  const [name, setName] = useState(seed.name);
  const [category, setCategory] = useState<Category | null>(seed.category);
  const [region, setRegion] = useState(seed.region);
  const [source, setSource] = useState(seed.source);
  const [memo, setMemo] = useState(seed.memo);
  const [error, setError] = useState(false);
  // 추가 정보(지역/링크/메모)는 값이 있으면 펼친 채로 시작
  const [showMore, setShowMore] = useState(
    Boolean(seed.region || seed.memo || (seed.source && isUrl(seed.source)))
  );

  // 위치(지오코딩) — MapTiler 키가 있을 때만 노출
  const geoEnabled = hasMapKey();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    seed.coords
  );
  const [coordLabel, setCoordLabel] = useState<string>(
    seed.coords ? initial?.name ?? "" : ""
  );
  const [candidates, setCandidates] = useState<GeoCandidate[] | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleFindLocation() {
    const q = name.trim() || source.trim();
    if (!q) {
      setError(true);
      return;
    }
    setSearching(true);
    setCandidates(null);
    const results = await geocodePlaces(q);
    setCandidates(results);
    setSearching(false);
  }

  function pickCandidate(c: GeoCandidate) {
    setCoords({ lat: c.lat, lng: c.lng });
    setCoordLabel(c.label);
    setCandidates(null);
  }

  function clearLocation() {
    setCoords(null);
    setCoordLabel("");
    setCandidates(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(true);
      return;
    }
    onSubmit({
      name: trimmedName,
      region: region.trim(),
      category: category ?? "other",
      memo: memo.trim(),
      // 원본 링크가 있으면 그걸, 없으면 이름을 원본값으로 저장
      originalInput: source.trim() || trimmedName,
      ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* 필수: 장소 이름 */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">
          {t.form.nameLabel}
        </label>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(false);
          }}
          placeholder={t.form.namePlaceholder}
          className={inputClass}
        />
        {error && (
          <p className="mt-1 text-xs text-primary">{t.form.nameRequired}</p>
        )}
      </div>

      {/* 카테고리 chip 선택 */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">
          {t.form.categoryLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const selected = category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(selected ? null : c.value)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {c.emoji} {t.categories[c.value]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 위치 (지오코딩) — 키 있을 때만 */}
      {geoEnabled && (
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">
            {t.form.locationLabel}
          </label>
          {coords ? (
            <div className="flex items-center gap-2 rounded-2xl bg-primary-soft px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary-soft-foreground">
                {t.form.locationSet}
                {coordLabel ? ` · ${coordLabel}` : ""}
              </span>
              <button
                type="button"
                onClick={clearLocation}
                className="tap shrink-0 text-xs font-semibold text-primary-soft-foreground underline"
              >
                {t.form.changeLocation}
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleFindLocation}
                disabled={searching}
                className="tap w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
              >
                {searching ? t.form.searching : t.form.findLocation}
              </button>
              {candidates !== null && candidates.length === 0 && !searching && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.form.noResults}
                </p>
              )}
              {candidates && candidates.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {candidates.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => pickCandidate(c)}
                        className="tap flex w-full items-center gap-2 rounded-2xl border border-border bg-card p-3 text-left transition hover:bg-muted"
                      >
                        <span className="text-base">📍</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-card-foreground">
                            {c.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.label}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {t.form.locationHint}
              </p>
            </>
          )}
        </div>
      )}

      {/* 선택 정보: 접기/펼치기 */}
      {!showMore ? (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="self-start text-sm font-semibold text-primary"
        >
          {t.form.moreDetails}
        </button>
      ) : (
        <div className="flex flex-col gap-5">
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
              {t.form.sourceLabel}
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={t.form.sourcePlaceholder}
              className={inputClass}
            />
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
            type="button"
            onClick={() => setShowMore(false)}
            className="self-start text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            {t.form.lessDetails}
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
          >
            {t.listForm.cancel}
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
