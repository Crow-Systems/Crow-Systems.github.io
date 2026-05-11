import type { HeroSectionData, Stat, Service, TeamMember, SectionConfig } from '@/types'

export const HERO_DATA: HeroSectionData = {
  badge: 'SME Technology Excellence',
  headline: 'Technology Solutions for {0}Growing{1} Businesses',
  subheadline:
    'We help small and medium-sized companies improve operations, modernize systems, and solve technology challenges without unnecessary complexity.',
  primaryCta: 'Request Consulting',
  secondaryCta: 'Our Services',
  imageAlt:
    'A clean, high-tech corporate office environment featuring a sleek glass boardroom table and ergonomic seating. The lighting is cool and professional, with deep navy and electric blue ambient highlights throughout the space.',
  imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwQ1yeNWKRlZzi8mhYataYpNFSZCzjG1nYAhYp6yzlcESfRdtz5-aTd4h3jb5owA8ANA4T08rkkdt_aFSZQa-FytaYFj7T7aXwwQADIl-Xh5gHl9OLGHvJa2zQQWQLAu8GNd_ea8isvGKNtLGP3IH1rleiFaUhzeQau26V7JfCMdy7oLkuCH5WLChcmvF1RO8VZrSXk8dDm9XSLF3s8dChQvR7KVUFDUBEKCyRfefBn_3LKhGSwsbR-uB-qhpQ0q_t9J2YsWS6Sys',
}

export const STATS: Stat[] = [
  {
    value: '99.9%',
    label: 'System Uptime',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwQ1yeNWKRlZzi8mhYataYpNFSZCzjG1nYAhYp6yzlcESfRdtz5-aTd4h3jb5owA8ANA4T08rkkdt_aFSZQa-FytaYFj7T7aXwwQADIl-Xh5gHl9OLGHvJa2zQQWQLAu8GNd_ea8isvGKNtLGP3IH1rleiFaUhzeQau26V7JfCMdy7oLkuCH5WLChcmvF1RO8VZrSXk8dDm9XSLF3s8dChQvR7KVUFDUBEKCyRfefBn_3LKhGSwsbR-uB-qhpQ0q_t9J2YsWS6Sys',
  },
  {
    value: '240+',
    label: 'Projects Completed',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwQ1yeNWKRlZzi8mhYataYpNFSZCzjG1nYAhYp6yzlcESfRdtz5-aTd4h3jb5owA8ANA4T08rkkdt_aFSZQa-FytaYFj7T7aXwwQADIl-Xh5gHl9OLGHvJa2zQQWQLAu8GNd_ea8isvGKNtLGP3IH1rleiFaUhzeQau26V7JfCMdy7oLkuCH5WLChcmvF1RO8VZrSXk8dDm9XSLF3s8dChQvR7KVUFDUBEKCyRfefBn_3LKhGSwsbR-uB-qhpQ0q_t9J2YsWS6Sys',
  },
  {
    value: '15',
    label: 'Senior Engineers',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwQ1yeNWKRlZzi8mhYataYpNFSZCzjG1nYAhYp6yzlcESfRdtz5-aTd4h3jb5owA8ANA4T08rkkdt_aFSZQa-FytaYFj7T7aXwwQADIl-Xh5gHl9OLGHvJa2zQQWQLAu8GNd_ea8isvGKNtLGP3IH1rleiFaUhzeQau26V7JfCMdy7oLkuCH5WLChcmvF1RO8VZrSXk8dDm9XSLF3s8dChQvR7KVUFDUBEKCyRfefBn_3LKhGSwsbR-uB-qhpQ0q_t9J2YsWS6Sys',
  },
  {
    value: '24/7',
    label: 'Support Available',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwQ1yeNWKRlZzi8mhYataYpNFSZCzjG1nYAhYp6yzlcESfRdtz5-aTd4h3jb5owA8ANA4T08rkkdt_aFSZQa-FytaYFj7T7aXwwQADIl-Xh5gHl9OLGHvJa2zQQWQLAu8GNd_ea8isvGKNtLGP3IH1rleiFaUhzeQau26V7JfCMdy7oLkuCH5WLChcmvF1RO8VZrSXk8dDm9XSLF3s8dChQvR7KVUFDUBEKCyRfefBn_3LKhGSwsbR-uB-qhpQ0q_t9J2YsWS6Sys',
  },
]

