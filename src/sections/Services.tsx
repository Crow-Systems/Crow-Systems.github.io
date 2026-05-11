import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getServiceIcon } from '../../data/services';
import { SectionWrapper } from '../layout/SectionWrapper';
import type { Service } from '../../types';

export function ServicesSection() {
  const { SERVICES } = require('../../data/services') as { SERVICES: Service[] };

  return (
    <SectionWrapper id="services" title="Our Services" subtitle="What We Offer">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service: Service, index: number) => (
          <Card key={index} hover>
            <div className="w-12 h-12 flex items-center justify-center bg-accent/10 text-accent mb-6 rounded-lg">
              {getServiceIcon(service.icon, 'text-4xl')}
            </div>
            <h3 className="font-heading text-2xl font-bold text-on-surface mb-4">{service.title}</h3>
            <p className="text-on-surface-variant mb-8 flex-grow font-body leading-relaxed text-sm">
              {service.description}
            </p>
            <Button variant="outline" size="sm">
              {service.cta} <span className="ml-2">→</span>
            </Button>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}