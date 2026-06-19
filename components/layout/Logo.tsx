import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  href?: string | null;
};

export function Logo({ className, href = '/' }: LogoProps) {
  const image = (
    <Image
      src="/nextiaa-mark.png"
      alt="Nextiaa"
      width={48}
      height={48}
      className={cn('h-11 w-11 object-contain', className)}
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
