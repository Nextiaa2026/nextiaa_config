import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createWebsiteSchema, CreateWebsiteFormData } from '@/lib/validators';
import { useCreateWebsite, useUpdateWebsite } from '@/hooks/useWebsites';
import { WebsiteResponse } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface WebsiteFormProps {
  initialData?: WebsiteResponse;
  onSuccess?: () => void;
}

export function WebsiteForm({ initialData, onSuccess }: WebsiteFormProps) {
  const createMutation = useCreateWebsite();
  const updateMutation = useUpdateWebsite();

  const form = useForm<CreateWebsiteFormData>({
    resolver: zodResolver(createWebsiteSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      url: initialData?.url || '',
      description: initialData?.description || '',
      status: (initialData?.status as 'active' | 'inactive' | 'archived') || 'active',
    },
  });

  const name = form.watch('name');
  useEffect(() => {
    if (!initialData && name) {
      const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [name, form, initialData]);

  const onSubmit = async (values: CreateWebsiteFormData) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#868E96]">Platform name</FormLabel>
                <FormControl>
                  <Input placeholder="Nexiaa Track" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-[#868E96]">Slug identifier</FormLabel>
                <FormControl>
                  <Input placeholder="nexiaa-track" {...field} />
                </FormControl>
                <FormDescription className="text-[10px] text-[#ADB5BD] font-medium">
                  Unique identifier for API consumption
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Platform URL</FormLabel>
              <FormControl>
                <Input placeholder="https://nexiaa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-[#868E96]">Short description</FormLabel>
              <FormControl>
                <Input placeholder="Brief overview of the platform..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="max-w-[200px]">
              <FormLabel className="text-xs font-medium text-[#868E96]">Operational status</FormLabel>
              <Select 
                onValueChange={(val) => field.onChange(val)} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="font-medium text-xs px-8 shadow-none"
          >
            {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {initialData ? 'Save changes' : 'Create platform'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
