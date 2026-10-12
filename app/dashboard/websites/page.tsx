'use client';

import { useMemo, useState } from 'react';
import { Archive, CirclePause, Globe, LayoutGrid, List, Plus, Radio, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebsitesTable } from '@/components/tables/WebsitesTable';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';
import { PublicAccessDialog } from '@/components/dialogs/PublicAccessDialog';
import { WebsiteCard } from '@/components/websites/WebsiteCard';
import { useDeleteWebsite, useWebsites } from '@/hooks/useWebsites';
import { WebsiteResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

export default function WebsitesPage() {
  const { data: websites, isLoading } = useWebsites();
  const deleteMutation = useDeleteWebsite();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<WebsiteResponse | null>(null);
  const [viewingApi, setViewingApi] = useState<WebsiteResponse | null>(null);

  const counts = useMemo(() => {
    const all = websites ?? [];
    return {
      total: all.length,
      active: all.filter((w) => w.status === 'active').length,
      inactive: all.filter((w) => w.status === 'inactive').length,
      archived: all.filter((w) => w.status === 'archived').length,
    };
  }, [websites]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (websites ?? []).filter(
      (w) =>
        (status === 'all' || w.status === status) &&
        (!q || w.name.toLowerCase().includes(q) || w.url.toLowerCase().includes(q))
    );
  }, [websites, status, search]);

  const handleDelete = (website: WebsiteResponse) => {
    if (window.confirm(`Delete "${website.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(website.id);
    }
  };

  const stats = [
    { label: 'Active', value: counts.active, icon: Radio, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Inactive', value: counts.inactive, icon: CirclePause, tone: 'text-zinc-600 bg-zinc-100' },
    { label: 'Archived', value: counts.archived, icon: Archive, tone: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 animate-in fade-in duration-500 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Workspace</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight text-foreground md:text-3xl">Your websites</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage content, services and teams for every website from one place.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="h-10 rounded-xl px-5 shadow-lg shadow-brand/25">
          <Plus className="h-4 w-4" />
          Add website
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl bg-ink p-5 text-white">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/30 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs text-zinc-400">Total websites</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <p className="relative mt-4 text-3xl font-medium tabular-nums">{isLoading ? '–' : counts.total}</p>
        </div>
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', stat.tone)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-medium tabular-nums text-foreground">{isLoading ? '–' : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatus(filter.value)}
              className={cn(
                'flex h-8 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-xs font-medium transition-colors',
                status === filter.value ? 'bg-ink text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {filter.label}
              <span
                className={cn(
                  'rounded-md px-1.5 text-[10px] tabular-nums',
                  status === filter.value ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {filter.value === 'all' ? counts.total : counts[filter.value as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72 md:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search websites..."
              className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
          <div className="flex rounded-xl border border-border bg-white p-1">
            {(['grid', 'list'] as const).map((mode) => {
              const Icon = mode === 'grid' ? LayoutGrid : List;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  aria-label={`${mode} view`}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                    view === mode ? 'bg-brand-50 text-brand' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <WebsitesTable status={status === 'all' ? '' : status} search={search} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              onEdit={setEditing}
              onApi={setViewingApi}
              onDelete={handleDelete}
            />
          ))}

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="group flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-white/50 p-6 text-center transition-colors hover:border-brand/50 hover:bg-brand-50/40"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand transition-transform group-hover:scale-110">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Add a website</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Connect a new platform to Nextiaa</p>
            </div>
          </button>
        </div>
      )}

      <WebsiteDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <WebsiteDialog isOpen={!!editing} onClose={() => setEditing(null)} initialData={editing ?? undefined} />
      <PublicAccessDialog isOpen={!!viewingApi} onClose={() => setViewingApi(null)} website={viewingApi ?? undefined} />
    </div>
  );
}
