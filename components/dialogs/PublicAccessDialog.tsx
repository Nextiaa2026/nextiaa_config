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
import { Copy, Check, Code2, Globe, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WebsiteResponse } from '@/lib/types';

interface PublicAccessDialogProps {
  website?: WebsiteResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function PublicAccessDialog({ website, isOpen, onClose }: PublicAccessDialogProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const publicUrl = website ? `${origin}/api/public/websites/${website.slug}` : '';

  const copyToClipboard = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('API endpoint copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[#F1F3F5] shadow-none rounded-none">
        <div className="bg-[#F8F9FA] p-6 border-b border-[#F1F3F5] flex items-center gap-4">
          <div className="h-10 w-10 bg-white rounded border border-[#F1F3F5] flex items-center justify-center">
            <Code2 className="h-5 w-5 text-[#212529]" />
          </div>
          <div>
            <DialogTitle className="text-lg font-medium text-[#212529]">API Integration</DialogTitle>
            <DialogDescription className="text-xs font-medium text-[#868E96] mt-0.5">
              Access your platform data programmatically.
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#868E96] flex items-center gap-1.5">
              <LinkIcon className="h-3 w-3" />
              Public endpoint URL
            </label>
            <div className="flex gap-2">
              <Input 
                value={publicUrl} 
                readOnly 
                className="h-8 rounded bg-[#F8F9FA] border-[#F1F3F5] font-mono text-[11px] placeholder:text-[#CED4DA]"
              />
              <Button 
                size="sm" 
                className="h-8 px-3 rounded bg-[#212529] text-white shadow-none"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <div className="bg-[#212529] rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
               <span className="text-[10px] font-medium uppercase tracking-wider text-[#ADB5BD]">Request example</span>
               <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded bg-[#495057]" />
                  <div className="h-1.5 w-1.5 rounded bg-[#495057]" />
                  <div className="h-1.5 w-1.5 rounded bg-[#495057]" />
               </div>
            </div>
            <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`// Fetch platform data
const res = await fetch('${publicUrl}');
const { data } = await res.json();

console.log(data.sections); // sections array
console.log(data.teamMembers); // team members array`}
            </pre>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-8 rounded border-[#F1F3F5] font-medium text-xs text-[#495057] hover:bg-[#F8F9FA] gap-2 shadow-none" 
            asChild
          >
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="h-3.5 w-3.5" />
              Preview JSON response
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
