import type { Metadata, Viewport } from "next";
import { Inter, Manrope, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Lang } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Source Han Sans — loaded for CJK glyphs across sans / display / mono.
// `preload: false` because CJK font files are large; `display: "swap"` shows
// fallback text first.
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Orkest UI",
  description:
    "Elegant, minimal, modern component library for Next.js — shadcn/ui style, copy-paste components.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Reads the user's last-selected language from the cookie as the SSR
 * first-paint value, so `<html lang>` and initial render content match
 * the user's preference with no flash.
 */
async function getInitialLang(): Promise<Lang> {
  const store = await cookies();
  const v = store.get("orkest-lang")?.value;
  return v === "en" || v === "zh" ? v : "zh";
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialLang = await getInitialLang();

  return (
    <html lang={initialLang === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} ${notoSansSC.variable} antialiased`}
        style={{
          fontFamily: "var(--font-sans)",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLang={initialLang}>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
