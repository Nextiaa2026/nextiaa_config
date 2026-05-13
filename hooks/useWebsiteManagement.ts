import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { toast } from 'sonner';
import { SectionResponse, ServiceResponse, TeamMemberResponse } from '@/lib/types';

// --- Sections Hooks ---

export const useSections = (websiteId: string) => {
  return useQuery({
    queryKey: ['sections', websiteId],
    queryFn: async () => {
      const { data } = await api.get(`/websites/${websiteId}/sections`);
      return data.data as SectionResponse[];
    },
    enabled: !!websiteId,
  });
};

export const useCreateSection = (websiteId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<SectionResponse>) => {
      const { data } = await api.post(`/websites/${websiteId}/sections`, values);
      return data.data as SectionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', websiteId] });
      toast.success('Section created successfully');
    },
    onError: () => toast.error('Failed to create section'),
  });
};

export const useUpdateSection = (websiteId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: Partial<SectionResponse> & { id: string }) => {
      const { data } = await api.patch(`/websites/${websiteId}/sections/${id}`, values);
      return data.data as SectionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', websiteId] });
      toast.success('Section updated successfully');
    },
    onError: () => toast.error('Failed to update section'),
  });
};

// --- Services Hooks ---

export const useServices = (websiteId: string) => {
  return useQuery({
    queryKey: ['services', websiteId],
    queryFn: async () => {
      const { data } = await api.get(`/websites/${websiteId}/services`);
      return data.data as ServiceResponse[];
    },
    enabled: !!websiteId,
  });
};

export const useCreateService = (websiteId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<ServiceResponse>) => {
      const { data } = await api.post(`/websites/${websiteId}/services`, values);
      return data.data as ServiceResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', websiteId] });
      toast.success('Service created successfully');
    },
    onError: () => toast.error('Failed to create service'),
  });
};

export const useUpdateService = (websiteId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: Partial<ServiceResponse> & { id: string }) => {
      const { data } = await api.patch(`/websites/${websiteId}/services/${id}`, values);
      return data.data as ServiceResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', websiteId] });
      toast.success('Service updated successfully');
    },
    onError: () => toast.error('Failed to update service'),
  });
};

// --- Team Members Hooks ---

export const useTeamMembers = (websiteId: string) => {
  return useQuery({
    queryKey: ['team', websiteId],
    queryFn: async () => {
      const { data } = await api.get(`/websites/${websiteId}/team`);
      return data.data as TeamMemberResponse[];
    },
    enabled: !!websiteId,
  });
};

export const useCreateTeamMember = (websiteId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<TeamMemberResponse>) => {
      const { data } = await api.post(`/websites/${websiteId}/team`, values);
      return data.data as TeamMemberResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', websiteId] });
      toast.success('Team member registered successfully');
    },
    onError: () => toast.error('Failed to register team member'),
  });
};

export const useUpdateTeamMember = (websiteId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: Partial<TeamMemberResponse> & { id: string }) => {
      const { data } = await api.patch(`/websites/${websiteId}/team/${id}`, values);
      return data.data as TeamMemberResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', websiteId] });
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });
};

// --- Image Upload Hook ---

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url as string;
    },
    onError: () => toast.error('Image upload failed'),
  });
};
