import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

const consultationSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().min(1),
  businessProblem: z.string().trim().min(20),
  email: z.email().or(z.literal("")).optional(),
  company: z.string().optional(),
  projectGoals: z.string().optional(),
  budgetRange: z.string().optional(),
});

interface ApiResponse {
  success: boolean;
  message?: string;
  errorKey?: string;
}

export class ApiError extends Error {
  public readonly errorKey?: string;
  public readonly status: number;

  constructor(status: number, errorKey?: string, message?: string) {
    super(errorKey || message || `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.errorKey = errorKey;
  }
}

const BASE: string =
  import.meta.env.PUBLIC_API_BASE_URL || "https://crowsys.chrislabs.net/api/v1";
const CONTACT: string = import.meta.env.PUBLIC_CONTACT_ENDPOINT || "/contact";
const CONSULTATION: string =
  import.meta.env.PUBLIC_CONSULTATION_ENDPOINT || "/consultation";
const AUDIO_UPLOAD: string =
  import.meta.env.PUBLIC_AUDIO_UPLOAD_ENDPOINT || "/audio/upload";

export class ApiParseError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`HTTP ${status}: ${body.slice(0, 200)}`);
    this.name = "ApiParseError";
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiParseError(res.status, text);
  }
}

async function request<T = ApiResponse>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await parseResponse<T>(res);
  if (!res.ok) {
    const apiData = data as ApiResponse;
    throw new ApiError(res.status, apiData.errorKey, apiData.message);
  }
  return data;
}

export function checkHealth(): Promise<ApiResponse> {
  return request("/health", { method: "GET" });
}

export function submitContact(
  payload: z.input<typeof contactSchema>,
): Promise<ApiResponse> {
  const parsed = contactSchema.parse(payload);
  return request(CONTACT, {
    method: "POST",
    body: JSON.stringify(parsed),
  });
}

export function submitConsultation(
  payload: z.input<typeof consultationSchema>,
): Promise<ApiResponse> {
  const parsed = consultationSchema.parse(payload);
  return request(CONSULTATION, {
    method: "POST",
    body: JSON.stringify(parsed),
  });
}

const MIME_EXT: Record<string, string> = {
  "audio/webm": "webm",
  "video/webm": "webm",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
};

export async function uploadAudio(payload: {
  audioBlob: Blob;
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
  description?: string;
}): Promise<ApiResponse> {
  const { audioBlob, fullName, phone, email, company, description } = payload;
  const url = `${BASE}${AUDIO_UPLOAD}`;
  const ext = MIME_EXT[audioBlob.type] || "webm";
  const formData = new FormData();
  formData.append("audio", audioBlob, `recording.${ext}`);
  if (description) formData.append("description", description);
  if (fullName) formData.append("fullName", fullName);
  if (phone) formData.append("phone", phone);
  if (email) formData.append("email", email);
  if (company) formData.append("company", company);
  const res = await fetch(url, { method: "POST", body: formData });
  const data = await parseResponse<ApiResponse>(res);
  if (!res.ok) throw new ApiError(res.status, data.errorKey, data.message);
  return data;
}
