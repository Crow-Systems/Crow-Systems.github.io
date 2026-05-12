// Audio recording controller
export function initAudioRecorder() {
  const btn = document.getElementById("record-btn");
  const icon = document.getElementById("record-icon");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("play-icon");
  const delBtn = document.getElementById("delete-rec");
  const timerEl = document.getElementById("timer");
  const errorEl = document.getElementById("audio-error");
  const successEl = document.getElementById("audio-success");
  const submitBtn = document.getElementById("submit-audio");
  const submitText = document.getElementById("submit-audio-text");
  const recDot = document.getElementById("rec-dot");
  let mediaRecorder = null, chunks = [], audioBlob = null, audioUrl = null, timer = null, duration = 0, audioEl = null;

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

  if (!btn) return;

  btn.addEventListener("click", async function () {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop(); clearInterval(timer);
      icon.innerHTML = '<path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z"/><path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482A1 1 0 017.516 6a5 5 0 00-.016 10z"/><path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z"/>';
      recDot.classList.replace("bg-red-500", "bg-accent"); recDot.classList.remove("animate-pulse"); playBtn.disabled = false; return;
    }
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        var mt = ["audio/webm","audio/mp3","audio/wav","audio/ogg"].find(function(t){return MediaRecorder.isTypeSupported(t);}) || "audio/webm";
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
        icon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
        recDot.classList.replace("bg-accent", "bg-red-500"); recDot.classList.add("animate-pulse"); playBtn.disabled = true;
        timer = setInterval(function () {
          duration++; timerEl.textContent = fmt(duration);
          if (duration >= 300) {
            mediaRecorder.stop(); clearInterval(timer);
            icon.innerHTML = '<path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z"/><path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482A1 1 0 017.516 6a5 5 0 00-.016 10z"/><path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z"/>';
            recDot.classList.replace("bg-red-500", "bg-accent"); recDot.classList.remove("animate-pulse"); playBtn.disabled = false;
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
    if (!audioEl) { audioEl = new Audio(); audioEl.onended = function () { if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; }; }
    audioEl.src = audioUrl; audioEl.play();
    if (playIcon) playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  });

  if (delBtn) delBtn.addEventListener("click", function () {
    if (audioEl) { audioEl.pause(); audioEl.src = ""; }
    if (mediaRecorder && mediaRecorder.state === "recording") { mediaRecorder.stop(); clearInterval(timer); }
    audioBlob = null;
    if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
    duration = 0;
    if (timerEl) timerEl.textContent = "00:00";
    icon.innerHTML = '<path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10a1 1 0 012 0 7 7 0 01-2.516 5.482 1 1 0 01-1.464-1.464A5 5 0 0019 10z"/><path d="M5 10a1 1 0 01-2 0 7 7 0 012.516-5.482A1 1 0 017.516 6a5 5 0 00-.016 10z"/><path d="M12 18a2 2 0 002-2v-1a2 2 0 00-4 0v1a2 2 0 002 2z"/>';
    if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    if (playBtn) playBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "Submit Audio Idea";
    const desc = document.getElementById("audio-description");
    if (desc) desc.value = "";
    if (successEl) successEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");
  });
}

// Consulting form handler
export function initConsultForm(localeData) {
  const form = document.getElementById("consult-form");
  if (!form) return;
  const t = (key) => { const keys = key.split("."); let r = localeData; for (const k of keys) { if (!r) return key; r = r[k]; } return typeof r === "string" ? r : key; };

  var budgetBtns = document.querySelectorAll(".budget-btn");
  budgetBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      budgetBtns.forEach(function (b) { b.classList.remove("border-primary","bg-primary/10","text-primary","font-bold"); b.classList.add("border-outline-variant","text-on-surface","hover:bg-surface/50","hover:border-primary"); });
      btn.classList.remove("border-outline-variant","text-on-surface","hover:bg-surface/50","hover:border-primary");
      btn.classList.add("border-primary","bg-primary/10","text-primary","font-bold");
      document.getElementById("c-budget").value = btn.textContent.trim();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("c-fullname").value.trim();
    var company = document.getElementById("c-company").value.trim();
    var email = document.getElementById("c-email").value.trim();
    var problem = document.getElementById("c-problem").value;
    ["c-fullname","c-company","c-email","c-problem"].forEach(function (id) { var el = document.getElementById(id + "-err"); if (el) el.classList.add("hidden"); });
    document.getElementById("consult-error").classList.add("hidden");
    var valid = true;
    if (name.length < 2) { document.getElementById("c-fullname-err").classList.remove("hidden"); valid = false; }
    if (!company) { document.getElementById("c-company-err").classList.remove("hidden"); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById("c-email-err").classList.remove("hidden"); valid = false; }
    if (!problem) { document.getElementById("c-problem-err").classList.remove("hidden"); valid = false; }
    if (!valid) return;
    var data = {
      fullName: name, company: company, email: email,
      phone: document.getElementById("c-phone").value.trim(),
      businessProblem: problem,
      projectGoals: document.getElementById("c-goals").value.trim(),
      budgetRange: document.getElementById("c-budget").value,
    };
    try {
      document.getElementById("consult-btn-text").textContent = t("pages.consulting.consultForm.submitting");
      document.getElementById("consult-submit-btn").disabled = true;
      var base = import.meta.env.VITE_API_BASE_URL || "https://crowsys.chrislabs.net/api/v1";
      fetch(base + "/consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (res) { return res.json(); })
        .then(function (result) {
          if (result.success) {
            document.getElementById("consult-success").textContent = t("pages.consulting.consultSuccess");
            document.getElementById("consult-success").classList.remove("hidden");
            document.getElementById("consult-form").reset();
            budgetBtns.forEach(function (b) { b.classList.remove("border-primary","bg-primary/10","text-primary","font-bold"); b.classList.add("border-outline-variant","text-on-surface","hover:bg-surface/50","hover:border-primary"); });
            budgetBtns[1].classList.add("border-primary","bg-primary/10","text-primary","font-bold");
          } else { throw new Error(result.message); }
        })
        .catch(function (err) {
          document.getElementById("consult-error").textContent = err.message || "Submission failed.";
          document.getElementById("consult-error").classList.remove("hidden");
        })
        .finally(function () {
          document.getElementById("consult-btn-text").textContent = t("pages.consulting.consultForm.submit");
          document.getElementById("consult-submit-btn").disabled = false;
        });
    } catch (err) {
      document.getElementById("consult-error").textContent = err.message || "Error.";
      document.getElementById("consult-error").classList.remove("hidden");
    }
  });
}

// Audio submit handler
export function initAudioSubmit(localeData) {
  const t = (key) => { const keys = key.split("."); let r = localeData; for (const k of keys) { if (!r) return key; r = r[k]; } return typeof r === "string" ? r : key; };
  const submitBtn = document.getElementById("submit-audio");
  const submitText = document.getElementById("submit-audio-text");
  const errorEl = document.getElementById("audio-error");
  const successEl = document.getElementById("audio-success");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let audioBlob = window._audioBlob || null;
    if (!audioBlob) { errorEl.textContent = t("pages.consulting.audioNoBlob"); errorEl.classList.remove("hidden"); return; }
    var desc = document.getElementById("audio-description").value;
    submitBtn.disabled = true;
    submitText.textContent = t("pages.consulting.uploading");
    var fd = new FormData();
    fd.append("audio", audioBlob, "rec_" + Date.now() + ".webm");
    if (desc) fd.append("description", desc);
    var base = import.meta.env.VITE_API_BASE_URL || "https://crowsys.chrislabs.net/api/v1";
    fetch(base + "/audio/upload", { method: "POST", body: fd })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          successEl.textContent = t("pages.consulting.audioSuccess");
          successEl.classList.remove("hidden");
          submitText.textContent = t("pages.consulting.submitted");
          setTimeout(function () { document.getElementById("delete-rec").click(); }, 3000);
        } else { throw new Error(data.message); }
      })
      .catch(function (err) {
        errorEl.textContent = err.message || t("pages.consulting.failed");
        errorEl.classList.remove("hidden");
        submitBtn.disabled = false;
        submitText.textContent = t("pages.consulting.submitAudio");
      });
  });
}

