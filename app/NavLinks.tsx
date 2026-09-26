"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Shop" },
  { href: "/sell", label: "Sell" },
  { href: "/my-items", label: "My items" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:shrink-0 sm:flex-nowrap">
      {LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`whitespace-nowrap hover:text-brand hover:underline ${
              isActive ? "text-brand underline" : ""
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
