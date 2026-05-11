import React from 'react';
import { Service } from '../types';

const ICON_MAP: Record<string, React.JSX.Element> = {
  hub: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
      <path d="M7.05 7.05 12 12l-4.95 4.95" /><path d="M16.95 16.95 12 12l4.95-4.95" /><path d="M16.95 7.05 12 12l4.95 4.95" /><path d="M7.05 16.95 12 12l-4.95-4.95" />
    </svg>
  ),
  dns: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  terminal: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="10" y1="19" x2="20" y2="19" />
    </svg>
  ),
  architecture: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  database: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  robot_2: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="3" /><path d="M8 8l0-4" /><path d="M16 8l0-4" /><path d="M12 16v3" />
    </svg>
  ),
  rocket_launch: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2-2-3.5-2-5.5" /><path d="m13.5 3-1 2 1 2" /><path d="m16.5 9-2 1 2 1" /><path d="m15 5-2 6-4 1" />
      <path d="M21.24 15a9 9 0 0 0-9.24-9 9 9 0 0 0-9.24 9" /><path d="M8.69 19c.26.66.77 1.19 1.31 1.54" /><path d="M13.31 19c-.55.35-1.05.88-1.31 1.54" />
    </svg>
  ),
  security: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="m12 12 4-2 4 2v4H8v-4l4-2z" />
    </svg>
  ),
  mic: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="8" /><path d="M8 6V4a4 4 0 0 1 8 0v2" /><rect x="4" y="10" width="16" height="11" rx="2" />
    </svg>
  ),
};

export function getServiceIcon(iconKey: string, className?: string): React.JSX.Element | null {
  const icon = ICON_MAP[iconKey];
  if (!icon) return null;
  if (className) {
    return React.cloneElement(icon, { className });
  }
  return icon;
}

