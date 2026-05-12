import { Card } from '../components/ui/Card';
import { SectionWrapper } from '../components/layout/SectionWrapper';

export function ConsultingSection() {
  return (
    <SectionWrapper id="consulting" title="Start a Consultation" subtitle="Consulting Request">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card hover className="p-8">
            <h3 className="font-heading text-xl font-bold mb-6 text-on-surface">Schedule a Consultation</h3>
            <p className="text-on-surface-variant font-body mb-6 leading-relaxed text-sm">
              Submit your consulting request below. Our team of specialized engineers will review it and get back to you within 4 business hours to schedule a discovery call. Whether you need secure system communications, scalable architecture, or expert technical guidance — we provide the engineering expertise to move your business forward.
            </p>
            <div id="consult-error" className="hidden mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium" role="alert"></div>
            <div id="consult-success" className="hidden mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium font-bold" role="status"></div>
            <form id="consult-form" className="space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input id="c-fullname" type="text" placeholder="Full Name *" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                <p className="hidden text-xs text-red-500 mt-1" id="c-fullname-err">Name must be at least 2 characters</p>
                <input id="c-company" type="text" placeholder="Company *" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                <p className="hidden text-xs text-red-500 mt-1" id="c-company-err">Company name is required</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input id="c-email" type="email" placeholder="Email *" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                <p className="hidden text-xs text-red-500 mt-1" id="c-email-err">Valid email required</p>
                <input id="c-phone" type="tel" placeholder="Phone (optional)" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <select id="c-problem" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm">
                <option value="">Business Problem *</option>
                <option>Technical Complexity Reduction</option>
                <option>Digital Transformation</option>
                <option>Infrastructure Modernization</option>
                <option>Technical Debt Reduction</option>
                <option>Infrastructure Scaling</option>
                <option>Software Architecture &amp; Development</option>
                <option>Other</option>
              </select>
              <p className="hidden text-xs text-red-500 mt-1" id="c-problem-err">Please select a business problem</p>
              <textarea id="c-goals" rows={3} placeholder="Project Goals (optional)" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-body text-sm"></textarea>
              <select id="c-budget" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm">
                <option value="">Budget Range (optional)</option>
                <option>$10k - $25k</option>
                <option>$25k - $50k</option>
                <option>$50k - $100k</option>
                <option>$100k+</option>
              </select>
              <button type="submit" id="consult-submit-btn" className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <span id="consult-btn-text">Submit Consulting Request</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
              </button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card hover className="p-8">
            <h4 className="font-heading text-lg font-bold mb-6 text-on-surface">The Crow Engagement Method</h4>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Triage', desc: 'Our lead architects review your submission within 4 business hours.' },
                { step: '02', title: 'Discovery', desc: 'A 30-minute call to align on constraints, goals, and KPIs.' },
                { step: '03', title: 'Proposal', desc: 'A comprehensive roadmap with fixed-fee options delivered within 48 hours.' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 font-bold text-sm">{item.step}</div>
                  <div>
                    <p className="text-on-surface font-bold text-sm">{item.title}</p>
                    <p className="text-on-surface-variant text-sm mt-1 font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card hover className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                <img alt="Marcus Thorne" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" />
              </div>
              <div>
                <p className="font-bold text-on-surface">Marcus Thorne</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Managing Partner, Crow Systems</p>
              </div>
            </div>
            <blockquote className="italic text-on-surface-variant text-sm leading-relaxed border-l-2 border-primary/30 pl-4">
              &ldquo;We built this intake system to capture the &lsquo;why&rsquo; behind the problem. Audio allows us to hear the priorities that spreadsheets often hide.&rdquo;
            </blockquote>
          </Card>

          <Card className="p-8 bg-surface/50">
            <h4 className="font-heading text-lg font-bold mb-4 text-on-surface">Office Hours</h4>
            <div className="space-y-3 text-sm text-on-surface-variant font-body">
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <div>
                  <p className="font-medium text-sm text-on-surface">Mon &ndash; Fri: 9:00 AM &ndash; 6:00 PM</p>
                  <p className="text-xs text-on-surface-variant">Saturday: By appointment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                <p className="text-on-surface-variant text-sm">Local, Regional, Remote &amp; International consulting</p>
              </div>
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" /></svg>
                <p className="text-on-surface-variant text-sm">consulting@crowsys.chrislabs.net</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}