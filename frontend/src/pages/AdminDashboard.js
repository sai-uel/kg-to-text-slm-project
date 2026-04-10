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
import StatCard from '../components/StatCard';
import { 
  Users, 
  FileText, 
  Zap, 
  Clock, 
  Activity,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  BarChart3
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
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="text-slate-500">
                  Welcome back, {user?.name}! Here's what's happening.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up delay-100">
            <StatCard
              title="Total Users"
              value={stats?.total_users || 0}
              icon={Users}
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Total Generations"
              value={stats?.total_generations || 0}
              icon={FileText}
              trend="up"
              trendValue="+8%"
            />
            <StatCard
              title="Generations Today"
              value={stats?.generations_today || 0}
              icon={TrendingUp}
              subtitle="Last 24 hours"
            />
            <StatCard
              title="Avg Latency"
              value={`${Math.round(stats?.avg_latency_ms || 0)}ms`}
              icon={Zap}
              subtitle="Per request"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 fade-up delay-150">
            <div className="card-default p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-500">This Week</span>
                <Activity className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.generations_this_week || 0}</p>
              <p className="text-sm text-slate-500">generations</p>
            </div>
            <div className="card-default p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-500">Avg Input Size</span>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{Math.round(stats?.avg_input_size || 0)}</p>
              <p className="text-sm text-slate-500">characters</p>
            </div>
            <div className="card-default p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-500">Avg Output Size</span>
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{Math.round(stats?.avg_output_size || 0)}</p>
              <p className="text-sm text-slate-500">characters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Generations */}
            <div className="lg:col-span-2 fade-up delay-200">
              <div className="card-default p-6" data-testid="recent-generations-table">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Generations</h2>
                
                {recentGenerations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No generations yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Input Preview</TableHead>
                          <TableHead>Latency</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentGenerations.map((gen, index) => (
                          <TableRow key={gen.id || index}>
                            <TableCell className="font-medium">
                              {gen.user_name || 'Anonymous'}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate font-mono text-xs">
                              {gen.input_triples}...
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs">
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

            {/* System Status & Users */}
            <div className="space-y-6 fade-up delay-300">
              {/* System Status */}
              <div className="card-default p-6" data-testid="system-status">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-600">API Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-600">Database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {health?.database === 'connected' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-600">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-600">HF Token</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {health?.hf_token_configured ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">Configured</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-600">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">Model ID</p>
                  <p className="text-sm font-mono text-slate-600 truncate">
                    {health?.model_id || 'Not configured'}
                  </p>
                </div>
              </div>

              {/* Users List */}
              <div className="card-default p-6" data-testid="users-list">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Users</h2>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {users.slice(0, 5).map((u) => (
                    <div 
                      key={u.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        u.is_admin ? 'bg-purple-500' : 'bg-indigo-500'
                      }`}>
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                      {u.is_admin && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
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
