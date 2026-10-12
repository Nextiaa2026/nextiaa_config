'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { cn } from '@/lib/utils';

const COLLAPSED_STORAGE_KEY = 'nextiaa:sidebar-collapsed';
const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(listener: () => void) {
  collapsedListeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    collapsedListeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

const getCollapsed = () => localStorage.getItem(COLLAPSED_STORAGE_KEY) !== 'false';
const getServerCollapsed = () => true;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isCollapsed = useSyncExternalStore(subscribeCollapsed, getCollapsed, getServerCollapsed);

  const toggleCollapsed = useCallback(() => {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, String(!getCollapsed()));
    collapsedListeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleCollapsed]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 ease-out lg:block',
          isCollapsed ? 'w-[72px]' : 'w-72'
        )}
      >
        <Sidebar collapsed={isCollapsed} />
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          isMobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          onClick={() => setIsMobileOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300',
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          )}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 w-72 max-w-[85vw] transition-transform duration-300 ease-out',
            isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          )}
        >
          <Sidebar onNavigate={() => setIsMobileOpen(false)} />
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </aside>
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-out',
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-72'
        )}
      >
        <Topbar
          onMenuClick={() => setIsMobileOpen(true)}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={toggleCollapsed}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
