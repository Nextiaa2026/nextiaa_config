import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { WebsiteResponse, CreateWebsiteRequest, UpdateWebsiteRequest } from '@/lib/types';
import { toast } from 'sonner';

export const useWebsites = (filters?: { status?: string; search?: string }) => {
  const { status, search } = filters || {};
  return useQuery({
    queryKey: ['websites', { status, search }],
    queryFn: async () => {
      const { data } = await api.get('/websites', {
        params: { status, search },
      });
      return data.data as WebsiteResponse[];
    },
  });
};

export const useWebsite = (id: string) => {
  return useQuery({
    queryKey: ['website', id],
    queryFn: async () => {
      const { data } = await api.get(`/websites/${id}`);
      return data.data as WebsiteResponse;
    },
    enabled: !!id,
  });
};

export const useCreateWebsite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateWebsiteRequest) => {
      const { data } = await api.post('/websites', values);
      return data.data as WebsiteResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      toast.success('Platform created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create platform');
    },
  });
};

export const useUpdateWebsite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: UpdateWebsiteRequest) => {
      const { data } = await api.put(`/websites/${id}`, values);
      return data.data as WebsiteResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      queryClient.invalidateQueries({ queryKey: ['website', data.id] });
      toast.success('Configuration updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update configuration');
    },
  });
};

export const useDeleteWebsite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/websites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      toast.success('Platform decommissioned');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete platform');
    },
  });
};