// Mobile menu toggle
export function initMobileMenu() {
  let menuOpen = false;
  const menu = document.getElementById("mobile-menu");
  document.getElementById("menu-btn")?.addEventListener("click", (e) => {
    e.stopPropagation(); menuOpen = !menuOpen;
    if (menuOpen) menu?.classList.remove("hidden"); else menu?.classList.add("hidden");
  });
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => { menuOpen = false; menu.classList.add("hidden"); });
  });
}

// Smooth scroll
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });
}

// Contact form handler
export function initContactForm(localeData) {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const t = (key) => { const keys = key.split("."); let r = localeData; for (const k of keys) { if (!r) return key; r = r[k]; } return typeof r === "string" ? r : key; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById("cnt-name").value;
    const email = document.getElementById("cnt-email").value;
    const subject = document.getElementById("cnt-subject").value;
    const message = document.getElementById("cnt-message").value;
    ["name","email","subject","message"].forEach((id) => document.getElementById("cnt-" + id + "-err")?.classList.add("hidden"));
    document.getElementById("contact-error")?.classList.add("hidden");
    if (!name.trim()) { document.getElementById("cnt-name-err").classList.remove("hidden"); valid = false; }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { document.getElementById("cnt-email-err").classList.remove("hidden"); valid = false; }
    if (!subject.trim()) { document.getElementById("cnt-subject-err").classList.remove("hidden"); valid = false; }
    if (message.trim().length < 10) { document.getElementById("cnt-message-err").classList.remove("hidden"); valid = false; }
    if (!valid) return;
    try {
      const btn = document.getElementById("contact-submit-btn");
      btn.disabled = true; btn.textContent = t("pages.contact.sending");
      const base = import.meta.env.VITE_API_BASE_URL || "https://crowsys.chrislabs.net/api/v1";
      const res = await fetch(`${base}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }) });
      const result = await res.json();
      if (result.success) {
        document.getElementById("contact-success").textContent = t("pages.contact.success");
        document.getElementById("contact-success").classList.remove("hidden");
        form.reset();
      } else { throw new Error(result.message); }
    } catch (err) {
      document.getElementById("contact-error").textContent = err.message || t("pages.contact.failed");
      document.getElementById("contact-error").classList.remove("hidden");
    } finally {
      const btn = document.getElementById("contact-submit-btn");
      btn.disabled = false; btn.textContent = t("pages.contact.sendMessage");
    }
  });
}