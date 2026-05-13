'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, Briefcase, Layers } from 'lucide-react';

interface SubHeaderProps {
  websiteId: string;
}

export function SubHeader({ websiteId }: SubHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'sections', href: `/dashboard/websites/${websiteId}/sections`, icon: Layers },
    { name: 'services', href: `/dashboard/websites/${websiteId}/services`, icon: Briefcase },
    { name: 'team', href: `/dashboard/websites/${websiteId}/team`, icon: Users },
  ];

  return (
    <div className="w-full bg-white border-b border-[#F1F3F5] overflow-x-auto no-scrollbar">
      <div className="container mx-auto flex h-12 items-center gap-6 px-4 min-w-max">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 text-[13px] font-semibold transition-all h-full relative whitespace-nowrap',
                isActive 
                  ? 'text-[#212529] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#212529]' 
                  : 'text-[#868E96] hover:text-[#212529]'
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
