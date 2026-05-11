import type { ApiResponse, ContactFormData, ConsultationFormData, AudioSubmissionData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://crowsys.chrislabs.net/api/v1';
const API_TIMEOUT = 15000;

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return { success: true, message: 'Success' } as ApiResponse<T>;
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message ?? `HTTP Error: ${response.status}`,
        data: data?.data,
      };
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, message: 'Request timed out' };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function submitContact(data: ContactFormData): Promise<ApiResponse> {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitConsultation(data: ConsultationFormData): Promise<ApiResponse> {
  return apiRequest('/consultation', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadAudio(data: AudioSubmissionData): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('audio', data.audioBlob, `recording_${Date.now()}.${data.mimeType.split('/')[1]}`);
  if (data.description) {
    formData.append('description', data.description);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/audio/upload`, {
      method: 'POST',
      body: formData,
    });

    const result: ApiResponse = await response.json();
    if (!response.ok) {
      return { success: false, message: result?.message ?? 'Upload failed' };
    }
    return result;
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function checkHealth(): Promise<ApiResponse> {
  return apiRequest('/health');
}