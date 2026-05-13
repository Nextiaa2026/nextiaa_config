'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Layers, GripVertical, Eye, EyeOff } from 'lucide-react';
import { SectionResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SectionsTableProps {
  sections: SectionResponse[];
  onEdit: (section: SectionResponse) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, current: boolean) => void;
}

export function SectionsTable({ sections, onEdit, onDelete, onToggleVisibility }: SectionsTableProps) {
  if (!sections.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white border border-[#F1F3F5] rounded">
        <Layers className="h-10 w-10 text-[#CED4DA]" />
        <p className="text-[#868E96] font-medium text-sm">no sections found.</p>
      </div>
    );
  }

  return (
    <div className="rounded overflow-hidden border border-[#F1F3F5] bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-b-[#F1F3F5]">
              <TableHead className="py-4 px-6 text-sm font-medium text-[#212529]">structure</TableHead>
              <TableHead className="text-sm font-medium text-[#212529]">type</TableHead>
              <TableHead className="text-sm font-medium text-[#212529]">state</TableHead>
              <TableHead className="text-right px-6 text-sm font-medium text-[#212529]">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id} className="group transition-colors hover:bg-[#FAFAFA]/50 border-b-[#F1F3F5] bg-white">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-[#CED4DA] hover:text-[#212529] transition-colors">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded bg-[#F8F9FA] flex items-center justify-center border border-[#F1F3F5]">
                      <Layers className="h-4 w-4 text-[#495057]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-[#212529] text-sm">{section.title.toLowerCase()}</span>
                      <span className="text-[10px] text-[#ADB5BD] font-medium">{section.subtitle?.toLowerCase() || 'no subtitle'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded px-2 py-0.5 text-[10px] font-semibold bg-[#F8F9FA] text-[#495057] border-[#F1F3F5] shadow-none">
                    {section.type.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", section.isActive ? "bg-emerald-500" : "bg-slate-300")} />
                    <span className="text-[11px] font-semibold text-[#868E96]">
                      {section.isActive ? 'live' : 'draft'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors"
                      onClick={() => onToggleVisibility(section.id, section.isActive)}
                    >
                      {section.isActive ? <EyeOff className="h-4 w-4 text-[#868E96]" /> : <Eye className="h-4 w-4 text-emerald-500" />}
                    </button>
                    <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors" onClick={() => onEdit(section)}>
                      <Edit className="h-4 w-4 text-[#868E96]" />
                    </button>
                    <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors text-[#868E96] hover:text-destructive" onClick={() => onDelete(section.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
