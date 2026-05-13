'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TeamMemberForm } from '../forms/TeamMemberForm';
import { TeamMemberResponse } from '@/lib/types';

interface TeamMemberDialogProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: TeamMemberResponse;
}

export function TeamMemberDialog({ websiteId, isOpen, onClose, initialData }: TeamMemberDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden gap-0 border border-[#F1F3F5] shadow-none bg-white rounded">
        <div className="p-8 border-b border-[#F1F3F5]">
          <DialogTitle className="text-xl font-semibold tracking-tight text-[#212529]">
            {initialData ? 'edit member' : 'add new member'}
          </DialogTitle>
          <DialogDescription className="text-[#868E96] mt-1 text-sm font-medium">
            {initialData 
              ? `update profile for ${initialData.name.toLowerCase()}` 
              : 'enter details to register a new platform professional'}
          </DialogDescription>
        </div>
        <div className="p-8 md:p-10 bg-white">
          <TeamMemberForm 
            websiteId={websiteId} 
            initialData={initialData}
            onSuccess={() => {
              onClose();
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
