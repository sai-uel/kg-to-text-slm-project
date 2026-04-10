import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Network, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Authentication successful');
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      toast.error('Authentication failed', { description: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
              <Network className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              BioKG <span className="text-blue-600">Text AI</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Sign in to your account</h1>
          <p className="text-slate-600 mb-8">
            Access your research library and saved generations
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-testid="login-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-10"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-slate-600 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1644088379091-d574269d422f?w=1200&h=800&fit=crop"
            alt="Knowledge graph network"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-md text-center z-10">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-blue-600/20 backdrop-blur flex items-center justify-center border border-blue-500/30">
            <Network className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Pharmaceutical Knowledge Intelligence
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Transform complex drug relationship data into actionable clinical insights 
            with enterprise-grade natural language processing.
          </p>
          <div className="mt-12 p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10">
            <p className="text-slate-300 italic">
              "Accelerating drug discovery documentation through AI-powered knowledge synthesis."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
