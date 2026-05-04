"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { controlNavLinkClassName } from "@/components/control-center/control-nav-link-classes";
import { CONTROL_NAV_LINKS } from "@/lib/navigation/control-nav-links";

export function ControlSidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="제어 메뉴" className="flex flex-col gap-1 px-1 pb-4">
      {CONTROL_NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={controlNavLinkClassName(active, "sidebar")}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
