import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import NavLinks from "./NavLinks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Larries Secondhand Clothing",
  description: "Buy and sell secondhand school uniform items.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <header className="border-b-4 border-brand bg-white shadow-[0_4px_0_-2px_var(--brand-accent)]">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 sm:shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/la-rochelle-logo.png"
                alt="La Rochelle Girls' High School"
                className="h-9 w-auto sm:h-10 md:h-12"
              />
              <span className="text-lg font-bold text-brand sm:whitespace-nowrap sm:text-2xl md:text-3xl">
                Larries Second-hand Clothing Store
              </span>
            </Link>
            <NavLinks />
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
