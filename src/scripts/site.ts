import { submitContact, submitConsultation, uploadAudio, ApiError } from "./api.js";

function setSvgContent(el: HTMLElement, svgContent: string): void {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`, "image/svg+xml");
  const svg = doc.documentElement;
  el.textContent = "";
  while (svg.firstChild) {
    el.appendChild(svg.firstChild);
  }
}

let audioBlob: Blob | null = null;

const CONTACT_VALIDATION_FIELD_MAP: Record<string, string> = {
  VALIDATION_NAME_REQUIRED: "name",
  VALIDATION_EMAIL_INVALID: "email",
  VALIDATION_SUBJECT_REQUIRED: "subject",
  VALIDATION_MESSAGE_MIN: "message",
};

const CONSULT_VALIDATION_FIELD_MAP: Record<string, string> = {
  VALIDATION_NAME_REQUIRED: "fullname",
  VALIDATION_EMAIL_INVALID: "email",
  VALIDATION_COMPANY_REQUIRED: "company",
  VALIDATION_PROBLEM_REQUIRED: "problem",
};

function mapErrorKeyToField(key: string, map: Record<string, string>): string | null {
  return map[key] ?? null;
}

function getSectionErrorKeys(
  localeData: Record<string, unknown>,
  section: string,
): Record<string, string> {
  const sectionData = (localeData as Record<string, unknown>)?.pages as
    | Record<string, unknown>
    | undefined;
  return (sectionData?.[section] as Record<string, unknown>)?.[
    "errorKeys"
  ] as Record<string, string>;
}

function resolveServerError(
  err: unknown,
  localeData: Record<string, unknown>,
  section: string,
  fieldMap: Record<string, string>,
): { message: string; field?: string } | null {
  if (err instanceof ApiError && err.errorKey) {
    const errorKeys = getSectionErrorKeys(localeData, section);
    const msg = errorKeys?.[err.errorKey] || err.errorKey;
    const field = mapErrorKeyToField(err.errorKey, fieldMap);
    return { message: msg, field: field || undefined };
  }
  if (err instanceof TypeError) {
    const errorKeys = getSectionErrorKeys(localeData, section);
    return {
      message:
        errorKeys?.NETWORK_ERROR ||
        "Unable to connect. Please check your internet connection.",
    };
  }
  return null;
}

export function initAudioRecorder(): void {
  const btn = document.getElementById("record-btn") as HTMLButtonElement | null;
  const icon = document.getElementById("record-icon") as HTMLElement | null;
  const playBtn = document.getElementById("play-btn") as HTMLButtonElement | null;
  const playIcon = document.getElementById("play-icon") as HTMLElement | null;
  const delBtn = document.getElementById("delete-rec") as HTMLButtonElement | null;
  const timerEl = document.getElementById("timer") as HTMLElement | null;
  const errorEl = document.getElementById("audio-error") as HTMLElement | null;
  const successEl = document.getElementById("audio-success") as HTMLElement | null;
  const submitBtn = document.getElementById("submit-audio") as HTMLButtonElement | null;
  const submitText = document.getElementById("submit-audio-text") as HTMLElement | null;
  const recDot = document.getElementById("rec-dot") as HTMLElement | null;
  let mediaRecorder: MediaRecorder | null = null, chunks: Blob[] = [], audioUrl: string | null = null, timer: ReturnType<typeof setInterval> | null = null, duration = 0, audioEl: HTMLAudioElement | null = null;

  const fmt = (s: number) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

  if (!btn || !icon || !recDot) return;

  btn.addEventListener("click", async function () {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop(); if (timer) clearInterval(timer);
            setSvgContent(icon, '<path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z"/><path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482A1 1 0 017.516 6a5 5 0 00-.016 10z"/><path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z"/>');
      recDot.classList.replace("bg-red-500", "bg-accent"); recDot.classList.remove("animate-pulse"); if (playBtn) playBtn.disabled = false; return;
    }
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        const mt = ["audio/webm", "audio/mp3", "audio/wav", "audio/ogg"].find(function (t) { return MediaRecorder.isTypeSupported(t); }) || "audio/webm";
        mediaRecorder = new MediaRecorder(stream, { mimeType: mt }); chunks = []; duration = 0;
        mediaRecorder.ondataavailable = function (e) { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = function () {
          audioBlob = new Blob(chunks, { type: mt });
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          audioUrl = URL.createObjectURL(audioBlob);
          stream.getTracks().forEach(function (t) { t.stop(); });
          if (submitBtn) submitBtn.disabled = false;
        };
        mediaRecorder.start();
        setSvgContent(icon, '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>');
        recDot.classList.replace("bg-accent", "bg-red-500"); recDot.classList.add("animate-pulse"); if (playBtn) playBtn.disabled = true;
        timer = setInterval(function () {
          duration++; if (timerEl) timerEl.textContent = fmt(duration);
          if (duration >= 300) {
            mediaRecorder?.stop(); if (timer) clearInterval(timer);
      setSvgContent(icon, '<path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z"/><path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482A1 1 0 017.516 6a5 5 0 00-.016 10z"/><path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z"/>');
            recDot.classList.replace("bg-red-500", "bg-accent"); recDot.classList.remove("animate-pulse"); if (playBtn) playBtn.disabled = false;
          }
        }, 1000);
      }).catch(function () {
        if (errorEl) { errorEl.textContent = "Microphone access denied."; errorEl.classList.remove("hidden"); }
        btn.disabled = true;
      });
    } catch (e) {
      if (errorEl) { errorEl.textContent = "Microphone access denied."; errorEl.classList.remove("hidden"); }
      btn.disabled = true;
    }
  });

  if (playBtn) playBtn.addEventListener("click", function () {
    if (!audioUrl) return;
    if (!audioEl) { audioEl = new Audio(); audioEl.onended = function () { if (playIcon) setSvgContent(playIcon, '<path d="M8 5v14l11-7z"/>'); }; }
    audioEl.src = audioUrl; audioEl.play();
    if (playIcon) setSvgContent(playIcon, '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>');
  });

  if (delBtn) delBtn.addEventListener("click", function () {
    if (audioEl) { audioEl.pause(); audioEl.src = ""; }
    if (mediaRecorder && mediaRecorder.state === "recording") { mediaRecorder.stop(); if (timer) clearInterval(timer); }
    audioBlob = null;
    if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
    duration = 0;
    if (timerEl) timerEl.textContent = "00:00";
    setSvgContent(icon, '<path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z"/><path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482A1 1 0 017.516 6a5 5 0 00-.016 10z"/><path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z"/>');
    if (playIcon) setSvgContent(playIcon, '<path d="M8 5v14l11-7z"/>');
    if (playBtn) playBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "Submit Audio Idea";
    const desc = document.getElementById("audio-description") as HTMLTextAreaElement | null;
    if (desc) desc.value = "";
    if (successEl) successEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", async function () {
      if (!audioBlob) return;
      const desc = document.getElementById("audio-description") as HTMLTextAreaElement | null;
      const description = desc ? desc.value.trim() : "";
      if (successEl) successEl.classList.add("hidden");
      if (errorEl) errorEl.classList.add("hidden");
      if (submitText) submitText.textContent = "Uploading...";
      submitBtn.disabled = true;
      try {
        const result = await uploadAudio({ audioBlob, description: description || undefined });
        if (result.success) {
          audioBlob = null;
          if (successEl) {
            successEl.textContent = "Audio uploaded successfully!";
            successEl.classList.remove("hidden");
          }
          if (desc) desc.value = "";
          if (delBtn) delBtn.click();
        } else {
          throw new ApiError(0, undefined, result.message || "Upload failed.");
        }
      } catch (err) {
        if (errorEl) {
          if (err instanceof ApiError) {
            errorEl.textContent = err.message;
          } else if (err instanceof TypeError) {
            errorEl.textContent = "Unable to connect. Please check your internet connection.";
          } else {
            errorEl.textContent = err instanceof Error ? err.message : "Upload failed.";
          }
          errorEl.classList.remove("hidden");
        }
      } finally {
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = "Submit Audio Idea";
      }
    });
  }
}

export function initConsultForm(localeData: Record<string, unknown>): void {
  const form = document.getElementById("consult-form") as HTMLFormElement | null;
  if (!form) return;
  const t = (key: string): string => { const keys = key.split("."); let r: unknown = localeData; for (const k of keys) { if (!r) return key; r = (r as Record<string, unknown>)[k]; } return typeof r === "string" ? r : key; };

  const budgetBtns = document.querySelectorAll(".budget-btn");
  budgetBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      budgetBtns.forEach(function (b) { b.classList.remove("border-primary", "bg-primary/10", "text-primary", "font-bold"); b.classList.add("border-outline-variant", "text-on-surface", "hover:bg-surface/50", "hover:border-primary"); });
      btn.classList.remove("border-outline-variant", "text-on-surface", "hover:bg-surface/50", "hover:border-primary");
      btn.classList.add("border-primary", "bg-primary/10", "text-primary", "font-bold");
      const budgetInput = document.getElementById("c-budget") as HTMLInputElement | null;
      if (budgetInput) budgetInput.value = btn.textContent?.trim() || "";
    });
  });

  form.addEventListener("submit", function (e: Event) {
    e.preventDefault();
    const name = (document.getElementById("c-fullname") as HTMLInputElement | null)?.value.trim() || "";
    const company = (document.getElementById("c-company") as HTMLInputElement | null)?.value.trim() || "";
    const email = (document.getElementById("c-email") as HTMLInputElement | null)?.value.trim() || "";
    const problem = (document.getElementById("c-problem") as HTMLSelectElement | null)?.value || "";
    ["c-fullname", "c-company", "c-email", "c-problem"].forEach(function (id) { const el = document.getElementById(id + "-err"); if (el) el.classList.add("hidden"); });
    const consultError = document.getElementById("consult-error");
    if (consultError) consultError.classList.add("hidden");
    let valid = true;
    if (name.length < 2) { const el = document.getElementById("c-fullname-err"); if (el) el.classList.remove("hidden"); valid = false; }
    if (!company) { const el = document.getElementById("c-company-err"); if (el) el.classList.remove("hidden"); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { const el = document.getElementById("c-email-err"); if (el) el.classList.remove("hidden"); valid = false; }
    if (!problem) { const el = document.getElementById("c-problem-err"); if (el) el.classList.remove("hidden"); valid = false; }
    if (!valid) return;
    const data = {
      fullName: name, company: company, email: email,
      phone: (document.getElementById("c-phone") as HTMLInputElement | null)?.value.trim() || "",
      businessProblem: problem,
      projectGoals: (document.getElementById("c-goals") as HTMLTextAreaElement | null)?.value.trim() || "",
      budgetRange: (document.getElementById("c-budget") as HTMLInputElement | null)?.value || "",
    };
    const btnText = document.getElementById("consult-btn-text");
    const submitBtn = document.getElementById("consult-submit-btn") as HTMLButtonElement | null;
    if (btnText) btnText.textContent = t("pages.consulting.consultForm.submitting");
    if (submitBtn) submitBtn.disabled = true;
    submitConsultation(data)
      .then(function (_result) {
        const successEl = document.getElementById("consult-success");
        if (successEl) {
          successEl.textContent = t("pages.consulting.consultSuccess");
          successEl.classList.remove("hidden");
        }
        form.reset();
        budgetBtns.forEach(function (b) { b.classList.remove("border-primary", "bg-primary/10", "text-primary", "font-bold"); b.classList.add("border-outline-variant", "text-on-surface", "hover:bg-surface/50", "hover:border-primary"); });
        if (budgetBtns[1]) budgetBtns[1].classList.add("border-primary", "bg-primary/10", "text-primary", "font-bold");
      })
      .catch(function (err: unknown) {
        const errorEl = document.getElementById("consult-error");
        if (!errorEl) return;
        const resolved = resolveServerError(err, localeData, "consulting", CONSULT_VALIDATION_FIELD_MAP);
        if (resolved) {
          if (resolved.field) {
            const fieldEl = document.getElementById("c-" + resolved.field + "-err");
            if (fieldEl) {
              fieldEl.textContent = resolved.message;
              fieldEl.classList.remove("hidden");
            }
            return;
          }
          errorEl.textContent = resolved.message;
        } else {
          errorEl.textContent = err instanceof Error ? err.message : "Submission failed.";
        }
        errorEl.classList.remove("hidden");
      })
      .finally(function () {
        if (btnText) btnText.textContent = t("pages.consulting.consultForm.submit");
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

export function initContactForm(localeData: Record<string, unknown>): void {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  if (!form) return;
  const t = (key: string): string => { const keys = key.split("."); let r: unknown = localeData; for (const k of keys) { if (!r) return key; r = (r as Record<string, unknown>)[k]; } return typeof r === "string" ? r : key; };

  const dismissBtn = document.getElementById("contact-error-dismiss");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", function () {
      const errorEl = document.getElementById("contact-error");
      if (errorEl) errorEl.classList.add("hidden");
    });
  }

  form.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    let valid = true;
    const name = (document.getElementById("cnt-name") as HTMLInputElement | null)?.value || "";
    const email = (document.getElementById("cnt-email") as HTMLInputElement | null)?.value || "";
    const subject = (document.getElementById("cnt-subject") as HTMLInputElement | null)?.value || "";
    const message = (document.getElementById("cnt-message") as HTMLTextAreaElement | null)?.value || "";
    ["name", "email", "subject", "message"].forEach((id) => document.getElementById("cnt-" + id + "-err")?.classList.add("hidden"));
    document.getElementById("contact-error")?.classList.add("hidden");
    if (!name.trim()) { document.getElementById("cnt-name-err")?.classList.remove("hidden"); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById("cnt-email-err")?.classList.remove("hidden"); valid = false; }
    if (!subject.trim()) { document.getElementById("cnt-subject-err")?.classList.remove("hidden"); valid = false; }
    if (message.trim().length < 10) { document.getElementById("cnt-message-err")?.classList.remove("hidden"); valid = false; }
    if (!valid) return;
    try {
      const btn = document.getElementById("contact-submit-btn") as HTMLButtonElement | null;
      if (btn) { btn.disabled = true; btn.textContent = t("pages.contact.sending"); }
      const result = await submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      if (result.success) {
        const successEl = document.getElementById("contact-success");
        if (successEl) {
          successEl.textContent = t("pages.contact.success");
          successEl.classList.remove("hidden");
        }
        form.reset();
      } else {
        throw new ApiError(0, undefined, result.message);
      }
    } catch (err) {
      const errorEl = document.getElementById("contact-error");
      const errorText = document.getElementById("contact-error-text");
      if (!errorEl || !errorText) return;
      errorEl.classList.add("hidden");
      const resolved = resolveServerError(err, localeData, "contact", CONTACT_VALIDATION_FIELD_MAP);
      if (resolved) {
        if (resolved.field) {
          const fieldEl = document.getElementById("cnt-" + resolved.field + "-err");
          if (fieldEl) {
            fieldEl.textContent = resolved.message;
            fieldEl.classList.remove("hidden");
          }
          return;
        }
        errorText.textContent = resolved.message;
        if (err instanceof TypeError || (err instanceof ApiError && err.errorKey?.startsWith("NETWORK"))) {
          errorEl.className = "hidden mb-6 p-4 rounded-lg text-sm font-medium flex items-start gap-3 border border-amber-200 bg-amber-50 text-amber-800";
        } else if (err instanceof ApiError) {
          errorEl.className = "hidden mb-6 p-4 rounded-lg text-sm font-medium flex items-start gap-3 border border-orange-200 bg-orange-50 text-orange-800";
        } else {
          errorEl.className = "hidden mb-6 p-4 rounded-lg text-sm font-medium flex items-start gap-3 border border-red-200 bg-red-50 text-red-600";
        }
      } else {
        errorText.textContent = err instanceof Error ? err.message : t("pages.contact.failed");
        errorEl.className = "hidden mb-6 p-4 rounded-lg text-sm font-medium flex items-start gap-3 border border-red-200 bg-red-50 text-red-600";
      }
      errorEl.classList.remove("hidden");
    } finally {
      const btn = document.getElementById("contact-submit-btn") as HTMLButtonElement | null;
      if (btn) { btn.disabled = false; btn.textContent = t("pages.contact.sendMessage"); }
    }
  });
}
