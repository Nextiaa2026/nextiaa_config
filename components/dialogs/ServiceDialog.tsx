'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden gap-0 border border-[#F1F3F5] shadow-none bg-white rounded">
        <div className="p-8 border-b border-[#F1F3F5]">
          <DialogTitle className="text-xl font-semibold tracking-tight text-[#212529]">
            {initialData ? 'edit service' : 'add new service'}
          </DialogTitle>
          <DialogDescription className="text-[#868E96] mt-1 text-sm font-medium">
            {initialData 
              ? `update configuration for ${initialData.name.toLowerCase()}` 
              : 'enter details to define a new service offering'}
          </DialogDescription>
        </div>
        <div className="p-8 md:p-10 bg-white">
          <ServiceForm 
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
