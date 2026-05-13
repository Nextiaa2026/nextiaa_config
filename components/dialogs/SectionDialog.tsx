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
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden gap-0 border border-[#F1F3F5] shadow-none bg-white rounded">
        <div className="p-6 md:p-8 border-b border-[#F1F3F5] bg-[#F8F9FA]">
          <DialogTitle className="text-xl font-semibold tracking-tight text-[#212529]">
            {initialData ? 'Edit section' : 'Add new section'}
          </DialogTitle>
          <DialogDescription className="text-[#868E96] mt-1 text-sm font-medium">
            {initialData 
              ? `Update configuration for ${initialData.title}` 
              : 'Enter details to create a new content block'}
          </DialogDescription>
        </div>
        <div className="p-6 md:p-8 bg-white">
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
