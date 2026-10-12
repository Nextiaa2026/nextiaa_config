'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { WebsiteForm } from '../forms/WebsiteForm';
import { WebsiteResponse } from '@/lib/types';

interface WebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: WebsiteResponse;
}

export function WebsiteDialog({ isOpen, onClose, initialData }: WebsiteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] p-8 gap-6 border bg-white">
        <div>
          <DialogTitle className="text-xl font-medium tracking-tight">
            {initialData ? 'Edit platform' : 'Add new platform'}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm font-medium">
            {initialData 
              ? `Update configuration for ${initialData.name.toLowerCase()}` 
              : 'Enter details to register a new platform'}
          </DialogDescription>
        </div>
        <WebsiteForm 
          initialData={initialData} 
          onSuccess={() => {
            onClose();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
