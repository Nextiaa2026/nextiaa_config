'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Globe, Code2, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PublicAccessDialogProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PublicAccessDialog({ slug, isOpen, onClose }: PublicAccessDialogProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/api/public/websites/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('API endpoint copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
        <div className="bg-primary/5 p-10 border-b border-primary/10 flex items-center gap-6">
          <div className="p-4 bg-white rounded shadow-xl border border-primary/5">
            <Code2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-3xl font-black tracking-tight text-foreground">API Integration</DialogTitle>
            <DialogDescription className="text-muted-foreground font-semibold text-base mt-1">
              Access your platform data programmatically using its unique slug.
            </DialogDescription>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
              <LinkIcon className="h-3 w-3" />
              Public Endpoint URL
            </label>
            <div className="relative group">
              <Input 
                value={publicUrl} 
                readOnly 
                className="pr-16 h-16 rounded bg-muted/50 border-none font-mono text-sm group-hover:bg-muted transition-colors"
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded bg-primary shadow-lg shadow-primary/20"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">JSON Example</span>
               <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
               </div>
            </div>
            <pre className="text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`// Fetch by slug
const res = await fetch('${publicUrl}');
const { data } = await res.json();

console.log(data.sections); // Array of live sections
console.log(data.teamMembers); // Array of active team`}
            </pre>
          </div>

          <Button variant="outline" className="w-full h-14 rounded border-primary/20 font-bold text-primary hover:bg-primary/5 gap-2" asChild>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="h-5 w-5" />
              Preview JSON Response
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
