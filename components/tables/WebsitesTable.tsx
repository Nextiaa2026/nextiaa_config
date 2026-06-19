'use client';

import { useWebsites, useDeleteWebsite } from '@/hooks/useWebsites';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Code2,
  ChevronRight,
  Monitor,
} from 'lucide-react';
import { useState } from 'react';
import { WebsiteDialog } from '@/components/dialogs/WebsiteDialog';
import { PublicAccessDialog } from '@/components/dialogs/PublicAccessDialog';
import { WebsiteResponse } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';

interface WebsitesTableProps { status: string; search: string; }

export function WebsitesTable({ status, search }: WebsitesTableProps) {
  const { data: websites, isLoading } = useWebsites({ status, search });
  const deleteMutation = useDeleteWebsite();
  const [editingWebsite, setEditingWebsite] = useState<WebsiteResponse | null>(null);
  const [viewingApi, setViewingApi] = useState<WebsiteResponse | null>(null);

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (!websites?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
        <div className="h-12 w-12 rounded bg-white flex items-center justify-center border border-[#F1F3F5]">
          <Monitor className="h-6 w-6 text-[#CED4DA]" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-[#212529]">no platforms found</h3>
          <p className="text-xs text-[#868E96] max-w-xs">try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden border border-[#F1F3F5] bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="hover:bg-transparent border-b-[#F1F3F5]">
            <TableHead className="py-4 px-6">Platform</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Slug</TableHead>
            <TableHead className="text-right px-6">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites.map((website) => (
                <TableRow key={website.id} className="group border-b-[#F1F3F5] transition-colors hover:bg-[#FAFAFA]/50 bg-white">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded bg-[#F8F9FA] flex items-center justify-center border border-[#F1F3F5] group-hover:border-[#E9ECEF] transition-colors">
                        <Monitor className="h-4 w-4 text-[#495057]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-[#212529] text-sm">{website.name.toLowerCase()}</span>
                        <span className="text-[10px] text-[#ADB5BD] font-medium">id: {website.id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a 
                      href={website.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-sm font-medium text-[#868E96] hover:text-[#212529] transition-colors"
                    >
                      {new URL(website.url).hostname}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-medium border-none shadow-none",
                        website.status === 'active' ? "bg-emerald-50 text-emerald-600" : 
                        website.status === 'inactive' ? "bg-slate-50 text-slate-500" : "bg-rose-50 text-rose-500"
                      )}
                    >
                      {website.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <code className="text-[11px] font-medium px-2 py-0.5 bg-[#F8F9FA] rounded border border-[#F1F3F5] text-[#495057]">
                      {website.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-3 rounded font-medium text-xs gap-2 hover:bg-[#F1F3F5]"
                        asChild
                       >
                         <Link href={`/dashboard/websites/${website.id}/sections`}>
                           manage
                           <ChevronRight className="h-3 w-3" />
                         </Link>
                       </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded hover:bg-[#F1F3F5] shadow-none">
                            <MoreHorizontal className="h-4 w-4 text-[#868E96]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded border-[#F1F3F5] shadow-lg p-1.5 bg-white">
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium text-[#ADB5BD]">integrations</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded py-2 cursor-pointer focus:bg-[#FAFAFA]" onClick={() => setViewingApi(website)}>
                            <Code2 className="mr-3 h-4 w-4 text-[#868E96]" />
                            <span className="font-medium text-sm text-[#495057]">api details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#F1F3F5]" />
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium text-[#ADB5BD]">settings</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded py-2 cursor-pointer focus:bg-[#FAFAFA]" onClick={() => setEditingWebsite(website)}>
                            <Edit className="mr-3 h-4 w-4 text-[#868E96]" />
                            <span className="font-medium text-sm text-[#495057]">edit platform</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#F1F3F5]" />
                          <DropdownMenuItem 
                            className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded py-2 cursor-pointer"
                            onClick={() => deleteMutation.mutate(website.id)}
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            <span className="font-medium text-sm">remove platform</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <WebsiteDialog 
        isOpen={!!editingWebsite} 
        onClose={() => setEditingWebsite(null)} 
        initialData={editingWebsite || undefined}
      />

      <PublicAccessDialog 
        isOpen={!!viewingApi} 
        onClose={() => setViewingApi(null)} 
        website={viewingApi || undefined}
      />
    </>
  );
}
