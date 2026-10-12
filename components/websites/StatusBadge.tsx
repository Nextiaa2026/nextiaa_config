import { cn } from '@/lib/utils';

const styles: Record<string, { dot: string; badge: string; label: string }> = {
  active: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', label: 'Active' },
  inactive: { dot: 'bg-zinc-400', badge: 'bg-zinc-100 text-zinc-600 ring-zinc-500/15', label: 'Inactive' },
  archived: { dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-600 ring-rose-600/15', label: 'Archived' },
};

export function StatusDot({ status, className }: { status: string; className?: string }) {
  const style = styles[status] ?? styles.inactive;
  return (
    <span className={cn('relative flex h-2 w-2 shrink-0', className)}>
      {status === 'active' && (
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', style.dot)} />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', style.dot)} />
    </span>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = styles[status] ?? styles.inactive;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        style.badge,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {style.label}
    </span>
  );
}
