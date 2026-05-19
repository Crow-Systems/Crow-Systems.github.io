import { useMutation } from "@tanstack/react-query";
import { submitContact, submitConsultation, uploadAudio } from "./api";

export function useSubmitContact() {
  return useMutation({ mutationFn: submitContact });
}

export function useSubmitConsultation() {
  return useMutation({ mutationFn: submitConsultation });
}

export function useUploadAudio() {
  return useMutation({ mutationFn: uploadAudio });
}
