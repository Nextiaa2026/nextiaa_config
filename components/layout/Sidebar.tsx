'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useMemo, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  ArrowUpRight,
  Briefcase,
  ChevronLeft,
  ChevronsUpDown,
  Code2,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  LogOut,
  Plus,
  Search,
  Settings2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/layout/Logo';
import { SiteAvatar } from '@/components/websites/SiteAvatar';
import { StatusDot } from '@/components/websites/StatusBadge';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';
import { PublicAccessDialog } from '@/components/dialogs/PublicAccessDialog';
import { useWebsite, useWebsites } from '@/hooks/useWebsites';
import { useSections, useServices, useTeamMembers } from '@/hooks/useWebsiteManagement';
import { cn, getHostname } from '@/lib/utils';

export function getActiveSiteId(pathname: string) {
  const match = pathname.match(/^\/dashboard\/websites\/([^/]+)/);
  return match && match[1] !== 'create' ? match[1] : null;
}

const CollapsedContext = createContext(false);
const useCollapsed = () => useContext(CollapsedContext);

interface SidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
}

export function Sidebar({ onNavigate, collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const siteId = getActiveSiteId(pathname);

  return (
    <CollapsedContext.Provider value={collapsed}>
      <div className="flex h-full flex-col overflow-hidden bg-ink text-zinc-400">
        <div className={cn('flex h-16 shrink-0 items-center', collapsed ? 'justify-center' : 'px-5')}>
          {collapsed ? (
            <Logo variant="icon" href="/dashboard/websites" className="h-7" />
          ) : (
            <Logo variant="wordmark-light" href="/dashboard/websites" className="h-9" />
          )}
        </div>

        <div
          key={`${siteId ?? 'workspace'}-${collapsed}`}
          className={cn(
            'flex-1 overflow-y-auto pb-4 animate-in fade-in duration-300',
            collapsed ? 'no-scrollbar px-2.5' : 'sidebar-scroll px-3 slide-in-from-left-2'
          )}
        >
          {siteId ? (
            <SiteNav siteId={siteId} pathname={pathname} onNavigate={onNavigate} />
          ) : (
            <WorkspaceNav pathname={pathname} onNavigate={onNavigate} />
          )}
        </div>

        <UserCard />
      </div>
    </CollapsedContext.Provider>
  );
}

function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  if (useCollapsed()) {
    return <div className="mx-auto my-3 h-px w-6 bg-white/[0.08]" />;
  }
  return (
    <div className="flex items-center justify-between px-3 pb-2 pt-6">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">{children}</span>
      {action}
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  count?: number;
  onNavigate?: () => void;
}

function NavItem({ href, icon: Icon, label, active, count, onNavigate }: NavItemProps) {
  const collapsed = useCollapsed();
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex h-9 items-center rounded-lg text-[13px] font-medium transition-colors',
        collapsed ? 'h-10 justify-center' : 'gap-3 px-3',
        active ? 'bg-white/[0.07] text-white' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
      )}
    >
      {active && (
        <span
          className={cn(
            'absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand',
            collapsed ? '-left-2.5' : '-left-3'
          )}
        />
      )}
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-brand' : 'text-zinc-500 group-hover:text-zinc-300')} />
      {collapsed ? (
        !!count && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] tabular-nums text-white">
            {count}
          </span>
        )
      ) : (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count !== undefined && (
            <span
              className={cn(
                'min-w-6 rounded-md px-1.5 py-0.5 text-center text-[10px] tabular-nums',
                active ? 'bg-brand text-white' : 'bg-white/[0.06] text-zinc-400'
              )}
            >
              {count}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function ActionItem({ icon: Icon, label, onClick, href }: { icon: LucideIcon; label: string; onClick?: () => void; href?: string }) {
  const collapsed = useCollapsed();
  const className = cn(
    'group flex w-full items-center rounded-lg text-left text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-100',
    collapsed ? 'h-10 justify-center' : 'h-9 gap-3 px-3'
  );
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {href && <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-brand" />}
        </>
      )}
    </>
  );
  const title = collapsed ? label : undefined;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} title={title} className={className}>
      {content}
    </button>
  );
}

function WorkspaceNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const collapsed = useCollapsed();
  const { data: websites, isLoading } = useWebsites();
  const [query, setQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return websites ?? [];
    return (websites ?? []).filter(
      (site) => site.name.toLowerCase().includes(q) || site.url.toLowerCase().includes(q)
    );
  }, [websites, query]);

  return (
    <>
      <nav className="space-y-0.5 pt-2">
        <NavItem
          href="/dashboard/websites"
          icon={LayoutGrid}
          label="Overview"
          active={pathname === '/dashboard/websites'}
          onNavigate={onNavigate}
        />
      </nav>

      <SectionLabel
        action={
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex h-5 w-5 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-brand hover:text-white"
            aria-label="Add website"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        }
      >
        Websites {websites ? `· ${websites.length}` : ''}
      </SectionLabel>

      {collapsed ? (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            title="Add website"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-white/[0.12] text-zinc-500 transition-colors hover:border-brand hover:bg-brand hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.06]" />
            ))}
          {websites?.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/websites/${site.id}`}
              onClick={onNavigate}
              title={`${site.name} · ${getHostname(site.url)}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
            >
              <SiteAvatar name={site.name} className="h-8 w-8 rounded-lg text-[10px]" />
              <StatusDot status={site.status} className="absolute bottom-0.5 right-0.5 ring-2 ring-ink rounded-full" />
            </Link>
          ))}
        </div>
      ) : (
        <>
          <div className="relative mb-2 px-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a website..."
              className="h-8 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-8 pr-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors focus:border-brand/60 focus:bg-white/[0.05]"
            />
          </div>

          <div className="space-y-0.5">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex h-12 items-center gap-3 px-3">
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-white/[0.06]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-24 animate-pulse rounded bg-white/[0.06]" />
                    <div className="h-2 w-16 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                </div>
              ))}

            {filtered.map((site) => (
              <Link
                key={site.id}
                href={`/dashboard/websites/${site.id}`}
                onClick={onNavigate}
                className="group flex h-12 items-center gap-3 rounded-lg px-3 transition-colors hover:bg-white/[0.04]"
              >
                <SiteAvatar name={site.name} className="h-7 w-7 rounded-md text-[10px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-zinc-200 group-hover:text-white">{site.name}</p>
                  <p className="truncate text-[11px] text-zinc-500">{getHostname(site.url)}</p>
                </div>
                <StatusDot status={site.status} />
              </Link>
            ))}

            {!isLoading && filtered.length === 0 && (
              <div className="mx-1 mt-2 rounded-lg border border-dashed border-white/[0.08] px-4 py-6 text-center">
                <Globe className="mx-auto h-5 w-5 text-zinc-600" />
                <p className="mt-2 text-xs text-zinc-500">{query ? 'No matching websites' : 'No websites yet'}</p>
                {!query && (
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-3 text-xs font-medium text-brand hover:underline"
                  >
                    Add your first website
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <WebsiteDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}

function SiteNav({ siteId, pathname, onNavigate }: { siteId: string; pathname: string; onNavigate?: () => void }) {
  const collapsed = useCollapsed();
  const { data: website } = useWebsite(siteId);
  const { data: websites } = useWebsites();
  const { data: sections } = useSections(siteId);
  const { data: services } = useServices(siteId);
  const { data: team } = useTeamMembers(siteId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);

  const base = `/dashboard/websites/${siteId}`;
  const items = [
    { href: base, icon: LayoutDashboard, label: 'Overview', active: pathname === base },
    { href: `${base}/sections`, icon: Layers, label: 'Sections', count: sections?.length, active: pathname.startsWith(`${base}/sections`) },
    { href: `${base}/services`, icon: Briefcase, label: 'Services', count: services?.length, active: pathname.startsWith(`${base}/services`) },
    { href: `${base}/team`, icon: Users, label: 'Team', count: team?.length, active: pathname.startsWith(`${base}/team`) },
  ];

  return (
    <>
      <Link
        href="/dashboard/websites"
        onClick={onNavigate}
        title={collapsed ? 'All websites' : undefined}
        className={cn(
          'mt-1 flex items-center rounded-lg text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200',
          collapsed ? 'h-10 justify-center hover:bg-white/[0.04]' : 'h-8 w-fit gap-1.5 px-2'
        )}
      >
        <ChevronLeft className={collapsed ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        {!collapsed && 'All websites'}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title={collapsed ? website?.name : undefined}
            className={cn(
              'mt-2 flex w-full items-center text-left transition-colors',
              collapsed
                ? 'justify-center rounded-lg p-1 hover:bg-white/[0.06]'
                : 'gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 hover:border-white/[0.12] hover:bg-white/[0.05]'
            )}
          >
            {website ? (
              <SiteAvatar name={website.name} className="h-9 w-9" />
            ) : (
              <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.06]" />
            )}
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{website?.name ?? 'Loading...'}</p>
                  <div className="flex items-center gap-1.5">
                    {website && <StatusDot status={website.status} className="h-1.5 w-1.5 [&>span]:h-1.5 [&>span]:w-1.5" />}
                    <p className="truncate text-[11px] text-zinc-500">{getHostname(website?.url)}</p>
                  </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={collapsed ? 'right' : 'bottom'}
          align="start"
          sideOffset={collapsed ? 12 : 4}
          className="w-64 rounded-xl p-1.5"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Switch website
          </DropdownMenuLabel>
          <div className="max-h-72 overflow-y-auto">
            {websites?.map((site) => (
              <DropdownMenuItem key={site.id} asChild className="cursor-pointer rounded-lg p-2">
                <Link href={`/dashboard/websites/${site.id}`} onClick={onNavigate} className="flex items-center gap-2.5">
                  <SiteAvatar name={site.name} className="h-7 w-7 rounded-md text-[10px]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{site.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{getHostname(site.url)}</p>
                  </div>
                  {site.id === siteId && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2 text-xs">
            <Link href="/dashboard/websites" onClick={onNavigate}>
              <LayoutGrid className="mr-2 h-3.5 w-3.5" />
              View all websites
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SectionLabel>Manage</SectionLabel>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <SectionLabel>Configuration</SectionLabel>
      <div className="space-y-0.5">
        <ActionItem icon={Code2} label="API access" onClick={() => setIsApiOpen(true)} />
        <ActionItem icon={Settings2} label="Website settings" onClick={() => setIsEditOpen(true)} />
        {website?.url && <ActionItem icon={Globe} label="Visit website" href={website.url} />}
      </div>

      {website && (
        <>
          <WebsiteDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialData={website} />
          <PublicAccessDialog isOpen={isApiOpen} onClose={() => setIsApiOpen(false)} website={website} />
        </>
      )}
    </>
  );
}

function UserCard() {
  const collapsed = useCollapsed();
  const { data: session } = useSession();
  const name = session?.user?.name ?? 'Administrator';
  const email = session?.user?.email ?? '';

  return (
    <div className={cn('shrink-0 border-t border-white/[0.06]', collapsed ? 'p-2.5' : 'p-3')}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title={collapsed ? name : undefined}
            className={cn(
              'flex w-full items-center rounded-lg text-left transition-colors hover:bg-white/[0.04]',
              collapsed ? 'justify-center p-1' : 'gap-3 p-2'
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-700 text-xs font-medium text-white">
              {name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-200">{name}</p>
                  <p className="truncate text-[11px] text-zinc-500">{email || 'Administrator'}</p>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={collapsed ? 'right' : 'top'}
          align={collapsed ? 'end' : 'start'}
          sideOffset={collapsed ? 12 : 4}
          className="w-60 rounded-xl p-1.5"
        >
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="text-xs font-medium">{name}</p>
            <p className="truncate text-[11px] font-normal text-muted-foreground">{email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer rounded-lg p-2 text-xs text-rose-600 focus:bg-rose-50 focus:text-rose-600"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
