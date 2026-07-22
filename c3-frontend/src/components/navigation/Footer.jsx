import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Mail, Heart, Globe } from 'lucide-react';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050E18] text-[#94A3B8] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <span className="font-heading font-extrabold text-lg text-[#F8FAFC]">
                CAMPUS<span className="text-[#38BDF8]">2</span>CORPORATE
              </span>
            </Link>
            <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed">
              Bridging the gap between academic education and industry engineering standards through peer learning, daily technical sessions, and hands-on execution.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="p-2 rounded-lg bg-[#10273D] hover:bg-[#16324F] text-[#F8FAFC] border border-white/5 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Page"
                className="p-2 rounded-lg bg-[#10273D] hover:bg-[#16324F] text-[#F8FAFC] border border-white/5 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="mailto:contact@c3club.org"
                aria-label="Email Us"
                className="p-2 rounded-lg bg-[#10273D] hover:bg-[#16324F] text-[#F8FAFC] border border-white/5 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F8FAFC]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {PUBLIC_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-[#38BDF8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Values Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F8FAFC]">
              Core Pillars
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" /> Learn by Teaching
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" /> Daily 15-Min Sessions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Peer Accountability
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Corporate Readiness
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <p>© {new Date().getFullYear()} Campus to Corporate (C3) Club. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-current inline" /> by C3 Tech Lead Team
          </p>
        </div>
      </div>
    </footer>
  );
};
