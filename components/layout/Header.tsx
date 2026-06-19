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
import { Logo } from '@/components/layout/Logo';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname.startsWith('/auth')) return null;

  const navItems = [
    { name: 'dashboard', href: '/dashboard/websites', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo href="/dashboard/websites" />
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center text-xs font-medium transition-colors hover:text-foreground relative py-1',
                    isActive
                      ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
                      : 'text-muted-foreground'
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
                <span className="text-[11px] font-medium leading-tight">{session.user?.name?.toLowerCase()}</span>
                <span className="text-[9px] text-muted-foreground font-medium leading-tight">administrator</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 p-0 overflow-hidden border shadow-none">
                    <div className="flex h-full w-full items-center justify-center font-medium text-[10px]">
                      {session.user?.name?.charAt(0).toLowerCase() || <User className="h-3.5 w-3.5" />}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border bg-white p-1.5 shadow-lg mt-2">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-xs font-medium">{session.user?.name?.toLowerCase()}</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 py-2 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                  >
                    <LogOut className="mr-3 h-3.5 w-3.5" />
                    <span className="font-medium text-xs">exit dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 border">
                    <Menu className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border bg-white p-1.5 shadow-lg mt-2">
                  <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium text-muted-foreground">navigation</DropdownMenuLabel>
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="py-2 cursor-pointer focus:bg-accent">
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="mr-3 h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium text-xs">{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2 cursor-pointer focus:bg-accent" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <ExternalLink className="mr-3 h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-xs">documentation</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild variant="default" className="h-8 px-4 font-medium shadow-none text-xs">
              <Link href="/auth/login">login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
