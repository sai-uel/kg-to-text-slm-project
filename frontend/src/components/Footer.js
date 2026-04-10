import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Dna } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-neutral-800" data-testid="footer">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
                <Dna className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-white">Drug</span>
                <span className="text-violet-400">KG Text</span>
                <span className="text-white"> AI</span>
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed">
              Transforming pharmaceutical knowledge graphs into actionable clinical insights 
              through advanced AI-powered natural language processing.
            </p>
            <div className="flex items-center gap-4">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-violet-500 transition-colors"
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
              {[
                { label: 'Generate Text', link: '/demo' },
                { label: 'Research', link: '#' },
                { label: 'Case Studies', link: '#' },
                { label: 'API Access', link: '#' }
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.link} className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">DrugBank</h4>
            <ul className="space-y-4">
              {[
                { label: 'DrugBank Database', link: 'https://go.drugbank.com/' },
                { label: 'Drug Ontologies', link: '#' },
                { label: 'Knowledge Graphs', link: '#' },
                { label: 'Documentation', link: '#' }
              ].map(item => (
                <li key={item.label}>
                  <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">About</h4>
            <ul className="space-y-4">
              {['Our Mission', 'Technology', 'Privacy Policy', 'Contact'].map(item => (
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
            © {new Date().getFullYear()} DrugKG Text AI. All rights reserved.
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
