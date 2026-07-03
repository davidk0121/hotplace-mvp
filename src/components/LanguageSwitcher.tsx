"use client";

import { locales, localeNames, isLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <label className="flex items-center gap-1 text-sm text-neutral-600">
      <span aria-hidden>🌐</span>
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => {
          if (isLocale(e.target.value)) setLocale(e.target.value);
        }}
        className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-medium outline-none focus:border-brand-500"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
