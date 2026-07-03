"use client";

import { FormEvent, useState } from "react";
import { waitlistRepo } from "@/lib/storage";
import { useI18n } from "@/i18n/I18nProvider";

type Status = "idle" | "success" | "duplicate" | "error";

export default function WaitlistForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setStatus("error");
      return;
    }
    const { alreadyExists } = waitlistRepo.add(trimmed);
    setSubmittedEmail(trimmed);
    setStatus(alreadyExists ? "duplicate" : "success");
    setEmail("");
  }

  // 등록 완료/중복이면 폼 대신 확인 카드를 보여줘 "진짜 접수됐다"는 느낌을 준다.
  if (status === "success" || status === "duplicate") {
    const title =
      status === "success"
        ? t.waitlist.successTitle
        : t.waitlist.duplicateTitle;
    const body =
      status === "success" ? t.waitlist.success : t.waitlist.duplicate;
    return (
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-2xl">
          ✓
        </div>
        <h3 className="mt-3 font-bold text-card-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          <span>{t.waitlist.emailedTo}</span>
          <span className="font-semibold text-foreground">
            {submittedEmail}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.waitlist.placeholder}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-soft"
        />
        <button
          type="submit"
          className="shrink-0 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          {t.waitlist.submit}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-primary">{t.waitlist.invalid}</p>
      )}
    </div>
  );
}
