import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white" data-testid="footer">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Network className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <span className="font-black text-xl tracking-tight">
                BioKG <span className="text-blue-400">Text AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
              Advanced biomedical knowledge graph transformation platform. 
              Converting structured pharmaceutical data into actionable clinical insights 
              through state-of-the-art natural language processing.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-slate-400 hover:text-white transition-colors">
                  Generate Text
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                research@biokg-ai.com
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-slate-500">
                Enterprise-grade NLP for pharmaceutical research and clinical documentation.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} BioKG Text AI. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Powered by Advanced Language Models • Research Grade Infrastructure
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
