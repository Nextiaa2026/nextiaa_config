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
import { Edit, Trash2, Monitor } from 'lucide-react';
import { TeamMemberResponse } from '@/lib/types';

interface TeamMembersTableProps {
  members: TeamMemberResponse[];
  onEdit: (member: TeamMemberResponse) => void;
  onDelete: (id: string) => void;
}

export function TeamMembersTable({ members, onEdit, onDelete }: TeamMembersTableProps) {
  if (!members.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white border border-[#F1F3F5] rounded">
        <Monitor className="h-10 w-10 text-[#CED4DA]" />
        <p className="text-[#868E96] font-medium text-sm">aucun membre d'équipe trouvé.</p>
      </div>
    );
  }

  return (
    <div className="rounded overflow-hidden border border-[#F1F3F5] bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-b-[#F1F3F5]">
              <TableHead className="py-4 px-6 text-sm font-medium text-[#212529]">membre</TableHead>
              <TableHead className="text-sm font-medium text-[#212529]">rôle</TableHead>
              <TableHead className="text-sm font-medium text-[#212529]">ordre</TableHead>
              <TableHead className="text-sm font-medium text-[#212529]">réseaux</TableHead>
              <TableHead className="text-sm font-medium text-[#212529]">statut</TableHead>
              <TableHead className="text-right px-6 text-sm font-medium text-[#212529]">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="group transition-colors hover:bg-[#FAFAFA]/50 border-b-[#F1F3F5] bg-white">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded bg-[#F8F9FA] overflow-hidden border border-[#F1F3F5] flex items-center justify-center">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-semibold text-xs text-[#ADB5BD]">{member.name.charAt(0).toLowerCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#212529] text-sm">{member.name.toLowerCase()}</span>
                      <span className="text-[10px] text-[#ADB5BD] truncate max-w-[200px]">{member.bio?.toLowerCase() || 'aucune bio'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-xs text-[#495057]">{member.role.toLowerCase()}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-xs text-[#495057]">{member.order}</span>
                </TableCell>
                <TableCell>
                  {member.socialLinks ? (
                    <span className="text-xs text-blue-500 font-medium">Lié</span>
                  ) : (
                    <span className="text-xs text-[#ADB5BD]">Aucun</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={member.isActive ? "bg-emerald-50 text-emerald-600 border-none shadow-none" : "bg-slate-50 text-slate-500 border-none shadow-none"} 
                    variant="outline"
                  >
                    {member.isActive ? "actif" : "inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(member)} className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors">
                      <Edit className="h-4 w-4 text-[#868E96]" />
                    </button>
                    <button onClick={() => onDelete(member.id)} className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#F1F3F5] transition-colors text-[#868E96] hover:text-destructive">
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
