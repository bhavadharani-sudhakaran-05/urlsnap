import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Upload, 
  Link2, 
  MousePointerClick, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Label
} from 'recharts';

import { useAuth } from '../context/AuthContext';
import { useUrls } from '../hooks/useUrls';
import { useAnalytics } from '../hooks/useAnalytics';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
};

import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import UrlTable from '../components/UrlTable';
import UrlCard from '../components/UrlCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);

  // Tab & Filter State
  const activeTab = searchParams.get('tab') === 'analytics' ? 'analytics' : 'links';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [period, setPeriod] = useState('30');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Custom Hooks
  const { 
    urls, pagination, loading, overviewLoading, overview, 
    fetchUrls, fetchOverview, deleteUrl, copyToClipboard
  } = useUrls();

  const {
    globalAnalytics, loading: analyticsLoading, fetchGlobalAnalytics
  } = useAnalytics();

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Links
  useEffect(() => {
    fetchUrls({ search: debouncedSearch, sort: sortBy, page: 1, limit: 10 });
    fetchOverview();
  }, [debouncedSearch, sortBy, fetchUrls, fetchOverview]);

  // Fetch Analytics
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchGlobalAnalytics(period);
    }
  }, [activeTab, period, fetchGlobalAnalytics]);

  const firstName = user?.name?.split(' ')[0] || 'User';
  const activeCount = overview?.activeLinks || 0;
  const expiryCount = overview?.linksWithExpiry || 0;

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handlePageChange = (newPage) => {
    fetchUrls({ search: debouncedSearch, sort: sortBy, page: newPage, limit: 10 });
  };

  const modalsProps = {
    showCreateModal, setShowCreateModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal,
    showQRModal, setShowQRModal,
    showBulkModal, setShowBulkModal,
    selectedUrl,
    onCreateSuccess: () => { fetchUrls({ search: debouncedSearch, sort: sortBy, page: 1 }); fetchOverview(); },
    onEditSuccess: () => { fetchUrls({ search: debouncedSearch, sort: sortBy, page: pagination.page }); fetchOverview(); },
    onDeleteConfirm: async () => {
      try {
        await deleteUrl(selectedUrl._id || selectedUrl.id);
        setShowDeleteModal(false);
        fetchOverview();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    },
    onBulkSuccess: () => { fetchUrls({ search: '', sort: '-createdAt', page: 1 }); fetchOverview(); }
  };

  const COLORS = ['#E8553E', '#F59E0B', '#6B8F6E'];

  return (
    <AppLayout modalsProps={modalsProps}>
      {/* HEADER */}
      <div className="pt-8 px-5 lg:px-10 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-sans text-[12px] text-coral font-bold tracking-[2px] uppercase mb-1">
              Dashboard
            </div>
            <h1 className="font-display text-[36px] font-black text-ink m-0 leading-tight">
              Welcome back, {firstName}.
            </h1>
            <p className="font-sans text-[14px] text-muted mt-1.5">
              Here's what your links are doing today.
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="shrink-0 flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-sans text-[14px] font-medium px-5 py-2.5 rounded-lg transition-all border-none cursor-pointer shadow-[0_4px_14px_rgba(232,85,62,0.25)] hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Shorten a URL
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="pt-5 px-5 lg:px-10 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-2 border-b border-border">
          <button 
            onClick={() => handleTabChange('links')}
            className={`px-5 py-2.5 font-sans text-[14px] font-semibold border-b-[2.5px] bg-transparent cursor-pointer transition-colors ${activeTab === 'links' ? 'border-coral text-coral' : 'border-transparent text-muted hover:text-ink'}`}
          >
            My Links
          </button>
          <button 
            onClick={() => handleTabChange('analytics')}
            className={`px-5 py-2.5 font-sans text-[14px] font-semibold border-b-[2.5px] bg-transparent cursor-pointer transition-colors ${activeTab === 'analytics' ? 'border-coral text-coral' : 'border-transparent text-muted hover:text-ink'}`}
          >
            Analytics Overview
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="py-6 px-5 lg:px-10 max-w-[1200px] mx-auto w-full mb-10">
        
        {activeTab === 'links' && (
          <>
            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard 
                icon={Link2} 
                label="Total Links" 
                value={overview?.totalLinks || 0} 
                colorClass="coral" 
                loading={overviewLoading}
                trend={{ value: "+3 this week", positive: true }} 
              />
              <StatCard 
                icon={MousePointerClick} 
                label="Total Clicks" 
                value={(overview?.totalClicks || 0).toLocaleString()} 
                colorClass="amber" 
                loading={overviewLoading}
                trend={{ value: "+127 today", positive: true }} 
              />
              <StatCard 
                icon={CheckCircle} 
                label="Active Links" 
                value={activeCount} 
                colorClass="sage" 
                loading={overviewLoading}
              />
              <StatCard 
                icon={Clock} 
                label="With Expiry" 
                value={expiryCount} 
                colorClass="ink" 
                loading={overviewLoading}
              />
            </div>

            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
              <div className="flex-1 relative min-w-[200px]">
                <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted-light" />
                <input 
                  type="text" 
                  placeholder="Search links, aliases, URLs..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-border rounded-[10px] pl-[40px] pr-[14px] py-[10px] font-sans text-[14px] text-ink outline-none transition-all focus:border-coral focus:shadow-[0_0_0_4px_rgba(232,85,62,0.1)]"
                />
              </div>
              
              <div className="relative shrink-0">
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full md:w-auto appearance-none bg-white border-[1.5px] border-border rounded-[10px] pl-[14px] pr-[36px] py-[10px] font-sans text-[14px] text-ink outline-none cursor-pointer"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-clicks">Most Clicks</option>
                  <option value="clicks">Least Clicks</option>
                </select>
                <ChevronDown size={16} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowBulkModal(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-[1.5px] border-border hover:bg-surface text-ink font-sans text-[14px] font-medium px-4 py-[10px] rounded-[10px] transition-colors cursor-pointer"
                >
                  <Upload size={16} className="text-muted" />
                  Bulk Upload
                </button>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-sans text-[14px] font-medium px-4 py-[10px] rounded-[10px] transition-colors border-none cursor-pointer"
                >
                  <Plus size={16} />
                  Shorten URL
                </button>
              </div>
            </div>

            <div className="font-sans text-[13px] text-muted mb-3">
              Showing {urls.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} links
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            {/* URL LIST */}
            {!isMobile ? (
              <div className="md:block">
                <UrlTable 
                  urls={urls} 
                  loading={loading}
                  onEdit={(url) => { setSelectedUrl(url); setShowEditModal(true); }}
                  onDelete={(url) => { setSelectedUrl(url); setShowDeleteModal(true); }}
                  onQR={(url) => { setSelectedUrl(url); setShowQRModal(true); }}
                  onAnalytics={(url) => navigate(`/analytics/${url._id}`)}
                  onCreateNew={() => setShowCreateModal(true)}
                  onCopy={copyToClipboard}
                />
              </div>
            ) : (
              <div className="block">
                {loading ? (
                  // Simple skeletons for mobile
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white border-[1.5px] border-border rounded-[16px] p-[18px] mb-3 h-[180px] skeleton" />
                  ))
                ) : urls.length === 0 ? (
                  <div className="bg-white border-[1.5px] border-border rounded-[16px] p-8 text-center">
                    <h3 className="font-display text-[20px] font-bold text-ink">No links found</h3>
                  </div>
                ) : (
                  urls.map(url => (
                    <UrlCard 
                      key={url._id} 
                      url={url}
                      onEdit={(url) => { setSelectedUrl(url); setShowEditModal(true); }}
                      onDelete={(url) => { setSelectedUrl(url); setShowDeleteModal(true); }}
                      onQR={(url) => { setSelectedUrl(url); setShowQRModal(true); }}
                      onAnalytics={(url) => navigate(`/analytics/${url._id}`)}
                      onCopy={copyToClipboard}
                    />
                  ))
                )}
              </div>
            )}

            {/* PAGINATION */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-5">
                <button 
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-3 py-2 bg-white border border-border rounded-lg font-sans text-[13px] font-medium text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface cursor-pointer"
                >
                  ← Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                  // Simplified pagination logic for UI
                  let pageNum = i + 1;
                  if (pagination.pages > 5 && pagination.page > 3) {
                    pageNum = pagination.page - 2 + i;
                    if (pageNum > pagination.pages) return null;
                  }
                  
                  const isActive = pageNum === pagination.page;
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-[36px] h-[36px] rounded-lg font-sans text-[14px] font-medium transition-colors border cursor-pointer ${
                        isActive 
                          ? 'bg-coral text-white border-coral' 
                          : 'bg-white text-muted border-border hover:border-coral hover:text-coral'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button 
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-3 py-2 bg-white border border-border rounded-lg font-sans text-[13px] font-medium text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            {/* PERIOD SELECTOR */}
            <div className="flex justify-end mb-4">
              <div className="flex bg-surface border border-border rounded-full p-1">
                {['7', '14', '30', '90'].map(d => (
                  <button 
                    key={d}
                    onClick={() => setPeriod(d)}
                    className={`px-[14px] py-1.5 rounded-full font-sans text-[12px] font-bold transition-all cursor-pointer border-none ${
                      period === d ? 'bg-coral text-white shadow-sm' : 'bg-transparent text-muted hover:text-ink'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN CHART */}
            <div className="bg-white border-[1.5px] border-border rounded-[20px] p-7 mb-4">
              <h2 className="font-display text-[20px] font-extrabold text-ink m-0">Total Click Performance</h2>
              <p className="font-sans text-[13px] text-muted mt-1 mb-6">All links combined · Last {period} days</p>
              
              <div className="h-[280px] w-full">
                {analyticsLoading ? (
                  <div className="w-full h-full skeleton rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={globalAnalytics?.dailyTrend || []}>
                      <defs>
                        <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E8553E" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#E8553E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5D5BE" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8B7355', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8B7355', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }} 
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--ink)', borderRadius: '10px', border: 'none', padding: '10px 14px', color: 'white' }}
                        itemStyle={{ color: 'white', fontWeight: 700 }}
                        labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#E8553E" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#coralGrad)" 
                        activeDot={{ r: 6, fill: '#E8553E', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* DEVICE BREAKDOWN */}
              <div className="bg-white border-[1.5px] border-border rounded-[20px] p-6 relative">
                <h3 className="font-display text-[18px] font-extrabold text-ink m-0">Device Breakdown</h3>
                <p className="font-sans text-[12px] text-muted mt-1 mb-4">Where your visitors come from</p>
                
                <div className="h-[200px] w-full flex items-center justify-center relative">
                  {analyticsLoading ? (
                    <div className="w-[180px] h-[180px] rounded-full skeleton" />
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={globalAnalytics?.devices || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {(globalAnalytics?.devices || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="font-display text-[24px] font-black text-ink leading-none">
                          {globalAnalytics?.totalClicks || 0}
                        </div>
                        <div className="font-sans text-[11px] text-muted">Visits</div>
                      </div>
                    </  >
                  )}
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="bg-white border-[1.5px] border-border rounded-[20px] p-6">
                <h3 className="font-display text-[18px] font-extrabold text-ink m-0 mb-4">Quick Numbers</h3>
                <div className="grid grid-cols-2 gap-3 h-[calc(100%-40px)]">
                  <div className="bg-surface rounded-[10px] p-3.5 flex flex-col justify-center">
                    <div className="font-display text-[24px] font-black text-coral">
                      {globalAnalytics?.avgClicksPerLink || 0}
                    </div>
                    <div className="font-sans text-[11px] text-muted mt-1">Avg Clicks/Link</div>
                  </div>
                  <div className="bg-surface rounded-[10px] p-3.5 flex flex-col justify-center">
                    <div className="font-display text-[24px] font-black text-amber">
                      {globalAnalytics?.linksCreatedToday || 0}
                    </div>
                    <div className="font-sans text-[11px] text-muted mt-1">Links Created Today</div>
                  </div>
                  <div className="bg-surface rounded-[10px] p-3.5 flex flex-col justify-center">
                    <div className="font-sans text-[18px] font-bold text-sage truncate">
                      {globalAnalytics?.mostClickedLink || '—'}
                    </div>
                    <div className="font-sans text-[11px] text-muted mt-1">Most Clicked Link</div>
                  </div>
                  <div className="bg-surface rounded-[10px] p-3.5 flex flex-col justify-center">
                    <div className="font-display text-[24px] font-black text-ink">
                      {globalAnalytics?.expiringSoon || 0}
                    </div>
                    <div className="font-sans text-[11px] text-muted mt-1">Links Expiring Soon</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
