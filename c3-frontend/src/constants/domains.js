import { Code, Cloud, Cpu, Shield, MessageSquare } from 'lucide-react';

export const DOMAINS = [
  {
    value: 'full-stack-web-dev',
    label: 'Full-Stack Web Dev',
    icon: Code,
    color: 'primary',
    description: 'React, Node.js, Express, MongoDB, REST APIs, and cloud deployment pipelines.',
  },
  {
    value: 'cloud-devops',
    label: 'Cloud & DevOps',
    icon: Cloud,
    color: 'accent',
    description: 'Docker, CI/CD pipelines, AWS fundamentals, and Linux system administration.',
  },
  {
    value: 'ai-ml',
    label: 'AI & Machine Learning',
    icon: Cpu,
    color: 'success',
    description: 'Python data processing, neural networks, PyTorch, and applied AI integration.',
  },
  {
    value: 'cybersecurity',
    label: 'Cybersecurity & Networks',
    icon: Shield,
    color: 'warning',
    description: 'Network protocols, OWASP web security, ethical hacking basics, and cryptography.',
  },
  {
    value: 'public-speaking',
    label: 'Public Speaking & Corporate Communication',
    icon: MessageSquare,
    color: 'primary',
    description: 'Stage presence, technical presentation delivery, and mock interview practice.',
  },
];

export const DOMAIN_OPTIONS = DOMAINS.map((d) => ({ value: d.value, label: d.label }));