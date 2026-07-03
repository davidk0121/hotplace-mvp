"use client";

import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { useI18n } from "@/i18n/I18nProvider";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* ambient coral glow (Figma 참고) */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            opacity: 0.14,
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
            {t.landing.badge}
          </span>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {t.landing.heroLine1}
            <br />
            {t.landing.heroLine2}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            {t.landing.heroDesc}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/places"
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              {t.landing.tryDemo}
            </Link>
            <a
              href="#waitlist"
              className="rounded-2xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {t.landing.notifyMe}
            </a>
          </div>
        </div>
      </section>

      {/* 타겟 유저 설명 */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-xl font-bold sm:text-2xl">
          {t.landing.targetsTitle}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {t.landing.targets.map((target) => (
            <div
              key={target.title}
              className="rounded-3xl border border-border bg-card p-6 text-center shadow-card"
            >
              <div className="text-3xl">{target.emoji}</div>
              <h3 className="mt-2 font-bold text-card-foreground">
                {target.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {target.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            {t.landing.featuresTitle}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {t.landing.features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-card"
              >
                <div className="text-2xl">{feature.emoji}</div>
                <div>
                  <h3 className="font-bold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center"
      >
        <h2 className="text-xl font-bold sm:text-2xl">
          {t.landing.waitlistTitle}
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {t.landing.waitlistDesc}
        </p>
        <WaitlistForm />
      </section>
    </div>
  );
}
