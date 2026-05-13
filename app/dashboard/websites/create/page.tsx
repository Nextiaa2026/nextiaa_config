'use client';

import { WebsiteForm } from '@/components/forms/WebsiteForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Globe } from 'lucide-react';

export default function CreateWebsitePage() {
  const router = useRouter();

  return (
    <div className="container py-8 max-w-4xl space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Website</h1>
          <p className="text-muted-foreground">Fill in the details below to register a new website.</p>
        </div>
      </div>

      <Card className="border shadow-xl shadow-primary/5 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 roundedg">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic website identity and configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <WebsiteForm />
        </CardContent>
      </Card>
    </div>
  );
}
