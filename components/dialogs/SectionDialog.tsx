'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="sm:max-w-[640px] p-8 gap-6 border shadow-none bg-white rounded-none">
        <div>
          <DialogTitle className="text-xl font-medium tracking-tight">
            {initialData ? 'Edit section' : 'Add new section'}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm font-medium">
            {initialData 
              ? `Update configuration for ${initialData.title}` 
              : 'Enter details to create a new content block'}
          </DialogDescription>
        </div>
        <SectionForm 
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
