"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

// Figma의 하단 탭 바를 참고 — 활성 탭은 아이콘 뒤 coral pill로 강조.
// 모바일(sm 미만)에서만 표시된다.
export default function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: "🧭", label: t.nav.home },
    { href: "/places", icon: "📍", label: t.nav.myPlaces },
    { href: "/lists", icon: "🗂️", label: t.nav.myLists },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 pb-6 pt-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full text-lg transition ${
                  active ? "bg-primary-soft" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
