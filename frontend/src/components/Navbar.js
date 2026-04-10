import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Shield,
  ChevronDown,
  Dna
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="nav-dark fixed top-0 left-0 right-0 z-50" data-testid="navbar">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            data-testid="navbar-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Drug</span>
              <span className="text-violet-400">KG Text</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link">
                Research <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-900 border-neutral-800 w-56">
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Drug Interaction Studies
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Clinical Documentation AI
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Pharmacovigilance Reports
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Publications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link">
                DrugBank <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-900 border-neutral-800 w-56">
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  <a href="https://go.drugbank.com/" target="_blank" rel="noopener noreferrer" className="w-full">
                    DrugBank Database
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Drug Ontologies
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Knowledge Graph Schema
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  API Documentation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link">
                About <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-900 border-neutral-800 w-64">
                <div className="px-3 py-3 border-b border-neutral-800">
                  <p className="text-sm text-white font-semibold mb-1">DrugKG Text AI Platform</p>
                  <p className="text-xs text-neutral-400">
                    Advanced AI platform for transforming pharmaceutical knowledge graphs into natural language clinical insights.
                  </p>
                </div>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Our Mission
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Technology
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-neutral-800 cursor-pointer">
                  Contact Us
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && (
              <Link to="/dashboard" className="nav-link" data-testid="nav-dashboard">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link" data-testid="nav-admin">
                Admin
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white hover:bg-white/10"
                    data-testid="user-menu-trigger"
                  >
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800">
                  <div className="px-3 py-2 border-b border-neutral-800">
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-neutral-400">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer text-white hover:bg-neutral-800">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer text-white hover:bg-neutral-800">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-neutral-800" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer text-red-400 hover:bg-neutral-800"
                    data-testid="logout-button"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  data-testid="nav-login"
                >
                  Sign In
                </Button>
              </Link>
            )}
            
            <Link to="/demo">
              <Button className="btn-primary" data-testid="nav-generate">
                Generate
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <div className="flex flex-col gap-2">
              <Link to="/demo" className="px-4 py-3 text-white hover:bg-neutral-800" onClick={() => setMobileMenuOpen(false)}>
                Generate
              </Link>
              <a href="#" className="px-4 py-3 text-white/80 hover:bg-neutral-800">Research</a>
              <a href="https://go.drugbank.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-3 text-white/80 hover:bg-neutral-800">DrugBank</a>
              <a href="#" className="px-4 py-3 text-white/80 hover:bg-neutral-800">About</a>
              {isAuthenticated && (
                <Link to="/dashboard" className="px-4 py-3 text-white hover:bg-neutral-800" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-3 text-white hover:bg-neutral-800" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <div className="border-t border-neutral-800 mt-2 pt-4 px-4">
                {isAuthenticated ? (
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full py-3 text-left text-red-400">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="block py-3 text-center text-white border border-neutral-700" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
