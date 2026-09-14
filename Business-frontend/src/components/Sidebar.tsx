"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[60px] md:w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--surface-1)] px-2 md:px-4 py-5 flex flex-col gap-1 h-screen sticky top-0 overflow-y-auto transition-all duration-300">
      <div className="flex items-center justify-center md:justify-start gap-2 px-2 mb-6">
        <div className="w-6 h-6 rounded-md bg-[var(--accent)] shrink-0" />
        <span className="text-sm font-medium hidden md:block">Opsly</span>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center md:justify-start gap-2.5 px-2.5 py-2 rounded-[var(--radius)] text-sm transition-colors ${
                active
                  ? "bg-[var(--surface-2)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Icon size={16} strokeWidth={1.75} className="shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-[var(--border)]">
        <button
          onClick={async () => {
            try {
              const { api } = await import("@/lib/api");
              await api.post("/auth/logout", {});
            } catch (e) {
              // Ignore errors if token is already invalid
            } finally {
              localStorage.removeItem("opsly_token");
              window.location.href = "/login";
            }
          }}
          className="flex items-center justify-center md:justify-start w-full gap-2.5 px-2.5 py-2 rounded-[var(--radius)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors text-left"
        >
          <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
}
