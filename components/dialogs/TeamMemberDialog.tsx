'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="sm:max-w-[640px] p-8 gap-6 border bg-white">
        <div>
          <DialogTitle className="text-xl font-medium tracking-tight">
            {initialData ? 'Edit profile' : 'Add new member'}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm font-medium">
            {initialData 
              ? `Update details for ${initialData.name}` 
              : 'Enter details to register a new platform professional'}
          </DialogDescription>
        </div>
        <TeamMemberForm 
          websiteId={websiteId} 
          initialData={initialData}
          onSuccess={() => {
            onClose();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
