'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SectionForm } from '../forms/SectionForm';
import { SectionResponse } from '@/lib/types';

interface SectionDialogProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: SectionResponse;
}

export function SectionDialog({ websiteId, isOpen, onClose, initialData }: SectionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden gap-0 border border-[#F1F3F5] shadow-none bg-white rounded">
        <div className="p-8 border-b border-[#F1F3F5]">
          <DialogTitle className="text-xl font-semibold tracking-tight text-[#212529]">
            {initialData ? 'edit section' : 'add new section'}
          </DialogTitle>
          <DialogDescription className="text-[#868E96] mt-1 text-sm font-medium">
            {initialData 
              ? `update configuration for ${initialData.title.toLowerCase()}` 
              : 'enter details to create a new content block'}
          </DialogDescription>
        </div>
        <div className="p-8 md:p-10 bg-white">
          <SectionForm 
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
