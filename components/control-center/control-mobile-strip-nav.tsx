"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { controlNavLinkClassName } from "@/components/control-center/control-nav-link-classes";
import { CONTROL_NAV_LINKS } from "@/lib/navigation/control-nav-links";

/**
 * 모바일 전용: PC 사이드바와 동일한 목적지를 항상 노출(가로 스크롤).
 * 햄버거 드로어만 있을 때 링크가 가려지거나 터치가 불안정한 경우를 피합니다.
 */
export function ControlMobileStripNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="제어 메뉴"
      className="flex gap-1.5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {CONTROL_NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            prefetch
            className={controlNavLinkClassName(active, "strip")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
