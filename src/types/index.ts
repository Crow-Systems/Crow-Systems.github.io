// API Response formats
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Form field types
export interface ContactFormData {
  name: string;
  email: string;
  serviceArea: string;
  projectScope: string;
}

export interface ConsultationFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  businessProblem: string;
  projectGoals: string;
  budgetRange: string;
}

export interface AudioSubmissionData {
  audioBlob: Blob;
  description?: string;
  duration: number;
  mimeType: string;
}

// Service type
export interface Service {
  icon: string;
  title: string;
  description: string;
  fullDescription: string;
  features: string[];
  idealFor: string;
  technologies: string[];
  cta: string;
}

// Team member type
export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}