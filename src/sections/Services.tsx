import { Card } from '../components/ui/Card';
import { SectionWrapper } from '../components/layout/SectionWrapper';
import { getServiceIcon, SERVICES } from '../data/services';
import type { Service } from '../types';

export function ServicesSection() {
  return (
    <SectionWrapper id="services" title="Our Services" subtitle="What We Offer">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service: Service, index: number) => (
          <Card key={index} hover className="flex flex-col">
            <div className="w-12 h-12 flex items-center justify-center bg-accent/10 text-accent mb-6 rounded-lg">
              {getServiceIcon(service.icon, 'text-4xl')}
            </div>
            <h3 className="font-heading text-2xl font-bold text-on-surface mb-4">{service.title}</h3>
            <p className="text-on-surface-variant mb-6 flex-grow font-body leading-relaxed text-sm">
              {service.description}
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-2 text-primary font-bold text-sm mt-auto hover:text-accent transition-colors"
            >
              {service.cta} <span className="ml-1">→</span>
            </a>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}