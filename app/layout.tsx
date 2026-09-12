import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/la-rochelle-logo.png"
                alt="La Rochelle Girls' High School"
                className="h-12 w-auto"
              />
              <span className="whitespace-nowrap text-3xl font-bold text-brand">
                Larries Second-hand Clothing Store
              </span>
            </Link>
            <div className="flex shrink-0 gap-4 text-sm">
              <Link href="/" className="whitespace-nowrap hover:text-brand hover:underline">
                Browse Items for Sale
              </Link>
              <Link href="/sell" className="whitespace-nowrap hover:text-brand hover:underline">
                Sell an item
              </Link>
              <Link href="/my-items" className="whitespace-nowrap hover:text-brand hover:underline">
                My items
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
