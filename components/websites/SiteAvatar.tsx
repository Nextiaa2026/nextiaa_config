import { cn } from '@/lib/utils';

const palettes = [
  'bg-brand text-white',
  'bg-ink-600 text-brand',
  'bg-brand-100 text-brand-700',
  'bg-amber-100 text-amber-700',
  'bg-white text-ink ring-1 ring-inset ring-black/10',
  'bg-orange-200 text-orange-800',
];

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return palettes[Math.abs(hash) % palettes.length];
}

interface SiteAvatarProps {
  name: string;
  className?: string;
}

export function SiteAvatar({ name, className }: SiteAvatarProps) {
  const initials = name
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-medium tracking-wide',
        paletteFor(name),
        className
      )}
    >
      {initials || '?'}
    </div>
  );
}
