'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, User, LogOut, Menu, ExternalLink } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname.startsWith('/auth')) return null;

  const navItems = [
    { name: 'dashboard', href: '/dashboard/websites', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F1F3F5] bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#212529]" />
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center text-xs font-semibold transition-colors hover:text-[#212529] relative py-1',
                    isActive
                      ? 'text-[#212529] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#212529]'
                      : 'text-[#868E96]'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[11px] font-semibold text-[#212529] leading-tight">{session.user?.name?.toLowerCase()}</span>
                <span className="text-[9px] text-[#ADB5BD] font-medium leading-tight">administrator</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded bg-[#F8F9FA] p-0 overflow-hidden hover:bg-[#F1F3F5] transition-colors border border-[#F1F3F5] shadow-none">
                    <div className="flex h-full w-full items-center justify-center text-[#212529] font-semibold text-[10px]">
                      {session.user?.name?.charAt(0).toLowerCase() || <User className="h-3.5 w-3.5" />}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded border-[#F1F3F5] shadow-lg p-1.5 bg-white mt-2">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-xs font-semibold text-[#212529]">{session.user?.name?.toLowerCase()}</p>
                      <p className="text-[10px] text-[#868E96] font-medium truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#F1F3F5]" />
                  <DropdownMenuItem
                    className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded py-2 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                  >
                    <LogOut className="mr-3 h-3.5 w-3.5" />
                    <span className="font-semibold text-xs">exit dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded h-8 w-8 border border-[#F1F3F5] hover:bg-[#F8F9FA]">
                    <Menu className="h-4 w-4 text-[#495057]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded border-[#F1F3F5] shadow-lg p-1.5 bg-white mt-2">
                  <DropdownMenuLabel className="px-3 py-2 text-[10px] font-semibold text-[#ADB5BD]">navigation</DropdownMenuLabel>
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="rounded py-2 cursor-pointer focus:bg-[#FAFAFA]">
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="mr-3 h-3.5 w-3.5 text-[#868E96]" />
                        <span className="font-semibold text-xs text-[#495057]">{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-[#F1F3F5]" />
                  <DropdownMenuItem className="rounded py-2 cursor-pointer focus:bg-[#FAFAFA]" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <ExternalLink className="mr-3 h-3.5 w-3.5 text-[#868E96]" />
                      <span className="font-semibold text-xs text-[#495057]">documentation</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild variant="default" className="rounded h-8 px-4 font-semibold bg-[#212529] text-white hover:bg-[#343A40] shadow-none text-xs">
              <Link href="/auth/login">login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
