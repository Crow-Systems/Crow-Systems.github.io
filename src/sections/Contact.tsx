import { useState } from 'react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Card } from '../ui/Card';

export function ContactSection() {
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const validateForm = (): { name: string; email: string; subject: string; message: string } | null => {
    const name = (document.getElementById('cnt-name') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('cnt-email') as HTMLInputElement)?.value || '';
    const subject = (document.getElementById('cnt-subject') as HTMLInputElement)?.value || '';
    const message = (document.getElementById('cnt-message') as HTMLTextAreaElement)?.value || '';

    ['cnt-name', 'cnt-email', 'cnt-subject', 'cnt-message'].forEach(id => {
      const el = document.getElementById(id + '-err');
      if (el) el.classList.add('hidden');
    });
    const errEl = document.getElementById('contact-error');
    if (errEl) errEl.classList.add('hidden');

    let valid = true;
    if (!name.trim()) { const e = document.getElementById('cnt-name-err'); if (e) { e.classList.remove('hidden'); } valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { const e = document.getElementById('cnt-email-err'); if (e) { e.classList.remove('hidden'); } valid = false; }
    if (!subject.trim()) { const e = document.getElementById('cnt-subject-err'); if (e) { e.classList.remove('hidden'); } valid = false; }
    if (message.trim().length < 10) { const e = document.getElementById('cnt-message-err'); if (e) { e.classList.remove('hidden'); } valid = false; }
    return valid ? { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() } : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = validateForm();
    if (!data) return;

    try {
      const btn = document.getElementById('contact-submit-btn');
      if (btn) { btn.textContent = 'Sending...'; btn.setAttribute('disabled', 'true'); }
      const base = import.meta.env.VITE_API_BASE_URL || 'https://crowsys.chrislabs.net/api/v1';
      const res = await fetch(`${base}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setServerSuccess('Thank you! Your message has been sent. We will get back to you soon.');
        setServerError('');
        (document.getElementById('contact-form') as HTMLFormElement)?.reset();
      } else { throw new Error(result.message); }
    } catch (err: any) {
      setServerError(err.message || 'Submission failed. Please try again.');
      setServerSuccess('');
    } finally {
      const btn = document.getElementById('contact-submit-btn');
      if (btn) { btn.removeAttribute('disabled'); btn.textContent = 'Send Message'; }
    }
  };

  return (
    <div className="lg:col-span-7">
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium" role="alert">
          {serverError}
        </div>
      )}
      {serverSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium" role="status">
          {serverSuccess}
        </div>
      )}
      <form id="contact-form" className="bg-surface-container-lowest p-8 md:p-12 rounded-xl border border-outline-variant/30 shadow-sm space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" required id="cnt-name" />
          <Input label="Email" type="email" required id="cnt-email" />
        </div>
        <Input label="Subject" required id="cnt-subject" />
        <TextArea label="Message" required rows={5} id="cnt-message" />
        <button type="submit" id="contact-submit-btn" className="w-full bg-primary text-on-primary font-bold py-5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Send Message</button>
      </form>
    </div>
  );
}