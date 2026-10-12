'use client';

import { WebsiteForm } from '@/components/forms/WebsiteForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CreateWebsitePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 md:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Add New Website</h1>
          <p className="text-muted-foreground">Fill in the details below to register a new website.</p>
        </div>
      </div>

      <WebsiteForm />
    </div>
  );
}
