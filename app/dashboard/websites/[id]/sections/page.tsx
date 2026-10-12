'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, Layers, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSections } from '@/hooks/useWebsiteManagement';
import { useState } from 'react';
import { SectionResponse } from '@/lib/types';
import { SectionDialog } from '@/components/dialogs/SectionDialog';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function SectionsPage() {
  const params = useParams();
  const websiteId = params.id as string;
  const { data: sections, isLoading } = useSections(websiteId);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; data?: SectionResponse }>({
    isOpen: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
        <TableSkeleton rows={6} columns={4} />
      </div>
    );
  }

  const handleEdit = (section: SectionResponse) => {
    setDialogState({ isOpen: true, data: section });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <Button
          onClick={() => setDialogState({ isOpen: true })}
          className="h-10 px-5 rounded font-medium text-sm flex items-center"
        >
          <span className="hidden sm:inline mr-2">Ajouter</span>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections?.map((section) => (
          <Card key={section.id} className="group overflow-hidden border-[#F1F3F5] bg-white rounded shadow-none hover:border-[#E9ECEF] transition-all">
            <div className="p-6 bg-[#F8F9FA] flex flex-col items-center justify-center gap-3 relative min-h-[160px]">
              <div className="h-12 w-12 rounded bg-white flex items-center justify-center shadow-sm border border-[#F1F3F5]">
                <Layers className="h-6 w-6 text-[#495057]" />
              </div>
              <Badge variant="outline" className={cn("rounded font-medium text-[10px] border-none shadow-none", section.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                {section.isActive ? "En ligne" : "Brouillon"}
              </Badge>

              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="rounded h-8 w-8 bg-white text-[#212529] hover:bg-white border border-[#F1F3F5] shadow-sm flex items-center justify-center transition-colors"
                  onClick={() => handleEdit(section)}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button className="rounded h-8 w-8 bg-white text-[#868E96] shadow-sm border border-[#F1F3F5] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors">
                  {section.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <CardHeader className="p-5">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-medium text-[#212529]">{section.title}</CardTitle>
                <p className="text-[#868E96] font-medium text-[11px]">{section.type}</p>
              </div>
              <CardDescription className="text-xs mt-3 line-clamp-2 leading-relaxed text-[#495057] font-medium">
                {section.subtitle || "Aucun sous-titre fourni."}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}

        <button
          onClick={() => setDialogState({ isOpen: true })}
          className="flex flex-col items-center justify-center h-full min-h-[260px] border border-dashed border-[#F1F3F5] rounded bg-[#FAFAFA] hover:bg-white transition-all hover:border-[#CED4DA] group gap-4"
        >
          <div className="h-10 w-10 rounded bg-white border border-[#F1F3F5] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="h-5 w-5 text-[#CED4DA]" />
          </div>
          <div className="text-center">
            <p className="font-medium text-xs text-[#495057]">Ajouter une section</p>
            <p className="text-[10px] text-[#ADB5BD] mt-1 font-medium">Construisez votre mise en page</p>
          </div>
        </button>
      </div>

      <SectionDialog
        websiteId={websiteId}
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false })}
        initialData={dialogState.data}
      />
    </div>
  );
}
