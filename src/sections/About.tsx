import { Card } from '../ui/Card';
import { SectionWrapper } from '../layout/SectionWrapper';

export function AboutSection() {
  return (
    <SectionWrapper id="about" title="About Us" subtitle="Our Story">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high">
            <img alt="Crow Systems Team" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">Who We Are</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Precision-Focused Consulting for the Modern Enterprise
            </h2>
            <p className="text-on-surface-variant leading-relaxed font-body text-lg">
              Founded with a mission to bridge the gap between complex technical infrastructure and strategic business objectives,
              Crow Systems delivers operational confidence to SMEs worldwide. We don&apos;t just advise — we engineer resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'rocket_launch', title: 'Mission', text: 'To provide SMEs with the technical blueprints and strategic foresight required to dominate their respective markets through precision engineering.' },
              { icon: 'visibility', title: 'Vision', text: 'To become the global gold standard for operational confidence, turning technical complexity into a competitive advantage.' },
              { icon: 'shield_with_heart', title: 'Core Values', text: 'Radical Transparency, Mathematical Precision, and Future-Proof Thinking guide every engagement.' },
            ].map((item: any, i: number) => (
              <Card key={i} hover className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {getIconByName(item.icon)}
                </div>
                <h4 className="font-heading text-xl font-bold mb-2 text-on-surface">{item.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed font-body">{item.text}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {['Aerospace', 'Fintech', 'Data Science', 'Cloud Ops'].map((domain, i) => (
              <div key={i} className="text-center p-4 bg-surface-container/50 rounded-lg border border-outline-variant/30">
                <p className="font-heading font-bold text-sm text-primary">{domain}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function getIconByName(name: string): React.JSX.Element {
  switch (name) {
    case 'rocket_launch':
      return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2-2-3.5-2-5.5" /><path d="m13.5 3-1 2 1 2" /><path d="m16.5 9-2 1 2 1" /><path d="m15 5-2 6-4 1" /><path d="M21.24 15a9 9 0 0 0-9.24-9 9 9 0 0 0-9.24 9" /><path d="M8.69 19c.26.66.77 1.19 1.31 1.54" /><path d="M13.31 19c-.55.35-1.05.88-1.31 1.54" /></svg>;
    case 'visibility':
      return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'shield_with_heart':
      return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c1.56 0 3.04.84 4 2.05A11.5 11.5 0 0 1 12 6a11.5 11.5 0 0 1 4 2.95A2.99 2.99 0 0 1 19 6a1 1 0 0 1 1 1z" /><path d="M9 13h6" /><path d="M12 16v-3" /></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>;
  }
}