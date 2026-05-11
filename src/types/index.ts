// ===== Type Definitions =====

// ===== Service Interface =====
export interface Service {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
}

// ===== Team Member Interface =====
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
}

// ===== Contact Form Data =====
export interface ContactFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  serviceArea: string;
  businessProblem: string;
  projectGoals?: string;
  budgetRange?: string;
}

// ===== Consulting Form Data =====
export interface ConsultingFormData extends ContactFormData {
  projectGoals: string;
  budgetRange: string;
}

// ===== Audio Submission Data =====
export interface AudioSubmissionData {
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  description?: string;
  contactEmail?: string;
}

// ===== API Response =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// ===== API Error =====
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ===== Navigation Item =====
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

// ===== Hero Section Data =====
export interface HeroSectionData {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  imageAlt: string;
  imageSrc: string;
}

// ===== Stats Counter =====
export interface Stat {
  value: string;
  label: string;
  icon: string;
}

// ===== Section Config =====
export interface SectionConfig {
  id: string;
  label: string;
  href: string;
}

// ===== Environment Configuration =====
export interface AppConfig {
  apiBaseUrl: string;
  contactEndpoint: string;
  consultationEndpoint: string;
  audioUploadEndpoint: string;
  linkedinUrl: string;
  supportEmail: string;
  companyRegion: string;
  siteName: string;
}

// ===== Form Validation Result =====
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ===== Audio Recorder State =====
export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  blob: Blob | null;
  url: string | null;
  error: string | null;
  permissionDenied: boolean;
}

// ===== CTA Type =====
export type CtaType = 'primary' | 'secondary' | 'tertiary';

// ===== Button Size =====
export type ButtonSize = 'sm' | 'md' | 'lg';