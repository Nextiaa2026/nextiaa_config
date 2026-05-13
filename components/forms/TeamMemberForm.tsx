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
import { useCreateTeamMember } from '@/hooks/useWebsiteManagement';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  image: z.string().optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  websiteId: string;
  onSuccess?: () => void;
}

export function TeamMemberForm({ websiteId, onSuccess }: TeamMemberFormProps) {
  const createMutation = useCreateTeamMember(websiteId);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      image: '',
    },
  });

  const onSubmit = async (values: TeamMemberFormData) => {
    await createMutation.mutateAsync(values);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload 
                  value={field.value} 
                  onChange={field.onChange} 
                  label="Profile portrait" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#868E96]">Full name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#868E96]">Role / Job title</FormLabel>
                <FormControl>
                  <Input placeholder="CEO & Founder" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Biography</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Short professional bio..." 
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
            Save profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
