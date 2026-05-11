import { Card } from '../ui/Card';
import { SectionWrapper } from '../layout/SectionWrapper';

export function AboutSection() {
  return (
    <SectionWrapper id="about" title="Who We Are" subtitle="About Crow Systems">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high">
            <img alt="Crow Systems Team" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">Technology Consulting</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-on-surface mb-4">Making Professional Technology Consulting Accessible</h2>
            <p className="text-on-surface-variant leading-relaxed font-body text-lg">
              Crow Systems is a technology consulting company focused on helping micro, small, and medium-sized businesses modernize operations, improve efficiency, and solve real-world technology challenges. We believe technology should simplify business operations — not make them more complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
              </div>
              <h4 className="font-heading text-lg font-bold mb-2 text-on-surface">Our Mission</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">To make professional technology consulting accessible, practical, and valuable for growing businesses. We help organizations adopt smarter systems and implement scalable solutions without unnecessary complexity.</p>
            </Card>
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h4 className="font-heading text-lg font-bold mb-2 text-on-surface">Our Vision</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">To become a trusted long-term technology partner for businesses seeking clarity, reliability, and sustainable digital growth — bringing enterprise-quality strategy to growing businesses.</p>
            </Card>
          </div>

          <Card hover className="p-6">
            <h4 className="font-heading text-lg font-bold mb-4 text-on-surface">What We Do</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Systems Consulting', 'Operational Technology Strategy', 'IT Infrastructure Guidance', 'Software Solution Planning', 'Automation Consulting', 'Digital Transformation Support', 'Workflow Optimization', 'Technical Advisory Services'].map((service, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                  {service}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-heading text-sm font-bold text-on-surface mb-2">Our Approach</h5>
                <ul className="space-y-1 text-sm text-on-surface-variant font-body">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Clear communication</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Practical implementation</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Reliable technology decisions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-heading text-sm font-bold text-on-surface mb-2">Why Businesses Choose Us</h5>
                <ul className="space-y-1 text-sm text-on-surface-variant font-body">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Explain technology clearly</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Focus on operational results</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Deliver practical recommendations</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}