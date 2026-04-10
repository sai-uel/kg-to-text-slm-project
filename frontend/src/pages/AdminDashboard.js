import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAdminStats, 
  getRecentGenerations, 
  getAllUsers,
  getHealthStatus 
} from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Users, 
  FileText, 
  Zap, 
  Activity,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  BarChart3,
  Network
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsData, generationsData, usersData, healthData] = await Promise.all([
        getAdminStats(),
        getRecentGenerations(10),
        getAllUsers(),
        getHealthStatus()
      ]);
      setStats(statsData);
      setRecentGenerations(generationsData.generations || []);
      setUsers(usersData.users || []);
      setHealth(healthData);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-app">
          {/* Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  Admin Control Center
                </h1>
                <p className="text-slate-500">
                  Platform analytics and system monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up delay-100">
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.total_users || 0}</p>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
            </div>
            
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  +8%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.total_generations || 0}</p>
              <p className="text-sm font-medium text-slate-600">Total Generations</p>
            </div>
            
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.generations_today || 0}</p>
              <p className="text-sm font-medium text-slate-600">Today's Generations</p>
            </div>
            
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{Math.round(stats?.avg_latency_ms || 0)}ms</p>
              <p className="text-sm font-medium text-slate-600">Avg Latency</p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 fade-up delay-150">
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500">This Week</span>
                <Network className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.generations_this_week || 0}</p>
              <p className="text-sm text-slate-500">generations processed</p>
            </div>
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500">Avg Input</span>
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{Math.round(stats?.avg_input_size || 0)}</p>
              <p className="text-sm text-slate-500">characters</p>
            </div>
            <div className="card-widget p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500">Avg Output</span>
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{Math.round(stats?.avg_output_size || 0)}</p>
              <p className="text-sm text-slate-500">characters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Generations */}
            <div className="lg:col-span-2 fade-up delay-200">
              <div className="card-widget" data-testid="recent-generations-table">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Recent Generations</h2>
                </div>
                
                <div className="p-6">
                  {recentGenerations.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      No generations recorded
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">User</TableHead>
                            <TableHead className="font-semibold">Input Preview</TableHead>
                            <TableHead className="font-semibold">Latency</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentGenerations.map((gen, index) => (
                            <TableRow key={gen.id || index}>
                              <TableCell className="font-medium">
                                {gen.user_name || 'Anonymous'}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate font-mono text-xs text-slate-600">
                                {gen.input_triples}...
                              </TableCell>
                              <TableCell>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                  {gen.latency_ms}ms
                                </span>
                              </TableCell>
                              <TableCell className="text-slate-500 text-sm">
                                {new Date(gen.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* System Status & Users */}
            <div className="space-y-6 fade-up delay-300">
              {/* System Status */}
              <div className="card-widget" data-testid="system-status">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">System Status</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">API Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {health?.database === 'connected' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-semibold text-red-600">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Network className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Model API</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {health?.hf_token_configured ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-semibold text-amber-600">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 mt-2">
                  <p className="text-xs font-semibold text-slate-400 mb-1">MODEL ENDPOINT</p>
                  <p className="text-sm font-mono text-slate-600 truncate">
                    Qwen/Qwen2.5-72B-Instruct
                  </p>
                </div>
              </div>

              {/* Users List */}
              <div className="card-widget" data-testid="users-list">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Recent Users</h2>
                </div>
                <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                  {users.slice(0, 5).map((u) => (
                    <div 
                      key={u.id} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        u.is_admin ? 'bg-slate-900' : 'bg-blue-600'
                      }`}>
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                      {u.is_admin && (
                        <span className="px-2 py-0.5 bg-slate-900 text-white text-xs rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
