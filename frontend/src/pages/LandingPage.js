import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Beaker, 
  Zap, 
  Database, 
  Brain, 
  FileText, 
  Shield,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Fine-tuned Gemma 2B model specifically trained on DrugBank knowledge graph data for accurate biomedical text generation.'
    },
    {
      icon: Database,
      title: 'Knowledge Graph to Text',
      description: 'Transform structured drug relationship triples into coherent, natural language descriptions instantly.'
    },
    {
      icon: Zap,
      title: 'Real-time Inference',
      description: 'Get instant results with our optimized inference pipeline. No waiting, no queue delays.'
    },
    {
      icon: FileText,
      title: 'Save & Export',
      description: 'Save your generations, build a library of descriptions, and export them in multiple formats.'
    },
    {
      icon: Shield,
      title: 'Research Grade',
      description: 'Built for pharmaceutical research, clinical documentation, and academic applications.'
    },
    {
      icon: Sparkles,
      title: 'User-Friendly Interface',
      description: 'Clean, intuitive design that makes knowledge graph conversion accessible to everyone.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Input Your Triples',
      description: 'Paste your DrugBank-style knowledge graph triples into our editor.'
    },
    {
      step: '02',
      title: 'AI Processing',
      description: 'Our fine-tuned Gemma model analyzes the relationships and context.'
    },
    {
      step: '03',
      title: 'Get Natural Language',
      description: 'Receive clear, coherent text descriptions of your drug knowledge.'
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338CA' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container-app relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium text-sm mb-8 fade-up">
              <Beaker className="w-4 h-4" />
              Powered by Fine-tuned Gemma 2B
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6 fade-up delay-100">
              Transform Drug Knowledge
              <span className="block text-gradient">Into Natural Language</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 fade-up delay-200">
              Convert DrugBank-style knowledge graph triples into clear, comprehensive 
              natural language descriptions using our AI-powered platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up delay-300">
              <Link to="/demo">
                <Button 
                  className="btn-primary text-lg px-8 py-4 h-auto group"
                  data-testid="hero-cta-demo"
                >
                  Try the Demo
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline"
                  className="btn-secondary text-lg px-8 py-4 h-auto"
                  data-testid="hero-cta-register"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-slate-200 fade-up delay-400">
              <div>
                <p className="text-3xl font-bold text-slate-900">2B</p>
                <p className="text-sm text-slate-500">Parameters</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">DrugBank</p>
                <p className="text-sm text-slate-500">Trained Dataset</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">Real-time</p>
                <p className="text-sm text-slate-500">Inference</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white" data-testid="features-section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-600 mb-4">Features</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Everything You Need for Biomedical NLP
            </h2>
            <p className="text-slate-600">
              Our platform provides all the tools you need to convert knowledge graphs 
              into human-readable text efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-slate-50" data-testid="how-it-works-section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-600 mb-4">How It Works</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-slate-600">
              Getting from knowledge graph triples to natural language has never been easier.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="card-default p-8">
                  <span className="text-6xl font-bold text-indigo-100">{item.step}</span>
                  <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding bg-white" data-testid="use-cases-section">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-600 mb-4">Use Cases</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-6">
                Built for Research & Clinical Applications
              </h2>
              <p className="text-slate-600 mb-8">
                Our platform serves researchers, clinicians, and pharmaceutical professionals 
                who need to quickly understand complex drug relationships.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Drug interaction documentation',
                  'Clinical decision support systems',
                  'Pharmaceutical research summaries',
                  'Academic paper preparation',
                  'Patient information generation'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="card-glass p-8">
                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm">
                  <p className="text-emerald-400 mb-2"># Input Triple</p>
                  <p className="text-slate-300 mb-4">
                    DB00945 | interacts_with | DB01418
                  </p>
                  <p className="text-emerald-400 mb-2"># Generated Output</p>
                  <p className="text-slate-300">
                    Aspirin (DB00945) has a clinically significant 
                    interaction with Acenocoumarol (DB01418). 
                    When used together, there is an increased 
                    risk of bleeding due to the anticoagulant 
                    effects being potentiated.
                  </p>
                </div>
                <p className="text-center text-slate-500 text-sm mt-4">
                  Example transformation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-blue-700" data-testid="cta-section">
        <div className="container-app text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Knowledge Graphs?
          </h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
            Start converting biomedical knowledge graphs into natural language today. 
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo">
              <Button 
                className="bg-white text-indigo-600 font-semibold px-8 py-4 h-auto rounded-lg hover:bg-indigo-50 transition-colors"
                data-testid="cta-demo"
              >
                Try Demo Now
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="outline"
                className="border-white/30 text-white font-semibold px-8 py-4 h-auto rounded-lg hover:bg-white/10 transition-colors"
                data-testid="cta-register"
              >
                Create Account
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
