import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getMyGenerations, 
  deleteGeneration, 
  exportGenerations 
} from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  FileText, 
  Clock, 
  Zap, 
  Trash2, 
  Copy, 
  Download, 
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  Network,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const DashboardPage = () => {
  const { user } = useAuth();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    try {
      const data = await getMyGenerations();
      setGenerations(data);
    } catch (error) {
      toast.error('Failed to load generations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGeneration(deleteId);
      setGenerations(generations.filter(g => g.id !== deleteId));
      toast.success('Generation deleted');
    } catch (error) {
      toast.error('Failed to delete generation');
    }
    setDeleteId(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleExport = async () => {
    try {
      const data = await exportGenerations();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'biokg-generations-export.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const filteredGenerations = generations.filter(g => 
    g.input_triples.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.generated_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLatency = generations.reduce((sum, g) => sum + g.latency_ms, 0);
  const avgLatency = generations.length > 0 ? Math.round(totalLatency / generations.length) : 0;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="dashboard-page">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-app">
          {/* Welcome Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Your research library and generation analytics
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 fade-up delay-100">
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{generations.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Generations</p>
            </div>
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{avgLatency}ms</p>
              <p className="text-sm font-medium text-slate-600">Average Latency</p>
            </div>
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{Math.round(generations.length * 2)}min</p>
              <p className="text-sm font-medium text-slate-600">Time Saved</p>
            </div>
          </div>

          {/* Generations Section */}
          <div className="card-widget fade-up delay-200" data-testid="saved-generations">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Saved Generations</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full sm:w-64 input-field"
                      data-testid="search-generations"
                    />
                  </div>
                  {generations.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      className="whitespace-nowrap btn-outline"
                      data-testid="export-generations-btn"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredGenerations.length === 0 ? (
                <div className="text-center py-12" data-testid="empty-state">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <Network className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {searchTerm ? 'No matching results' : 'No saved generations'}
                  </h3>
                  <p className="text-slate-500">
                    {searchTerm 
                      ? 'Try adjusting your search criteria' 
                      : 'Generate and save clinical text to build your research library'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGenerations.map((gen) => (
                    <div
                      key={gen.id}
                      className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors"
                      data-testid={`generation-item-${gen.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium text-slate-500">
                              {new Date(gen.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                              {gen.latency_ms}ms
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-mono truncate">
                            {gen.input_triples}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(gen.generated_text)}
                            className="text-slate-500 hover:text-slate-700"
                            data-testid={`copy-generation-${gen.id}`}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(gen.id)}
                            className="text-slate-500 hover:text-red-600"
                            data-testid={`delete-generation-${gen.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedId(expandedId === gen.id ? null : gen.id)}
                            className="text-slate-500"
                          >
                            {expandedId === gen.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {expandedId === gen.id && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-slate-500 mb-2">INPUT TRIPLES</p>
                            <pre className="text-sm bg-slate-50 p-3 rounded-lg font-mono text-slate-700 whitespace-pre-wrap">
                              {gen.input_triples}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2">GENERATED OUTPUT</p>
                            <div className="output-container">
                              <p className="output-text">{gen.generated_text}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Generation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this 
              generation from your research library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              data-testid="confirm-delete-btn"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default DashboardPage;
