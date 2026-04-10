import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const [isPaused, setIsPaused] = React.useState(false);

  const researchCards = [
    {
      category: 'RESEARCH REPORT',
      title: 'Drug Interaction Intelligence: Advancing pharmacovigilance',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop',
      color: 'from-violet-900/80'
    },
    {
      category: 'RESEARCH REPORT',
      title: 'AI in Clinical Documentation: Transforming healthcare data',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
      color: 'from-fuchsia-900/80'
    },
    {
      category: 'RESEARCH REPORT',
      title: 'The Knowledge Graph Revolution in Drug Discovery',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop',
      color: 'from-blue-900/80'
    },
    {
      category: 'PERSPECTIVE',
      title: 'Building Enterprise-Ready Biomedical AI Systems',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      color: 'from-emerald-900/80'
    }
  ];

  return (
    <div className="min-h-screen bg-black" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="container-app relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Large Typography */}
            <div className="fade-up">
              <h1 className="display-text text-white mb-8">
                KNOWLEDGE
                <br />
                <span className="relative">
                  REIN<span className="accent-chevron">&gt;</span>VENTED
                </span>
              </h1>
            </div>
            
            {/* Right - Description */}
            <div className="fade-up delay-200">
              <div className="accent-line" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Transforming pharmaceutical intelligence
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                In an era of exponential biomedical data growth, knowledge synthesis 
                demands intelligent automation. We transform complex drug relationship 
                graphs into actionable clinical insights, accelerating research and 
                improving patient outcomes.
              </p>
              <Link to="/demo">
                <button className="btn-ghost text-lg group" data-testid="hero-cta">
                  See what we do
                  <ChevronRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
          
          {/* Play/Pause Button */}
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="absolute bottom-12 left-4 sm:left-8 p-2 border border-neutral-700 text-neutral-400 hover:text-white hover:border-white transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Research Cards Section */}
      <section className="py-24 bg-black" data-testid="research-section">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchCards.map((card, index) => (
              <Link 
                to="/demo" 
                key={index}
                className="card-overlay group cursor-pointer h-[400px]"
                data-testid={`research-card-${index}`}
              >
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.color} via-black/60 to-transparent z-10`} />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-xs font-bold tracking-wider text-violet-400 mb-3">
                    {card.category}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-300 transition-colors">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-neutral-950 border-t border-b border-neutral-800">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '72B', label: 'Model Parameters' },
              { value: '<8s', label: 'Avg Response Time' },
              { value: '99.9%', label: 'Platform Uptime' },
              { value: '50K+', label: 'Drug Entities Processed' }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <p className="section-overline">CAPABILITIES</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Enterprise-grade biomedical NLP
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-8">
                Our platform processes complex pharmaceutical knowledge graphs and 
                transforms them into clear, clinically-relevant natural language 
                descriptions suitable for research documentation, regulatory submissions, 
                and clinical decision support.
              </p>
              
              <div className="space-y-6">
                {[
                  'Multi-format input support (CSV, JSON, TTL, RDF)',
                  'DrugBank ontology optimized processing',
                  'Real-time inference with sub-10s response',
                  'Research-grade output with citation support'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="text-violet-500 font-bold">&gt;</span>
                    <p className="text-neutral-300">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to="/demo">
                  <Button className="btn-primary" data-testid="cta-generate">
                    Start Generating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="fade-up delay-200 relative">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=700&h=500&fit=crop"
                  alt="Research Laboratory"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>
              
              {/* Floating stat card */}
              <div className="absolute -bottom-8 -left-8 stat-card max-w-[280px]">
                <p className="text-xs font-bold tracking-wider text-violet-400 mb-2">PROCESSING METRICS</p>
                <p className="text-2xl font-bold text-white mb-1">7,600ms</p>
                <p className="text-sm text-neutral-400">Average generation latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-violet-600">
        <div className="container-app">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your pharmaceutical research?
            </h2>
            <p className="text-violet-100 text-lg mb-8">
              Join leading research institutions leveraging BioKG Text AI for 
              accelerated drug discovery and clinical documentation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/demo">
                <Button className="bg-white text-violet-600 font-semibold px-8 py-4 h-auto rounded-none hover:bg-neutral-100">
                  Start Now
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 h-auto rounded-none hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
