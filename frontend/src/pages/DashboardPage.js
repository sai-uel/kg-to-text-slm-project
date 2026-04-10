import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyGenerations, deleteGeneration, exportGenerations } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  FileText, Clock, Zap, Trash2, Copy, Download, Search,
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../components/ui/alert-dialog';

const DashboardPage = () => {
  const { user } = useAuth();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchGenerations(); }, []);

  const fetchGenerations = async () => {
    try {
      const data = await getMyGenerations();
      setGenerations(data);
    } catch (error) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGeneration(deleteId);
      setGenerations(generations.filter(g => g.id !== deleteId));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed');
    }
    setDeleteId(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  const handleExport = async () => {
    try {
      const data = await exportGenerations();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'biokg-export.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported');
    } catch (error) {
      toast.error('Failed');
    }
  };

  const filteredGenerations = generations.filter(g => 
    g.input_triples.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.generated_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgLatency = generations.length > 0 
    ? Math.round(generations.reduce((sum, g) => sum + g.latency_ms, 0) / generations.length) 
    : 0;

  return (
    <div className="min-h-screen bg-black" data-testid="dashboard-page">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-app">
          {/* Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-violet-600 flex items-center justify-center text-white text-2xl font-black">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-neutral-400">
                  Your research library and analytics
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 fade-up delay-100">
            {[
              { icon: FileText, value: generations.length, label: 'Total Generations', color: 'violet' },
              { icon: Zap, value: `${avgLatency}ms`, label: 'Avg Latency', color: 'emerald' },
              { icon: Clock, value: `${Math.round(generations.length * 2)}min`, label: 'Time Saved', color: 'blue' }
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${stat.color}-900/30 border border-${stat.color}-500/30 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Generations */}
          <div className="card-dark fade-up delay-200" data-testid="saved-generations">
            <div className="p-6 border-b border-neutral-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-white">Saved Generations</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full sm:w-64 input-dark"
                      data-testid="search-generations"
                    />
                  </div>
                  {generations.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleExport} 
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      data-testid="export-generations-btn">
                      <Download className="w-4 h-4 mr-2" />Export
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                </div>
              ) : filteredGenerations.length === 0 ? (
                <div className="text-center py-12" data-testid="empty-state">
                  <div className="w-16 h-16 mx-auto mb-4 border border-neutral-700 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-neutral-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {searchTerm ? 'No results' : 'No saved generations'}
                  </h3>
                  <p className="text-neutral-500">
                    {searchTerm ? 'Try different search terms' : 'Generate and save to build your library'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGenerations.map((gen) => (
                    <div key={gen.id} className="border border-neutral-800 p-4 hover:border-violet-500/50 transition-colors"
                      data-testid={`generation-item-${gen.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-neutral-500">
                              {new Date(gen.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-violet-900/30 text-violet-400 border border-violet-500/30 font-mono">
                              {gen.latency_ms}ms
                            </span>
                          </div>
                          <p className="text-sm text-neutral-300 font-mono truncate">{gen.input_triples}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(gen.generated_text)}
                            className="text-neutral-400 hover:text-white">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(gen.id)}
                            className="text-neutral-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" 
                            onClick={() => setExpandedId(expandedId === gen.id ? null : gen.id)}
                            className="text-neutral-400">
                            {expandedId === gen.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      {expandedId === gen.id && (
                        <div className="mt-4 pt-4 border-t border-neutral-800">
                          <div className="mb-3">
                            <p className="text-xs font-bold tracking-wider text-neutral-500 mb-2">INPUT</p>
                            <pre className="text-sm bg-neutral-950 p-3 font-mono text-neutral-300 whitespace-pre-wrap border border-neutral-800">
                              {gen.input_triples}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs font-bold tracking-wider text-neutral-500 mb-2">OUTPUT</p>
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default DashboardPage;
