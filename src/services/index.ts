import { submitContact, submitConsultation, uploadAudio } from '@/api/client'
import type { ApiResponse } from '@/types'

export async function SUBMIT_CONTACT(data: Record<string, unknown>): Promise<ApiResponse> {
  return submitContact(data)
}

export async function SUBMIT_CONSULTATION(data: Record<string, unknown>): Promise<ApiResponse> {
  return submitConsultation(data)
}

export async function submitAudio(
  blob: Blob,
  metadata: Record<string, unknown>
): Promise<ApiResponse> {
  return uploadAudio(blob, metadata)
}