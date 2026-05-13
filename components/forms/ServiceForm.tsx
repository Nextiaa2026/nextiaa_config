'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateService } from '@/hooks/useWebsiteManagement';
import { Loader2 } from 'lucide-react';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  price: z.string().optional(),
  icon: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  websiteId: string;
  onSuccess?: () => void;
}

export function ServiceForm({ websiteId, onSuccess }: ServiceFormProps) {
  const createMutation = useCreateService(websiteId);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      icon: 'Zap',
    },
  });

  const onSubmit = async (values: ServiceFormData) => {
    await createMutation.mutateAsync(values);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#868E96]">Service name</FormLabel>
                <FormControl>
                  <Input placeholder="Custom Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#868E96]">Pricing label</FormLabel>
                <FormControl>
                  <Input placeholder="$999 / mo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What value does this provide?" 
                  {...field} 
                  className="min-h-[100px] rounded bg-[#F8F9FA] border-[#F1F3F5] text-sm placeholder:text-[#CED4DA] focus-visible:border-[#CED4DA]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={createMutation.isPending} 
            className="px-8 rounded font-semibold text-xs shadow-none"
          >
            {createMutation.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Create service
          </Button>
        </div>
      </form>
    </Form>
  );
}
