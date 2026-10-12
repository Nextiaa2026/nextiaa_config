'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { getActiveSiteId } from '@/components/layout/Sidebar';
import { useWebsite } from '@/hooks/useWebsites';

const pageLabels: Record<string, string> = {
  sections: 'Sections',
  services: 'Services',
  team: 'Team',
  create: 'New website',
};

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Topbar({ onMenuClick, isSidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const siteId = getActiveSiteId(pathname);
  const { data: website } = useWebsite(siteId ?? '');

  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  const crumbs: { label: string; href?: string }[] = [{ label: 'Websites', href: '/dashboard/websites' }];
  if (siteId) {
    crumbs.push({ label: website?.name ?? '…', href: `/dashboard/websites/${siteId}` });
    crumbs.push({ label: pageLabels[lastSegment] ?? 'Overview' });
  } else if (pageLabels[lastSegment]) {
    crumbs.push({ label: pageLabels[lastSegment] });
  } else {
    crumbs.push({ label: 'Overview' });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/70 bg-white/80 px-4 backdrop-blur-xl md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onToggleSidebar}
        title={`${isSidebarCollapsed ? 'Expand' : 'Collapse'} sidebar (⌘B)`}
        className="hidden h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
      <Logo variant="icon" href="/dashboard/websites" className="h-6 lg:hidden" />

      <nav className="flex min-w-0 items-center gap-1.5 text-[13px]">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <div key={i} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300" />}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className={i === 0 ? 'hidden truncate text-muted-foreground transition-colors hover:text-foreground sm:block' : 'truncate text-muted-foreground transition-colors hover:text-foreground'}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate font-medium text-foreground">{crumb.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
