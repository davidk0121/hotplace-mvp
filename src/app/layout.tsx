import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import DevGlobals from "@/components/DevGlobals";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HotPlace — Save Korea hot spots & plan trips together",
  description:
    "Save the Korea hot places you find on Instagram and TikTok, organize them by category, and share lists with friends and partners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${onest.className} min-h-full flex flex-col bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>
            <Navbar />
            {/* 모바일 하단 네비 높이만큼 여백 확보 */}
            <main className="flex-1 pb-20 sm:pb-0">
              {children}
              <Footer />
            </main>
            <BottomNav />
            <DevGlobals />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
