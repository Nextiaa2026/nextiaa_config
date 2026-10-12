'use client';

import Link from 'next/link';
import { ArrowRight, Code2, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SiteAvatar } from '@/components/websites/SiteAvatar';
import { StatusBadge } from '@/components/websites/StatusBadge';
import { WebsiteResponse } from '@/lib/types';
import { getHostname } from '@/lib/utils';

interface WebsiteCardProps {
  website: WebsiteResponse;
  onEdit: (website: WebsiteResponse) => void;
  onApi: (website: WebsiteResponse) => void;
  onDelete: (website: WebsiteResponse) => void;
}

export function WebsiteCard({ website, onEdit, onApi, onDelete }: WebsiteCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_12px_40px_-12px_rgba(255,113,0,0.25)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-brand-200 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <Link href={`/dashboard/websites/${website.id}`} className="absolute inset-0 z-0" aria-label={`Open ${website.name}`} />

      <div className="flex items-start gap-3 p-5 pb-4">
        <SiteAvatar name={website.name} className="h-11 w-11 rounded-xl text-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-medium text-foreground">{website.name}</h3>
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 truncate text-xs text-muted-foreground transition-colors hover:text-brand"
          >
            {getHostname(website.url)}
          </a>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative z-10 -mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Website actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2 text-xs" onClick={() => onApi(website)}>
              <Code2 className="mr-2 h-3.5 w-3.5" />
              API access
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2 text-xs" onClick={() => onEdit(website)}>
              <Edit className="mr-2 h-3.5 w-3.5" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg py-2 text-xs text-rose-600 focus:bg-rose-50 focus:text-rose-600"
              onClick={() => onDelete(website)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete website
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="line-clamp-2 min-h-[2.5rem] px-5 text-xs leading-relaxed text-muted-foreground">
        {website.description || 'No description yet.'}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-border/70 bg-zinc-50/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={website.status} />
          <code className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">
            /{website.slug}
          </code>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-brand">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}
