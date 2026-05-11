import type { ApiResponse } from '@/types'

const getBaseUrl = () => {
  const config = import.meta.env.VITE_API_BASE_URL || 'https://crowsys.chrislabs.net/api/v1'
  return config.replace(/\/+$/, '')
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: 'Invalid JSON response',
    }))

    if (!response.ok && !data.success) {
      return {
        success: false,
        message: data.message || `HTTP Error: ${response.status}`,
      }
    }

    return data
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    }
  }
}

export async function apiHealthCheck(): Promise<ApiResponse> {
  return request('/health')
}

export async function submitContact(data: Record<string, unknown>): Promise<ApiResponse> {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function submitConsultation(data: Record<string, unknown>): Promise<ApiResponse> {
  return request('/consultation', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function uploadAudio(
  blob: Blob,
  metadata: Record<string, unknown>
): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('audio', blob, 'recording.webm')
  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, String(value))
  })

  const url = `${getBaseUrl()}/audio/upload`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    const data: ApiResponse = await response.json().catch(() => ({
      success: false,
      message: 'Invalid JSON response',
    }))
    return data
  } catch (error) {
    console.error('Audio upload failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}