import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Network, 
  Zap, 
  Database, 
  FileText, 
  Shield,
  ChevronRight,
  Upload,
  Microscope,
  Activity
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const features = [
    {
      icon: Network,
      title: 'Knowledge Graph Processing',
      description: 'Transform complex drug relationship triples into structured, coherent natural language clinical descriptions.'
    },
    {
      icon: Zap,
      title: 'Real-time Inference',
      description: 'Enterprise-grade processing pipeline delivering instant results for pharmaceutical research workflows.'
    },
    {
      icon: Upload,
      title: 'Multi-format Support',
      description: 'Import knowledge graphs from CSV, JSON, TTL, and RDF formats. Seamless integration with existing data pipelines.'
    },
    {
      icon: Database,
      title: 'DrugBank Compatible',
      description: 'Optimized for DrugBank-style ontologies. Accurate interpretation of drug interactions and mechanisms.'
    },
    {
      icon: Shield,
      title: 'Research Grade',
      description: 'Built for pharmaceutical research, clinical documentation, and regulatory submission preparation.'
    },
    {
      icon: Activity,
      title: 'Analytics Dashboard',
      description: 'Track generation metrics, monitor API usage, and analyze output quality across your research team.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Import Knowledge Graph',
      description: 'Upload your structured drug data in CSV, JSON, or TTL format, or paste triples directly.'
    },
    {
      step: '02',
      title: 'AI Processing',
      description: 'Advanced language models analyze entity relationships, mechanisms, and clinical context.'
    },
    {
      step: '03',
      title: 'Clinical Insights',
      description: 'Receive publication-ready natural language descriptions for research and documentation.'
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-radial">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-medical-mesh" />
        
        <div className="container-app relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="fade-up">
              <p className="overline mb-4">Biomedical NLP Platform</p>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                BioKG <span className="text-blue-600">Text AI</span>
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Transform pharmaceutical knowledge graphs into publication-ready natural language. 
                Enterprise-grade AI for drug interaction documentation, clinical insights, and research synthesis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/demo">
                  <Button 
                    className="btn-primary text-base px-8 py-4 h-auto group"
                    data-testid="hero-cta-generate"
                  >
                    Start Generating
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="btn-outline text-base px-8 py-4 h-auto"
                    data-testid="hero-cta-register"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-2xl font-black text-slate-900">72B</p>
                  <p className="text-sm text-slate-500">Parameters</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-2xl font-black text-slate-900">&lt;10s</p>
                  <p className="text-sm text-slate-500">Avg. Response</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-2xl font-black text-slate-900">99.9%</p>
                  <p className="text-sm text-slate-500">Uptime</p>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="fade-up delay-200 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop"
                  alt="Molecular structure visualization"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-slate-200 max-w-[280px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Processing Complete</p>
                    <p className="text-xs text-slate-500">Drug interaction analysis</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded">
                  Aspirin ↔ Warfarin interaction detected
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-50" data-testid="features-section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="overline mb-4">Platform Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Enterprise Biomedical NLP Infrastructure
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Purpose-built for pharmaceutical research teams, clinical informaticists, 
              and regulatory documentation workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card-widget p-8 fade-up group hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white" data-testid="how-it-works-section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="overline mb-4">Workflow</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              From Knowledge Graph to Clinical Text
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Streamlined pipeline for transforming structured pharmaceutical data 
              into publication-ready documentation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="card-widget p-8">
                  <span className="text-7xl font-black text-blue-100">{item.step}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-4 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Applications Section */}
      <section className="section-padding bg-slate-900" data-testid="applications-section">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Applications</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
                Built for Pharmaceutical Research Excellence
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                BioKG Text AI empowers research teams to accelerate drug discovery documentation, 
                clinical trial preparation, and regulatory submission workflows.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Drug-drug interaction documentation',
                  'Clinical trial protocol generation',
                  'Pharmacovigilance report synthesis',
                  'Regulatory submission preparation',
                  'Literature review automation'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&h=500&fit=crop"
                alt="Medical research laboratory"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-lg max-w-[300px]">
                <div className="flex items-center gap-3 mb-3">
                  <Microscope className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-bold text-slate-900">Research Ready</p>
                    <p className="text-sm text-slate-500">Publication-grade output</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Outputs validated against pharmaceutical ontology standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600" data-testid="cta-section">
        <div className="container-app text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Accelerate Your Pharmaceutical Research
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Join leading research institutions using BioKG Text AI for drug discovery 
            documentation and clinical insights generation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo">
              <Button 
                className="bg-white text-blue-600 font-semibold px-8 py-4 h-auto rounded-lg hover:bg-blue-50 transition-colors"
                data-testid="cta-generate"
              >
                Start Generating Now
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="outline"
                className="border-white/30 text-white font-semibold px-8 py-4 h-auto rounded-lg hover:bg-white/10 transition-colors"
                data-testid="cta-register"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
