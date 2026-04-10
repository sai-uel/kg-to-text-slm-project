import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-neutral-800" data-testid="footer">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-6">
              <span className="text-violet-500 text-3xl font-black">&gt;</span>
              <span className="font-bold text-xl text-white tracking-tight">
                BioKG
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed">
              Transforming pharmaceutical knowledge graphs into actionable clinical insights 
              through advanced AI-powered natural language processing.
            </p>
            <div className="flex items-center gap-4">
              {[Linkedin, Twitter, Youtube, Instagram].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              {['Generate Text', 'Research', 'Case Studies', 'API Access'].map(item => (
                <li key={item}>
                  <Link to="/demo" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'News', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'Support', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} BioKG Text AI. All rights reserved.
          </p>
          <p className="text-neutral-500 text-sm">
            Enterprise AI for Pharmaceutical Research
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
