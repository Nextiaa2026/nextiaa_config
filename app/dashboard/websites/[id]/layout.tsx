'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ArrowUpRight, Code2, Globe, Loader2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebsite } from '@/hooks/useWebsites';
import { SiteAvatar } from '@/components/websites/SiteAvatar';
import { StatusBadge } from '@/components/websites/StatusBadge';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';
import { PublicAccessDialog } from '@/components/dialogs/PublicAccessDialog';
import { cn, getHostname } from '@/lib/utils';

const pages = [
  { segment: '', label: 'Overview', description: 'A snapshot of everything configured on this website.' },
  { segment: 'sections', label: 'Sections', description: 'Content blocks that make up the pages of this website.' },
  { segment: 'services', label: 'Services', description: 'Offerings showcased to visitors on this website.' },
  { segment: 'team', label: 'Team', description: 'People presented on the team page of this website.' },
];

export default function WebsiteManagementLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const websiteId = params.id as string;
  const { data: website, isLoading } = useWebsite(websiteId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);

  const base = `/dashboard/websites/${websiteId}`;
  const segment = pathname.slice(base.length).split('/').filter(Boolean)[0] ?? '';
  const current = pages.find((page) => page.segment === segment) ?? pages[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-sm text-muted-foreground">Loading website workspace...</p>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-medium">Website not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">It may have been removed or you no longer have access.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/dashboard/websites">Back to all websites</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="relative overflow-hidden border-b border-border bg-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <SiteAvatar name={website.name} className="h-14 w-14 rounded-2xl text-lg shadow-sm" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-medium tracking-tight md:text-2xl">{website.name}</h1>
                <StatusBadge status={website.status} />
              </div>
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                {getHostname(website.url)}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 rounded-xl" onClick={() => setIsApiOpen(true)}>
              <Code2 className="h-4 w-4" />
              API
            </Button>
            <Button variant="outline" className="h-9 rounded-xl" onClick={() => setIsEditOpen(true)}>
              <Settings2 className="h-4 w-4" />
              Settings
            </Button>
            <Button asChild className="h-9 rounded-xl shadow-md shadow-brand/20">
              <a href={website.url} target="_blank" rel="noopener noreferrer">
                Visit
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <nav className="no-scrollbar relative mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 lg:hidden">
          {pages.map((page) => {
            const isActive = page.segment === current.segment;
            return (
              <Link
                key={page.segment}
                href={page.segment ? `${base}/${page.segment}` : base}
                className={cn(
                  'relative whitespace-nowrap px-3 py-3 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {page.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {current.segment && (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <h2 className="text-lg font-medium tracking-tight">{current.label}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{current.description}</p>
        </div>
      )}

      {children}

      <WebsiteDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialData={website} />
      <PublicAccessDialog isOpen={isApiOpen} onClose={() => setIsApiOpen(false)} website={website} />
    </div>
  );
}
