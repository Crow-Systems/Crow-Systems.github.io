import { useMutation } from "@tanstack/react-query";
import { submitConsultation, uploadAudio } from "./api";

export function useSubmitConsultation() {
  return useMutation({ mutationFn: submitConsultation });
}

export function useUploadAudio() {
  return useMutation({ mutationFn: uploadAudio });
}
