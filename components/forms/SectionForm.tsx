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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSection } from '@/hooks/useWebsiteManagement';
import { Loader2 } from 'lucide-react';

const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  type: z.string().default('text'),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface SectionFormProps {
  websiteId: string;
  onSuccess?: () => void;
}

export function SectionForm({ websiteId, onSuccess }: SectionFormProps) {
  const createMutation = useCreateSection(websiteId);

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
      type: 'text',
    },
  });

  const onSubmit = async (values: SectionFormData) => {
    await createMutation.mutateAsync(values);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Section title</FormLabel>
              <FormControl>
                <Input placeholder="Hero Banner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Section type</FormLabel>
              <Select 
                onValueChange={(val) => field.onChange(val)} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="text">Text content</SelectItem>
                  <SelectItem value="cta">Call to action</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Short catchphrase..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Content body</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Markdown or HTML content..." 
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
            Deploy section
          </Button>
        </div>
      </form>
    </Form>
  );
}
