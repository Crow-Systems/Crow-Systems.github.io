interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ConsultationPayload {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  businessProblem: string;
  projectGoals?: string;
  budgetRange?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const BASE: string =
  import.meta.env.PUBLIC_API_BASE_URL || "https://crowsys.chrislabs.net/api/v1";
console.log("BASE:", BASE);
const CONTACT: string = import.meta.env.PUBLIC_CONTACT_ENDPOINT || "/contact";
const CONSULTATION: string =
  import.meta.env.PUBLIC_CONSULTATION_ENDPOINT || "/consultation";
const AUDIO_UPLOAD: string =
  import.meta.env.PUBLIC_AUDIO_UPLOAD_ENDPOINT || "/audio/upload";

async function request<T = ApiResponse>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data: T = await res.json();
  if (!res.ok) {
    const msg = (data as ApiResponse).message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export function checkHealth(): Promise<ApiResponse> {
  return request("/health", { method: "GET" });
}

export function submitContact(payload: ContactPayload): Promise<ApiResponse> {
  return request(CONTACT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitConsultation(
  payload: ConsultationPayload,
): Promise<ApiResponse> {
  return request(CONSULTATION, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadAudio(
  audioBlob: Blob,
  description?: string,
): Promise<ApiResponse> {
  const url = `${BASE}${AUDIO_UPLOAD}`;
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  if (description) formData.append("description", description);
  const res = await fetch(url, { method: "POST", body: formData });
  const data: ApiResponse = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}
