'use client';

import { useParams } from 'next/navigation';
import { useWebsite } from '@/hooks/useWebsites';
import { Loader2 } from 'lucide-react';
import { SubHeader } from '@/components/layout/SubHeader';

export default function WebsiteManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const websiteId = params.id as string;
  const { data: website, isLoading } = useWebsite(websiteId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading platform workspace...</p>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-destructive">Platform not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-500">
      <SubHeader websiteId={websiteId} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
