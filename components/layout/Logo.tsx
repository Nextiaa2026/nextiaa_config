import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoVariant = 'icon' | 'wordmark' | 'wordmark-light';

type LogoProps = {
  className?: string;
  href?: string | null;
  variant?: LogoVariant;
};

const sources: Record<LogoVariant, { src: string; width: number; height: number }> = {
  icon: { src: '/brand/nextiaa-icon.png', width: 256, height: 227 },
  wordmark: { src: '/brand/nextiaa-wordmark.png', width: 720, height: 289 },
  'wordmark-light': { src: '/brand/nextiaa-wordmark-light.png', width: 720, height: 289 },
};

export function Logo({ className, href = '/', variant = 'wordmark' }: LogoProps) {
  const { src, width, height } = sources[variant];
  const image = (
    <Image
      src={src}
      alt="Nextiaa"
      width={width}
      height={height}
      className={cn('h-8 w-auto object-contain', className)}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
