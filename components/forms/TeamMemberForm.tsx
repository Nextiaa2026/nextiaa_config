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
import { useCreateTeamMember, useUpdateTeamMember } from '@/hooks/useWebsiteManagement';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { TeamMemberResponse } from '@/lib/types';

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  linkedIn: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  websiteId: string;
  initialData?: TeamMemberResponse;
  onSuccess?: () => void;
}

export function TeamMemberForm({ websiteId, initialData, onSuccess }: TeamMemberFormProps) {
  const createMutation = useCreateTeamMember(websiteId);
  const updateMutation = useUpdateTeamMember(websiteId);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: initialData?.name || '',
      role: initialData?.role || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      department: initialData?.department || '',
      location: initialData?.location || '',
      bio: initialData?.bio || '',
      image: initialData?.image || '',
      linkedIn: initialData?.linkedIn || '',
      twitter: initialData?.twitter || '',
      github: initialData?.github || '',
    },
  });

  const onSubmit = async (values: TeamMemberFormData) => {
    const payload = {
      ...values,
      email: values.email || undefined,
      linkedIn: values.linkedIn || undefined,
      twitter: values.twitter || undefined,
      github: values.github || undefined,
    };

    if (initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onSuccess?.();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
                <FormLabel className="text-xs font-medium text-muted-foreground">Full name</FormLabel>
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
                <FormLabel className="text-xs font-medium text-muted-foreground">Role / Job title</FormLabel>
                <FormControl>
                  <Input placeholder="CEO & Founder" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 555 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">Department</FormLabel>
                <FormControl>
                  <Input placeholder="Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Paris, France" {...field} />
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
              <FormLabel className="text-xs font-medium text-muted-foreground">Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short professional bio..."
                  {...field}
                  className="min-h-[100px] bg-white text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">Twitter / X</FormLabel>
                <FormControl>
                  <Input placeholder="https://x.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 font-medium text-xs shadow-none"
          >
            {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {initialData ? 'Save changes' : 'Save profile'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
