export interface CreateWebsiteRequest {
  name: string;
  slug: string;
  url: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
}

export interface UpdateWebsiteRequest extends Partial<CreateWebsiteRequest> {
  id: string;
}

export interface WebsiteResponse {
  id: string;
  slug: string;
  name: string;
  url: string;
  description?: string;
  status: string;
  apiKey: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  sections?: SectionResponse[];
  services?: ServiceResponse[];
  teamMembers?: TeamMemberResponse[];
}

export interface SectionResponse {
  id: string;
  websiteId: string;
  title: string;
  subtitle?: string;
  content?: string;
  order: number;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  id: string;
  websiteId: string;
  name: string;
  description?: string;
  icon?: string;
  price?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberResponse {
  id: string;
  websiteId: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  socialLinks?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
