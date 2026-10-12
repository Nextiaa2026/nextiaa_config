'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ServiceForm } from '../forms/ServiceForm';
import { ServiceResponse } from '@/lib/types';

interface ServiceDialogProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServiceResponse;
}

export function ServiceDialog({ websiteId, isOpen, onClose, initialData }: ServiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px] p-8 gap-6 border bg-white">
        <div>
          <DialogTitle className="text-xl font-medium tracking-tight">
            {initialData ? 'Edit service' : 'Add new service'}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm font-medium">
            {initialData 
              ? `Update configuration for ${initialData.name}` 
              : 'Enter details to define a new service offering'}
          </DialogDescription>
        </div>
        <ServiceForm 
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
