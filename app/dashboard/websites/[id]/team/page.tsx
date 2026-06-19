'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserPlus, Edit3, Trash2, Plus, LayoutGrid, List, Monitor } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTeamMembers } from '@/hooks/useWebsiteManagement';
import { useState } from 'react';
import { TeamMemberDialog } from '@/components/dialogs/TeamMemberDialog';
import { TeamMembersTable } from '@/components/tables/TeamMembersTable';
import { TeamMemberResponse } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function TeamPage() {
  const params = useParams();
  const websiteId = params.id as string;
  const { data: members, isLoading } = useTeamMembers(websiteId);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; data?: TeamMemberResponse }>({
    isOpen: false,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <TableSkeleton rows={6} columns={4} />
      </div>
    );
  }

  const handleEdit = (member: TeamMemberResponse) => {
    setDialogState({ isOpen: true, data: member });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border border-[#F1F3F5] p-2 rounded shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-between z-50">
        <div className="flex gap-1 bg-[#F8F9FA] p-1 rounded">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded h-9 px-4 shadow-none text-xs font-medium"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Grille</span>
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded h-9 px-4 shadow-none text-xs font-medium"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tableau</span>
          </Button>
        </div>

        <Button 
          onClick={() => setDialogState({ isOpen: true })}
          className="h-10 px-5 rounded font-medium text-sm flex items-center"
        >
          <span className="hidden sm:inline mr-2">Ajouter</span>
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members?.map((member) => (
            <Card key={member.id} className="group overflow-hidden border-[#F1F3F5] bg-white rounded shadow-none hover:border-[#E9ECEF] transition-all">
              <div className="aspect-[5/4] w-full relative overflow-hidden bg-[#F8F9FA]">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Monitor className="h-10 w-10 text-[#CED4DA]" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="rounded h-8 w-8 bg-white text-[#212529] hover:bg-white border border-[#F1F3F5] shadow-sm flex items-center justify-center transition-colors"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded h-8 w-8 bg-rose-500 text-white shadow-sm flex items-center justify-center hover:bg-rose-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Badge variant="outline" className={cn("absolute top-3 left-3 rounded font-medium text-[10px] border-none shadow-none", member.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                  {member.isActive ? "Actif" : "Archivé"}
                </Badge>
              </div>
              <CardHeader className="p-5">
                <div className="space-y-0.5">
                  <CardTitle className="text-base font-medium text-[#212529]">{member.name}</CardTitle>
                  <p className="text-[#868E96] font-medium text-[11px]">{member.role}</p>
                </div>
                <CardDescription className="text-xs mt-3 line-clamp-2 leading-relaxed text-[#495057] font-medium">
                  {member.bio || "Aucune biographie fournie."}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}

          <button 
            onClick={() => setDialogState({ isOpen: true })}
            className="flex flex-col items-center justify-center h-full min-h-[250px] border border-dashed border-[#F1F3F5] rounded bg-[#FAFAFA] hover:bg-white transition-all hover:border-[#CED4DA] group gap-4"
          >
            <div className="h-10 w-10 rounded bg-white border border-[#F1F3F5] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5 text-[#CED4DA]" />
            </div>
            <div className="text-center">
              <p className="font-medium text-xs text-[#495057]">Ajouter un nouveau membre</p>
              <p className="text-[10px] text-[#ADB5BD] mt-1 font-medium">Rejoindre l&apos;équipe</p>
            </div>
          </button>
        </div>
      ) : (
        <TeamMembersTable 
          members={members || []} 
          onEdit={handleEdit} 
          onDelete={() => {}} 
        />
      )}

      <TeamMemberDialog 
        websiteId={websiteId} 
        isOpen={dialogState.isOpen} 
        onClose={() => setDialogState({ isOpen: false })} 
        initialData={dialogState.data}
      />
    </div>
  );
}