export const SERVICES: Service[] = [
  {
    id: 'systems-consulting',
    slug: 'systems-consulting',
    icon: 'hub',
    title: 'Systems Consulting',
    description:
      'Audit and optimize your internal workflows to reduce operational friction and eliminate technical silos across departments.',
    features: [
      'Workflow Optimization',
      'Technical Debt Assessment',
      'Process Automation',
      'Cross-Department Integration',
    ],
    cta: 'Learn More',
  },
  {
    id: 'it-infrastructure',
    slug: 'it-infrastructure',
    icon: 'dns',
    title: 'IT Infrastructure',
    description:
      'Build resilient, scalable network foundations that ensure 99.9% uptime and enterprise-grade security for your critical data.',
    features: [
      'Cloud Migration',
      'Network Architecture',
      'Security Hardening',
      'Disaster Recovery',
    ],
    cta: 'Learn More',
  },
  {
    id: 'software-solutions',
    slug: 'software-solutions',
    icon: 'terminal',
    title: 'Software Solutions',
    description:
      'Custom-engineered software tools designed to solve specific bottlenecks, allowing your team to focus on high-value output.',
    features: [
      'Custom Application Development',
      'API Integration',
      'Legacy System Modernization',
      'DevOps Pipeline Setup',
    ],
    cta: 'Learn More',
  },
  {
    id: 'technical-strategy',
    slug: 'technical-strategy',
    icon: 'architecture',
    title: 'Technical Strategy',
    description:
      'Align your technology roadmap with long-term business growth to future-proof your organization against market shifts.',
    features: [
      'Technology Roadmap Planning',
      'Architecture Review',
      'Vendor Evaluation',
      'Scalability Planning',
    ],
    cta: 'Learn More',
  },
  {
    id: 'digital-transformation',
    slug: 'digital-transformation',
    icon: 'database',
    title: 'Digital Transformation',
    description:
      'Modernize legacy systems and integrate advanced data analytics to drive informed, evidence-based decision making.',
    features: [
      'Legacy System Migration',
      'Data Analytics Integration',
      'Enterprise Digital Twin',
      'Change Management',
    ],
    cta: 'Learn More',
  },
  {
    id: 'automation-consulting',
    slug: 'automation-consulting',
    icon: 'smart_robot',
    title: 'Automation Consulting',
    description:
      'Save time through automation of repetitive tasks, significantly increasing your operational velocity and reducing human error.',
    features: [
      'RPA Implementation',
      'Workflow Automation',
      'CI/CD Pipeline Design',
      'AI-Assisted Operations',
    ],
    cta: 'Learn More',
  },
]

export const TEAM: TeamMember[] = [
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    role: 'Chief Systems Architect',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMo12FQgoP9jtiEcLLn84XixBgwkCdX7iQbY6LjkMhG0cvH5CAspfOw7pKDwEgEe9IjDh6-UlyfWFdDD2kOtWiTnbx1wZ4CslkZbLbTvS6ojHtMzlukOcDmH7XsAE5J89DG_DXYYPU_1mrfKuPe_DRNmI4ZY_Ub0MPDOPjB2Cvvb9D7LMcIyHzOIPtb7CNj6SzgwgJlFqhwmociLlZp16Ih3o8nvGlpyqreEDPI565FE9r-uilMbHR8Kd0eDss70Nt5CZN8REUJ7M',
  },
  {
    id: 'elena',
    name: 'Elena Vance',
    role: 'Director of Strategy',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlBzk5DW80vn34LIRxaVh2ijPDpdlNCaerqVMB5JsfBAUXB0KJLpjC_VChGbI1HlGHICH8R3o47ZX3sZSZewvhCOZ7PkXjp-xFzde3B3tCyWITxWGoaotNRzI8qAQinXzV_Cl_LvVAbJaTuVTMWPDBXOutJgoih8P8RaggUpOw27Q7NpRuXw8UdZB5e63zQJ9qLYWZtBpSXngwts6uAg9I-IYf0XNwco_EER5MGdSXxkgIkROfHrIO-FCqV0AMCbs3WHS-Xh6fXo',
  },
  {
    id: 'julian',
    name: 'Julian Chen',
    role: 'Lead Data Scientist',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA44Un_z6YgKWDRPtW3rAgXyUj2WlZQr2KxleEDFJLXpCPL2G5RWhda2PyiUmt66uWqTn13C1d1_uysRu3UMYYjlOtDw_KeLSomO7x-afH6nseWdbA-ZUObfJzLxtbKsoRWNs_euzTUoE3N5dAZxWpP32XbOmCjpCx2XlBfGcQoFftjQdaxWVWwi23Bn3rJ8h19nO0C5tkkC8uQmmO3YvCq3TcFeWnQnwtzfulRG2WUTujSoXXt1pR52ovMc28_1KpHIGN6jtiPf0c',
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    role: 'Operations Lead',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUc0KWLh5yV3egpvx9TCkSlzPmLpdq462ofxWiOaR_yToXEH2GOegSBVv3wL9xGCFmUtZMLOkMIm4GoJGK3zTcTuUMsRHNLQoQ4V1o8zTPfk8w-75-IL_UfDUUBT_hPtvHTv46qpozMFTFwCrbho2Ctlp4sm3r7u3wp9BBS66nhDVNeVjOrFaG_HJASuTSXffzg8L3MWhkaW8pquA_QwpOBf_QQUEeygS1jz2hN9I8P1aBzRCLpXE4n4r6jfYMu4MDt2K7wWq4upQ',
  },
]

export const SECTIONS: SectionConfig[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'consulting', label: 'Consulting', href: '#consulting' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const PRIVACY_POLICY_URL = '#'
export const TERMS_URL = '#'