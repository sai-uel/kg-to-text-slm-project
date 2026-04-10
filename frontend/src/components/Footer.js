import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white" data-testid="footer">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">
                DrugBank <span className="text-indigo-400">KG-to-Text</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              Transform biomedical knowledge graphs into natural language with our AI-powered platform. 
              Built for researchers, clinicians, and pharmaceutical professionals.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-slate-400 hover:text-white transition-colors">
                  Try Demo
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                support@drugbank-kg.ai
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-slate-500">
                Powered by fine-tuned Gemma model on DrugBank knowledge graph data.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DrugBank KG-to-Text AI Platform. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Built with Gemma 2B • Fine-tuned on DrugBank
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
