import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Network,
  Shield
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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-header" data-testid="navbar">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            data-testid="navbar-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Network className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              BioKG <span className="text-blue-600">Text AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-blue-600'
              }`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link
              to="/demo"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/demo') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-blue-600'
              }`}
              data-testid="nav-generate"
            >
              Generate
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
                data-testid="nav-dashboard"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/admin') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
                data-testid="nav-admin"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hover:bg-slate-100"
                    data-testid="user-menu-trigger"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold text-slate-700">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    data-testid="logout-button"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="font-semibold text-slate-600 hover:text-blue-600"
                    data-testid="nav-login"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="btn-primary"
                    data-testid="nav-register"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className={`px-4 py-3 rounded-lg font-semibold ${
                  isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/demo"
                className={`px-4 py-3 rounded-lg font-semibold ${
                  isActive('/demo') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Generate
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`px-4 py-3 rounded-lg font-semibold ${
                    isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-4 py-3 rounded-lg font-semibold ${
                    isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="border-t border-slate-200 mt-2 pt-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-3 text-center font-semibold text-slate-700 border border-slate-200 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 text-center font-semibold text-white bg-blue-600 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
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
