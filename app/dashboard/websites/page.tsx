'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WebsitesTable } from '@/components/tables/WebsitesTable';
import { Plus, Search, Filter } from 'lucide-react';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';

export default function WebsitesPage() {
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-[#F1F3F5] p-5 rounded">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ADB5BD]" />
          <Input
            placeholder="Search platforms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-8 bg-[#F8F9FA] border-[#F1F3F5] rounded text-xs font-medium"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto items-center">
          <Select 
            value={status} 
            onValueChange={(val) => setStatus(val || 'all')}
          >
            <SelectTrigger className="w-full md:w-[160px] h-8 bg-[#F8F9FA] border-[#F1F3F5] rounded">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-[#ADB5BD]" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="h-8 px-4 rounded bg-[#212529] text-white font-semibold text-xs transition-all active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add platform
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border border-[#F1F3F5] overflow-hidden">
        <WebsitesTable status={status === 'all' ? '' : status} search={search} />
      </div>

      <WebsiteDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
}
