'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowRight,
  Briefcase,
  Check,
  Copy,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Settings2,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useWebsite } from '@/hooks/useWebsites';
import { useSections, useServices, useTeamMembers } from '@/hooks/useWebsiteManagement';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';
import { StatusBadge } from '@/components/websites/StatusBadge';
import { getHostname } from '@/lib/utils';

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-brand">
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export default function WebsiteOverviewPage() {
  const params = useParams();
  const websiteId = params.id as string;
  const base = `/dashboard/websites/${websiteId}`;
  const { data: website } = useWebsite(websiteId);
  const { data: sections = [] } = useSections(websiteId);
  const { data: services = [] } = useServices(websiteId);
  const { data: team = [] } = useTeamMembers(websiteId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats: { label: string; value: number; hint: string; icon: LucideIcon; href: string }[] = [
    {
      label: 'Sections',
      value: sections.length,
      hint: `${sections.filter((s) => s.isActive).length} live`,
      icon: Layers,
      href: `${base}/sections`,
    },
    {
      label: 'Services',
      value: services.length,
      hint: `${services.filter((s) => s.isActive).length} published`,
      icon: Briefcase,
      href: `${base}/services`,
    },
    {
      label: 'Team members',
      value: team.length,
      hint: `${team.filter((m) => m.isActive).length} active`,
      icon: Users,
      href: `${base}/team`,
    },
  ];

  const quickActions: { label: string; icon: LucideIcon; href?: string; onClick?: () => void }[] = [
    { label: 'Add section', icon: Plus, href: `${base}/sections` },
    { label: 'New service', icon: Briefcase, href: `${base}/services` },
    { label: 'Add member', icon: UserPlus, href: `${base}/team` },
    { label: 'Settings', icon: Settings2, onClick: () => setIsEditOpen(true) },
  ];

  const copyKey = () => {
    if (!website?.apiKey) return;
    navigator.clipboard.writeText(website.apiKey);
    setCopied(true);
    toast.success('API key copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const recentSections = [...sections].sort((a, b) => a.order - b.order).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 animate-in fade-in duration-500 md:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all hover:border-brand/30 hover:shadow-[0_12px_40px_-16px_rgba(255,113,0,0.35)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-medium tabular-nums">{stat.value}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.hint}</span>
              <ArrowRight className="h-4 w-4 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Sections" action={<PanelLink href={`${base}/sections`} label="Manage" />}>
            {recentSections.length ? (
              <ul className="divide-y divide-border/70">
                {recentSections.map((section) => (
                  <li key={section.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{section.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{section.type}</p>
                    </div>
                    <span
                      className={
                        section.isActive
                          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700'
                          : 'rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500'
                      }
                    >
                      {section.isActive ? 'Live' : 'Draft'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Layers} text="No sections yet" href={`${base}/sections`} cta="Create the first section" />
            )}
          </Panel>

          <Panel title="Team" action={<PanelLink href={`${base}/team`} label="Manage" />}>
            {team.length ? (
              <div className="flex flex-wrap gap-3 p-5">
                {team.slice(0, 8).map((member) => (
                  <div key={member.id} className="flex items-center gap-2.5 rounded-xl border border-border/70 py-1.5 pl-1.5 pr-3">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="h-8 w-8 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-xs font-medium text-brand">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="max-w-36 truncate text-xs font-medium">{member.name}</p>
                      <p className="max-w-36 truncate text-[11px] text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
                {team.length > 8 && (
                  <Link
                    href={`${base}/team`}
                    className="flex items-center rounded-xl border border-dashed border-border px-3 text-xs text-muted-foreground hover:border-brand hover:text-brand"
                  >
                    +{team.length - 8} more
                  </Link>
                )}
              </div>
            ) : (
              <EmptyState icon={Users} text="No team members yet" href={`${base}/team`} cta="Add a team member" />
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Quick actions">
            <div className="grid grid-cols-2 gap-2 p-4">
              {quickActions.map((action) => {
                const className =
                  'group flex flex-col items-start gap-3 rounded-xl border border-border/70 p-3.5 text-left transition-all hover:border-brand hover:bg-brand hover:text-white';
                const content = (
                  <>
                    <action.icon className="h-4 w-4 text-brand transition-colors group-hover:text-white" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </>
                );
                return action.href ? (
                  <Link key={action.label} href={action.href} className={className}>
                    {content}
                  </Link>
                ) : (
                  <button key={action.label} type="button" onClick={action.onClick} className={className}>
                    {content}
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Details">
            <dl className="space-y-3.5 p-5 text-sm">
              <DetailRow label="Status">{website && <StatusBadge status={website.status} />}</DetailRow>
              <DetailRow label="Domain">
                <a href={website?.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-brand">
                  {getHostname(website?.url)}
                </a>
              </DetailRow>
              <DetailRow label="Slug">
                <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">{website?.slug}</code>
              </DetailRow>
              <DetailRow label="Created">{formatDate(website?.createdAt)}</DetailRow>
              <DetailRow label="Updated">{formatDate(website?.updatedAt)}</DetailRow>
            </dl>
            <div className="border-t border-border/70 p-5">
              <p className="mb-2 text-xs text-muted-foreground">API key</p>
              <div className="flex items-center gap-1 rounded-xl bg-ink p-1 pl-3">
                <code className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-300">
                  {showKey ? website?.apiKey : '•'.repeat(24)}
                </code>
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={copyKey}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-600"
                  aria-label="Copy API key"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {website && <WebsiteDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialData={website} />}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium">{children}</dd>
    </div>
  );
}

function EmptyState({ icon: Icon, text, href, cta }: { icon: LucideIcon; text: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link href={href} className="text-xs font-medium text-brand hover:underline">
        {cta}
      </Link>
    </div>
  );
}