export const SERVICES: Service[] = [
  {
    icon: 'hub',
    title: 'Systems Consulting',
    description: 'We audit and optimize your technology infrastructure to reduce operational friction and eliminate technical silos across departments.',
    fullDescription: 'Our Systems Consulting service provides a comprehensive analysis of your existing technology infrastructure, workflows, and operational processes. We identify bottlenecks, redundancies, and misalignments that hinder productivity, then deliver actionable roadmaps to streamline operations. Whether you are dealing with legacy systems, fragmented tools, or disconnected departments, we bring clarity and structure to complex environments.',
    features: [
      'Comprehensive technology stack audit',
      'Workflow mapping and process optimization',
      'Cross-departmental integration strategy',
      'Vendor evaluation and consolidation',
      'Custom reporting and KPI dashboards',
    ],
    idealFor: 'Growing businesses experiencing operational friction, duplicated efforts across teams, or those relying on outdated manual processes that no longer scale.',
    technologies: ['Enterprise Architecture', 'Process Mining', 'API Integration', 'Cloud Migration', 'DevOps Practices'],
    cta: 'Learn More',
  },
  {
    icon: 'dns',
    title: 'IT Infrastructure',
    description: 'We build resilient, scalable network foundations that ensure reliable uptime and enterprise-grade security for your critical data.',
    fullDescription: 'Reliable infrastructure is the backbone of any modern business. Our IT Infrastructure services cover everything from network design and server architecture to cloud provisioning and disaster recovery. We architect solutions that are resilient, scalable, and cost-effective — ensuring your systems stay operational even under peak demand. We focus on building foundations that grow with your business, not against it.',
    features: [
      'Network architecture design and optimization',
      'Cloud infrastructure provisioning (AWS, Azure, GCP)',
      'Disaster recovery and business continuity planning',
      'Server and database administration',
      '24/7 monitoring and proactive alerting',
    ],
    idealFor: 'Businesses that depend on always-on systems, handle sensitive data, or are scaling infrastructure to meet growing demand.',
    technologies: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Linux Administration'],
    cta: 'Learn More',
  },
  {
    icon: 'terminal',
    title: 'Software Solutions',
    description: 'Custom-engineered software tools designed to solve specific bottlenecks, allowing your team to focus on high-value output.',
    fullDescription: 'Off-the-shelf software often creates more problems than it solves. Our Software Solutions team designs and builds custom applications tailored to your exact workflows and business rules. From internal tools and dashboards to customer-facing platforms and automated pipelines, we engineer solutions that fit like a glove. Every line of code is written with maintainability, performance, and your long-term goals in mind.',
    features: [
      'Custom web and mobile application development',
      'Internal tooling and automation scripts',
      'API design and integration layer development',
      'Legacy application modernization',
      'Performance optimization and code auditing',
    ],
    idealFor: 'Teams with unique workflows that generic software cannot address, or organizations looking to replace brittle legacy tools.',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Python'],
    cta: 'Learn More',
  },
  {
    icon: 'architecture',
    title: 'Technical Strategy',
    description: 'We align your technology roadmap with long-term business growth to future-proof your organization against market shifts.',
    fullDescription: 'Technology decisions made today will shape your business capabilities for years to come. Our Technical Strategy service helps leadership teams make informed, future-proof decisions about architecture, tooling, and investment priorities. We translate business goals into technical plans, evaluate trade-offs clearly, and create phased roadmaps that balance speed with sustainability. No vendor lock-in, no hype — just sound engineering judgment.',
    features: [
      'Technology stack evaluation and recommendations',
      'Architecture review and design advisory',
      'Technical debt assessment and prioritization',
      'Scalability and performance forecasting',
      'Vendor and open-source selection guidance',
    ],
    idealFor: 'CTOs, VPs of Engineering, and growth-stage companies navigating complex technology decisions without in-house senior expertise.',
    technologies: ['System Design', 'Microservices', 'Event-Driven Architecture', 'Data Strategy', 'Platform Engineering'],
    cta: 'Learn More',
  },
  {
    icon: 'database',
    title: 'Digital Transformation',
    description: 'We modernize legacy systems and integrate advanced data analytics to drive informed, evidence-based decision making.',
    fullDescription: 'Digital transformation is not about replacing everything — it is about strategically modernizing the right systems to unlock measurable business value. We help organizations migrate from legacy platforms to modern architectures, integrate data silos into unified analytics environments, and implement tools that empower teams with real-time insights. Our approach ensures continuity while accelerating your move toward a data-driven operating model.',
    features: [
      'Legacy system modernization and migration',
      'Data warehouse and lake architecture',
      'Business intelligence and analytics dashboards',
      'Process automation and workflow digitization',
      'Change management and team training',
    ],
    idealFor: 'Established businesses with aging systems looking to modernize operations, unlock data insights, and improve decision-making speed.',
    technologies: ['ETL Pipelines', 'dbt', 'Looker', 'Apache Airflow', 'Snowflake'],
    cta: 'Learn More',
  },
  {
    icon: 'robot_2',
    title: 'Automation Consulting',
    description: 'We automate repetitive tasks to significantly increase your operational velocity and reduce human error.',
    fullDescription: 'Repetitive manual processes are silent killers of productivity and morale. Our Automation Consulting service identifies high-impact opportunities to eliminate manual work through intelligent automation. From CI/CD pipelines and infrastructure-as-code to robotic process automation and scheduled data workflows, we build systems that free your team to focus on creative, strategic work that actually moves the needle.',
    features: [
      'CI/CD pipeline design and implementation',
      'Infrastructure as Code (IaC) adoption',
      'Robotic Process Automation (RPA)',
      'Scheduled data processing and ETL automation',
      'Automated testing and quality assurance',
    ],
    idealFor: 'Operations-heavy teams spending excessive time on repetitive tasks, deployment-heavy engineering teams, or businesses preparing to scale without proportional headcount growth.',
    technologies: ['GitHub Actions', 'Terraform', 'Ansible', 'Python Scripting', 'Jenkins'],
    cta: 'Learn More',
  },
];

export const STEPS = [
  { number: '01', title: 'Triage', description: 'Our lead architects review your submission within 1 business hour.' },
  { number: '02', title: 'Discovery', description: 'A 30-minute call to align on constraints, goals, and KPIs.' },
  { number: '03', title: 'Proposal', description: 'A comprehensive roadmap with fixed-fee options delivered within 48 hours.' },
];

export const STATS = [
  { value: '99%', label: 'System Uptime', desc: 'Reliable infrastructure you can count on' },
  { value: '< 1hr', label: 'Initial Triage', desc: 'During business hours, 8AM–6PM PDT' },
  { value: 'Senior Only', label: 'Engineering Team', desc: 'No juniors, no handoffs, no compromises' },
  { value: 'Zero Lock-In', label: 'Your IP, Always', desc: 'Your code, your stack, no vendor dependencies' },
];