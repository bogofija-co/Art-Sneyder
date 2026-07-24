export interface ColorPalette {
  primary: string;
  accent: string;
  dominant: string;
  secondary: string;
  neutral_dark: string;
  hex_list: string[];
}

export interface GraphicAsset {
  id: string;
  project_id: number;
  filename: string;
  format: 'webp' | 'png' | 'svg' | 'jpg' | 'jpeg' | 'mp4';
  role: 'cover' | 'dieline' | 'render_3d' | 'prepress' | 'ui_prototype' | 'photo_editorial';
  high_res_url: string;
  thumbnail_url: string;
  aspect_ratio: string; // e.g. "4:3", "16:9", "1:1", "4:5"
  dimensions: {
    width: number;
    height: number;
  };
  dominant_color: string;
  color_palette: string[];
  blur_placeholder: string; // Base64 blur SVG/data-URI
  file_size_kb: number;
  optimization: {
    lazy_load: boolean;
    srcset_available: boolean;
    compression_ratio: string;
  };
}

export interface GraphicProject {
  id: number;
  title: string;
  slug: string;
  category: 'identidad' | 'uiux' | 'photo' | 'motion' | 'editorial' | 'branding';
  categoryLabel: string;
  client_brand: string;
  year: string;
  desc: string;
  long_description?: string;
  dominant_color: string;
  color_palette: ColorPalette;
  aspect_ratio: string;
  dimensions: {
    width: number;
    height: number;
  };
  blur_placeholder: string;
  high_res_url: string;
  thumbnail_url: string;
  img: string; // compatibility field
  tags_creativos: string[];
  tools: string[];
  featured: boolean;
  views_count?: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  project_count: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface BogoFamilyBrand {
  name: string;
  url: string;
  logo: string;
  description: string;
  instagram_handle?: string;
}

export interface Profile {
  name: string;
  alias: string;
  title: string;
  subtitles: string[];
  email: string;
  phone: string;
  phone_formatted: string;
  whatsapp_number: string;
  location: string;
  experience_years: string;
  projects_completed: string;
  happy_clients: string;
  total_designs: string;
  bio: string;
  base_education: {
    degree: string;
    institution: string;
    year: string;
    highlights: string[];
  };
  current_focus: {
    degree: string;
    status: string;
    description: string;
  };
  social_links: SocialLink[];
  bogo_family: BogoFamilyBrand[];
  avatar_url: string;
  about_image_url: string;
  logo_url: string;
}

export interface ExperienceItem {
  id: number;
  period: string;
  role: string;
  company: string;
  highlights: string[];
  is_current?: boolean;
}

export interface SkillItem {
  id: number;
  name: string;
  proficiency: number;
  category: 'design' | 'development' | 'ai_automation' | 'video_motion';
  is_primary: boolean;
}

export interface CertificationItem {
  id: number;
  title: string;
  institution: string;
  date: string;
  hours_or_status: string;
  topics: string[];
  icon: string;
  is_in_progress?: boolean;
  norm_details?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
  status: 'received' | 'processed';
  mailto_link: string;
  whatsapp_link: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    filtered_by?: Record<string, unknown>;
    timestamp: string;
  };
}

export interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  query_params?: { name: string; type: string; description: string; required?: boolean }[];
  body_schema?: Record<string, string>;
  example_response: Record<string, unknown>;
}
