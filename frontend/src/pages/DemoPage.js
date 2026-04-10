import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateText, saveGeneration } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Network, 
  Copy, 
  Download, 
  Trash2, 
  Clock, 
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  X,
  History
} from 'lucide-react';
import { toast } from 'sonner';

const DemoPage = () => {
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(null);
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('biokg_generation_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (input, output, latency) => {
    const newEntry = {
      id: Date.now(),
      input,
      output,
      latency,
      timestamp: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('biokg_generation_history', JSON.stringify(updatedHistory));
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please provide knowledge graph triples');
      return;
    }
    
    setLoading(true);
    setError('');
    setOutput('');
    setLatency(null);
    setSaved(false);

    try {
      const result = await generateText(input);
      setOutput(result.generated_text);
      setLatency(result.latency_ms);
      saveToHistory(input, result.generated_text, result.latency_ms);
      toast.success('Text generation complete');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Generation failed';
      setError(errorMessage);
      toast.error('Generation failed', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneration = async () => {
    if (!isAuthenticated) {
      toast.error('Authentication required to save generations');
      return;
    }
    
    try {
      await saveGeneration({
        input_triples: input,
        generated_text: output,
        latency_ms: latency
      });
      setSaved(true);
      toast.success('Generation saved to your library');
    } catch (err) {
      toast.error('Failed to save generation');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    const content = `KNOWLEDGE GRAPH TRIPLES:\n${input}\n\nGENERATED CLINICAL TEXT:\n${output}\n\nProcessing Time: ${latency}ms\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biokg-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setLatency(null);
    setSaved(false);
    setUploadedFile(null);
  };

  const handleLoadFromHistory = (entry) => {
    setInput(entry.input);
    setOutput(entry.output);
    setLatency(entry.latency);
    setSaved(false);
  };

  // File handling
  const parseFileContent = async (file) => {
    const text = await file.text();
    const extension = file.name.split('.').pop().toLowerCase();
    
    try {
      if (extension === 'json') {
        const data = JSON.parse(text);
        // Handle various JSON structures
        if (Array.isArray(data)) {
          return data.map(item => {
            if (typeof item === 'string') return item;
            if (item.subject && item.predicate && item.object) {
              return `${item.subject} | ${item.predicate} | ${item.object}`;
            }
            return JSON.stringify(item);
          }).join('\n');
        }
        return JSON.stringify(data, null, 2);
      } else if (extension === 'csv') {
        const lines = text.trim().split('\n');
        return lines.map(line => line.replace(/,/g, ' | ')).join('\n');
      } else if (extension === 'ttl' || extension === 'nt' || extension === 'rdf') {
        // Basic TTL parsing - extract subject predicate object patterns
        const lines = text.trim().split('\n').filter(l => !l.startsWith('@') && !l.startsWith('#') && l.trim());
        return lines.join('\n');
      }
      return text;
    } catch (e) {
      return text;
    }
  };

  const handleFileUpload = async (file) => {
    const allowedExtensions = ['csv', 'json', 'ttl', 'nt', 'rdf', 'txt'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      toast.error(`Unsupported format. Use: ${allowedExtensions.join(', ')}`);
      return;
    }
    
    try {
      const content = await parseFileContent(file);
      setInput(content);
      setUploadedFile(file);
      toast.success(`Loaded ${file.name}`);
    } catch (e) {
      toast.error('Failed to parse file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="demo-page">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-app">
          {/* Header */}
          <div className="text-center mb-12 fade-up">
            <p className="overline mb-4">Knowledge Graph Transformation</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Generate Clinical Text
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transform pharmaceutical knowledge graph triples into publication-ready 
              natural language descriptions for research and clinical documentation.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input/Output Section */}
            <div className="lg:col-span-2 space-y-6 fade-up delay-100">
              {/* Input Panel */}
              <div className="card-widget p-6" data-testid="input-panel">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Input Knowledge Graph</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-slate-500 hover:text-slate-700"
                    data-testid="clear-btn"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="text" className="text-sm font-semibold">
                      <FileText className="w-4 h-4 mr-2" />
                      Text Input
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="text-sm font-semibold">
                      <Upload className="w-4 h-4 mr-2" />
                      File Upload
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="textarea-field min-h-[200px] font-mono text-sm"
                      data-testid="triples-input"
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <div
                      className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="upload-kg-dropzone"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".csv,.json,.ttl,.nt,.rdf,.txt"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                      />
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-slate-700 mb-1">
                        Drop your knowledge graph file here
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        or click to browse
                      </p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {['CSV', 'JSON', 'TTL', 'RDF', 'TXT'].map(fmt => (
                          <span key={fmt} className="format-badge">{fmt}</span>
                        ))}
                      </div>
                    </div>
                    
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700">{uploadedFile.name}</span>
                        </div>
                        <button
                          onClick={() => { setUploadedFile(null); setInput(''); }}
                          className="p-1 hover:bg-blue-100 rounded"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    )}
                    
                    {input && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-500 mb-2">Parsed Content:</p>
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="textarea-field min-h-[150px] font-mono text-sm"
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    {input.length} characters
                  </span>
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !input.trim()}
                    className="btn-primary"
                    data-testid="generate-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Network className="w-5 h-5 mr-2" />
                        Generate Text
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Output Panel */}
              <div className="card-widget" data-testid="output-panel">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">Generated Output</h2>
                    {latency && (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">
                        <Clock className="w-3 h-3" />
                        {latency}ms
                      </span>
                    )}
                  </div>
                  {output && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="text-slate-500 hover:text-slate-700"
                        data-testid="copy-output-btn"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="text-slate-500 hover:text-slate-700"
                        data-testid="download-output-btn"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {isAuthenticated && !saved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveGeneration}
                          className="text-blue-600 hover:text-blue-700"
                          data-testid="save-generation-btn"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      )}
                      {saved && (
                        <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Saved
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="min-h-[200px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 animate-pulse-blue">
                        <Network className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-slate-700 font-semibold">Synthesizing clinical text...</p>
                      <p className="text-sm text-slate-500 mt-1">Analyzing knowledge graph relationships</p>
                    </div>
                  ) : error ? (
                    <div className="min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-red-600 font-semibold mb-2">Processing Error</p>
                        <p className="text-sm text-slate-500 max-w-md">{error}</p>
                      </div>
                    </div>
                  ) : output ? (
                    <div className="output-container min-h-[200px]">
                      <p className="output-text whitespace-pre-wrap" data-testid="generated-text">
                        {output}
                      </p>
                    </div>
                  ) : (
                    <div className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-semibold">Clinical text output</p>
                        <p className="text-sm text-slate-400 mt-1">Provide knowledge graph triples to generate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History Panel */}
            <div className="fade-up delay-200">
              <div className="card-widget sticky top-24" data-testid="history-panel">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                  </div>
                </div>
                
                <div className="p-4">
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">No recent activity</p>
                      <p className="text-xs text-slate-400 mt-1">Your generations will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {history.map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => handleLoadFromHistory(entry)}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                          data-testid={`history-item-${entry.id}`}
                        >
                          <p className="text-xs text-slate-400 font-mono mb-1">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-700 font-mono truncate">
                            {entry.input.split('\n')[0]}
                          </p>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded mt-2 inline-block">
                            {entry.latency}ms
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="p-4 border-t border-slate-100">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm font-semibold text-blue-700 mb-1">
                        Save your generations
                      </p>
                      <p className="text-xs text-blue-600">
                        Create a free account to build your research library.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoPage;
