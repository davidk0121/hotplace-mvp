"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useI18n } from "@/i18n/I18nProvider";

export default function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const links = [
    { href: "/places", label: t.nav.myPlaces },
    { href: "/lists", label: t.nav.myLists },
    { href: "/plan", label: t.nav.plan },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-extrabold">
          <span className="text-primary">🧭</span>
          <span>HotPlace</span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {/* 데스크톱에서만 텍스트 링크 노출 (모바일은 하단 네비 사용) */}
          <div className="mr-2 hidden items-center gap-4 text-sm font-semibold text-muted-foreground sm:flex">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "text-primary" : "hover:text-foreground"}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
