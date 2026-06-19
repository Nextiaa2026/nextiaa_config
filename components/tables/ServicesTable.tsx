'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Zap, Heart, Rocket, Briefcase } from 'lucide-react';
import { ServiceResponse } from '@/lib/types';

const iconMap = {
  Zap: <Zap className="h-4 w-4 text-amber-500" />,
  Heart: <Heart className="h-4 w-4 text-rose-500" />,
  Rocket: <Rocket className="h-4 w-4 text-indigo-500" />,
};

interface ServicesTableProps {
  services: ServiceResponse[];
  onEdit: (service: ServiceResponse) => void;
  onDelete: (id: string) => void;
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (!services.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white border border-[#F1F3F5] rounded-lg">
        <Briefcase className="h-10 w-10 text-[#CED4DA]" />
        <p className="text-[#868E96] font-medium text-sm">no services found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-[#F1F3F5] bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-b-[#F1F3F5]">
              <TableHead className="py-4 px-6">Offering</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="group transition-colors hover:bg-[#FAFAFA]/50 border-b-[#F1F3F5] bg-white">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded bg-[#F8F9FA] flex items-center justify-center border border-[#F1F3F5]">
                      {iconMap[service.icon as keyof typeof iconMap] || <Briefcase className="h-4 w-4 text-[#495057]" />}
                    </div>
                    <span className="font-medium text-[#212529] text-sm">{service.name.toLowerCase()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-[#F8F9FA] text-[#495057] border-[#F1F3F5] font-medium text-[10px] shadow-none rounded">
                    {service.price?.toLowerCase() || 'free'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-xs text-[#868E96] font-medium truncate">{service.description?.toLowerCase() || 'no description'}</p>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors" onClick={() => onEdit(service)}>
                      <Edit className="h-4 w-4 text-[#868E96]" />
                    </button>
                    <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors text-[#868E96] hover:text-destructive" onClick={() => onDelete(service.id)}>
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
