import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateText, saveGeneration } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { 
  Sparkles, 
  Copy, 
  Download, 
  Trash2, 
  Clock, 
  Loader2,
  BookOpen,
  Save,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const SAMPLE_TRIPLES = `DB00945 | category | Nonsteroidal Anti-inflammatory Agents
DB00945 | mechanism | Irreversibly inhibits cyclooxygenase-1 and 2 (COX-1 and COX-2)
DB00945 | indication | Treatment of mild to moderate pain, fever, and inflammation
DB00945 | interacts_with | DB00682
DB00945 | synonym | Aspirin
DB00682 | name | Warfarin
DB00682 | category | Anticoagulants`;

const DemoPage = () => {
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(null);
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('generation_history');
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
    localStorage.setItem('generation_history', JSON.stringify(updatedHistory));
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some triples');
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
      toast.success('Generation complete!');
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
      toast.error('Please login to save generations');
      return;
    }
    
    try {
      await saveGeneration({
        input_triples: input,
        generated_text: output,
        latency_ms: latency
      });
      setSaved(true);
      toast.success('Generation saved to your library!');
    } catch (err) {
      toast.error('Failed to save generation');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    const content = `INPUT TRIPLES:\n${input}\n\nGENERATED TEXT:\n${output}\n\nLatency: ${latency}ms`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generation.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TRIPLES);
    toast.success('Sample triples loaded');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setLatency(null);
    setSaved(false);
  };

  const handleLoadFromHistory = (entry) => {
    setInput(entry.input);
    setOutput(entry.output);
    setLatency(entry.latency);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="demo-page">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-app">
          {/* Header */}
          <div className="text-center mb-12 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Generation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Knowledge Graph to Text Demo
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Enter your DrugBank-style knowledge graph triples and watch them transform 
              into natural language descriptions.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input/Output Section */}
            <div className="lg:col-span-2 space-y-6 fade-up delay-100">
              {/* Input Panel */}
              <div className="card-default p-6" data-testid="input-panel">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Input Triples</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLoadSample}
                      className="text-indigo-600 hover:text-indigo-700"
                      data-testid="load-sample-btn"
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      Load Sample
                    </Button>
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
                </div>
                
                <Textarea
                  placeholder="Enter your DrugBank-style knowledge graph triples here...

Example format:
DB00945 | category | Nonsteroidal Anti-inflammatory Agents
DB00945 | mechanism | Irreversibly inhibits cyclooxygenase
DB00945 | interacts_with | DB00682"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="textarea-mono min-h-[200px]"
                  data-testid="triples-input"
                />
                
                <div className="flex items-center justify-between mt-4">
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Text
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Output Panel */}
              <div className="card-default p-6" data-testid="output-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Generated Output</h2>
                    {latency && (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
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
                          className="text-indigo-600 hover:text-indigo-700"
                          data-testid="save-generation-btn"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      )}
                      {saved && (
                        <span className="flex items-center gap-1 text-sm text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Saved
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="min-h-[200px] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 animate-pulse">
                      <Sparkles className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-slate-600 font-medium">Processing your triples...</p>
                    <p className="text-sm text-slate-400 mt-1">This may take a moment</p>
                  </div>
                ) : error ? (
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-red-600 font-medium mb-2">Generation Failed</p>
                      <p className="text-sm text-slate-500 max-w-md">{error}</p>
                    </div>
                  </div>
                ) : output ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 min-h-[200px]">
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap" data-testid="generated-text">
                      {output}
                    </p>
                  </div>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Output will appear here</p>
                      <p className="text-sm text-slate-400 mt-1">Enter triples and click Generate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History Panel */}
            <div className="fade-up delay-200">
              <div className="card-default p-6 sticky top-24" data-testid="history-panel">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent History</h2>
                
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">No history yet</p>
                    <p className="text-xs text-slate-400 mt-1">Your generations will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleLoadFromHistory(entry)}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                        data-testid={`history-item-${entry.id}`}
                      >
                        <p className="text-xs text-slate-400 mb-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-700 font-mono truncate">
                          {entry.input.split('\n')[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {entry.latency}ms
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                    <p className="text-sm text-indigo-700 font-medium mb-1">
                      Want to save your generations?
                    </p>
                    <p className="text-xs text-indigo-600">
                      Create a free account to save and manage your generation library.
                    </p>
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
