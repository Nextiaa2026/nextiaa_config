'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Zap, Heart, Rocket, Edit3, Trash2, LayoutGrid, List } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServices } from '@/hooks/useWebsiteManagement';
import { useState } from 'react';
import { ServicesTable } from '@/components/tables/ServicesTable';
import { ServiceResponse } from '@/lib/types';
import { ServiceDialog } from '@/components/dialogs/ServiceDialog';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const iconMap = {
  Zap: <Zap className="h-5 w-5 text-amber-500" />,
  Heart: <Heart className="h-5 w-5 text-rose-500" />,
  Rocket: <Rocket className="h-5 w-5 text-indigo-500" />,
};

export default function ServicesPage() {
  const params = useParams();
  const websiteId = params.id as string;
  const { data: services, isLoading } = useServices(websiteId);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; data?: ServiceResponse }>({
    isOpen: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <TableSkeleton rows={6} columns={4} />
      </div>
    );
  }

  const handleEdit = (service: ServiceResponse) => {
    setDialogState({ isOpen: true, data: service });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 bg-white border border-[#F1F3F5] p-3 md:p-4 rounded">
        <div className="flex gap-1.5 bg-[#F8F9FA] p-1 rounded">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded h-8 px-2 md:px-3 shadow-none text-xs font-semibold"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Grid</span>
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded h-8 px-2 md:px-3 shadow-none text-xs font-semibold"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Table</span>
          </Button>
        </div>

        <Button 
          onClick={() => setDialogState({ isOpen: true })}
          className="h-8 px-3 md:px-6 rounded font-semibold bg-[#212529] text-white transition-all active:scale-[0.98] text-xs md:text-sm"
        >
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Add service</span>
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <Card key={service.id} className="group overflow-hidden border-[#F1F3F5] bg-white rounded shadow-none hover:border-[#E9ECEF] transition-all">
              <div className="p-6 bg-[#F8F9FA] flex flex-col items-center justify-center gap-3 relative min-h-[160px]">
                <div className="h-12 w-12 rounded bg-white flex items-center justify-center shadow-sm border border-[#F1F3F5]">
                  {iconMap[service.icon as keyof typeof iconMap] || <Briefcase className="h-6 w-6 text-[#495057]" />}
                </div>
                <Badge variant="outline" className="rounded font-semibold text-[10px] bg-white border-[#F1F3F5] text-[#212529] shadow-none">
                  {service.price || 'Free'}
                </Badge>
                
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="rounded h-8 w-8 bg-white text-[#212529] hover:bg-white border border-[#F1F3F5] shadow-sm flex items-center justify-center transition-colors"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded h-8 w-8 bg-rose-500 text-white shadow-sm flex items-center justify-center hover:bg-rose-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold text-[#212529]">{service.name}</CardTitle>
                <CardDescription className="text-xs mt-3 line-clamp-2 leading-relaxed text-[#495057] font-medium">
                  {service.description || "No description provided."}
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
              <p className="font-semibold text-xs text-[#495057]">Add new service</p>
              <p className="text-[10px] text-[#ADB5BD] mt-1 font-medium">Grow your offerings</p>
            </div>
          </button>
        </div>
      ) : (
        <ServicesTable 
          services={services || []} 
          onEdit={handleEdit} 
          onDelete={() => {}} 
        />
      )}

      <ServiceDialog 
        websiteId={websiteId} 
        isOpen={dialogState.isOpen} 
        onClose={() => setDialogState({ isOpen: false })} 
        initialData={dialogState.data}
      />
    </div>
  );
}
