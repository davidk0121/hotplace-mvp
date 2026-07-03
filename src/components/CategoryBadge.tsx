"use client";

import { Category } from "@/lib/types";
import { categoryEmoji } from "@/lib/constants";
import { useI18n } from "@/i18n/I18nProvider";

export default function CategoryBadge({ category }: { category: Category }) {
  const { t } = useI18n();

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-soft-foreground">
      <span>{categoryEmoji(category)}</span>
      <span>{t.categories[category]}</span>
    </span>
  );
}
