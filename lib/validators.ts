import { z } from 'zod';

export const createWebsiteSchema = z.object({
  name: z.string().min(1, 'Website name is required').min(3, 'Name must be at least 3 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export type CreateWebsiteFormData = z.infer<typeof createWebsiteSchema>;
