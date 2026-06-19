'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, X, UploadCloud } from 'lucide-react';
import { useUploadImage } from '@/hooks/useWebsiteManagement';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className, label }: ImageUploadProps) {
  const uploadMutation = useUploadImage();
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        const url = await uploadMutation.mutateAsync(file);
        onChange(url);
      } catch (error) {
        setPreview(value || null);
        console.error('Upload failed', error);
      }
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {label && <label className="text-sm font-medium text-foreground/70">{label}</label>}
      
      <div 
        className={cn(
          'relative h-48 w-full rounded border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-muted/30 group',
          preview ? 'border-primary/20' : 'border-primary/10 hover:border-primary/40'
        )}
      >
        {preview ? (
          <>
            <img src={preview} alt="Upload preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="rounded h-12 w-12"
                onClick={removeImage}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </>
        ) : (
          <div 
            className="flex flex-col items-center gap-3 cursor-pointer p-8 w-full h-full justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-14 w-14 rounded bg-primary/10 flex items-center justify-center shadow-inner">
              <UploadCloud className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-primary/80">Click to upload</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">SVG, PNG, JPG or GIF</p>
            </div>
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Uploading...</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={onFileChange} 
      />
    </div>
  );
}
