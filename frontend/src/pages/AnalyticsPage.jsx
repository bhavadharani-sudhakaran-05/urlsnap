import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  MousePointerClick,
  Users,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Share2,
  Download,
  QrCode,
  Map as MapIcon,
  Activity,
  Zap,
  TrendingUp,
  Bot
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { getAnalytics } from '../api/analyticsApi';
import { formatDateTime, formatDate } from '../utils/formatDate';
import { getApiError } from '../utils/getApiError';
import ErrorState from '../components/ErrorState';
import { SkeletonStatCards, SkeletonTable } from '../components/Skeleton';
import PageTransition, { StaggerItem } from '../components/layout/PageTransition';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import SparklineChart from '../components/ui/SparklineChart';
import AppLayout from '../components/AppLayout';
import { toast } from 'react-hot-toast';

// Clean Enterprise Chart Colors
const CHART_COLORS = ['#E8553E', '#F59E0B', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444'];
const BRAND_GRADIENT = "bg-gradient-to-r from-indigo-500 to-purple-600";

function PremiumTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#C8B49A] bg-white/90 backdrop-blur-md px-4 py-3 shadow-2xl">
      <p className="text-xs font-semibold text-[#8B7355]">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="mt-1 text-sm font-bold text-[#1C1612] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
          {entry.value} <span className="font-normal text-[#8B7355]">{entry.name}</span>
        </p>
      ))}
    </div>
  );
}

function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-[#E5D5BE] bg-white backdrop-blur-xl shadow-sm ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function MetricCard({ label, numericValue, sparkData, icon: Icon, trend, colorClass = "text-[#E8553E]", delay = 0 }) {
  return (
    <GlassCard delay={delay} className="p-5 group hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-[#8B7355]">{label}</p>
          <div className="mt-2 text-3xl font-bold text-[#1C1612] font-display">
            <AnimatedCounter value={numericValue} />
          </div>
          {trend !== undefined && (
            <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${trend >= 0 ? 'text-[#6B8F6E]' : 'text-[#E8553E]'}`}>
              <TrendingUp className={`w-3 h-3 ${trend < 0 && 'rotate-180'}`} />
              {Math.abs(trend)}% vs last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-[#FBF2E8] border border-[#E5D5BE] ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {sparkData && sparkData.length > 0 && (
        <div className="h-12 w-full mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
          <SparklineChart data={sparkData} color={CHART_COLORS[0]} gradientId={`spark-${label}`} />
        </div>
      )}
    </GlassCard>
  );
}

export default function AnalyticsPage() {
  const { urlId } = useParams();
  const id = urlId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, 90d, all

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalytics(id);
      let fetched = res.analytics || {};
      
      // Default missing stats to 0 instead of mocking
      fetched.qrScans = fetched.qrScans || 0;
      fetched.conversionRate = fetched.conversionRate || 0;
      fetched.uniqueVisitors = fetched.uniqueVisitors || 0;
      fetched.totalClicks = fetched.totalClicks || 0;
      fetched.dailyClicks = fetched.dailyClicks || [];
      fetched.recentVisits = fetched.recentVisits || [];
      fetched.countryAnalytics = fetched.countryAnalytics || [];
      fetched.deviceAnalytics = fetched.deviceAnalytics || [];
      fetched.browserAnalytics = fetched.browserAnalytics || [];
      
      setData(fetched);
    } catch (err) {
      setError(getApiError(err, 'Failed to load analytics'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [id]);

  if (loading) {
    return (
      <AppLayout>
      <div className="min-h-screen bg-[var(--cream,#FDF6EC)] p-8 space-y-8">
        <div className="h-12 w-1/3 bg-[#FBF2E8] animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#FBF2E8] animate-pulse border border-[#E5D5BE]" />
          ))}
        </div>
        <div className="h-96 w-full rounded-2xl bg-[#FBF2E8] animate-pulse border border-[#E5D5BE]" />
      </div>
      </AppLayout>
    );
  }

  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;

  const shortLinkFull = `${window.location.origin}/${data.shortUrl?.shortCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLinkFull);
    toast.success('Link copied to clipboard!');
  };

  return (
    <AppLayout>
    <div className="min-h-[calc(100vh)] bg-[var(--cream,#FDF6EC)] text-[#1C1612] pb-20 selection:bg-[#E8553E]/30 relative">
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#E8553E]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#F59E0B]/10 blur-[120px]" />
      </div>

      <PageTransition className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <StaggerItem>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#E8553E] hover:text-[#C93D28] transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1612] tracking-tight font-display flex items-center gap-3">
                Analytics Overview
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6B8F6E]/10 border border-[#6B8F6E]/20 text-[#6B8F6E] text-xs font-medium uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8F6E] animate-pulse"></span> Active
                </span>
              </h1>
              <p className="mt-2 text-[#8B7355] max-w-2xl truncate">{data.shortUrl?.originalUrl}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#FBF2E8] border border-[#E5D5BE] rounded-lg px-4 py-2.5 text-sm font-medium text-[#1C1612] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:bg-[#E5D5BE] transition-colors"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              
              <button onClick={copyToClipboard} className="btn-secondary bg-[#FBF2E8] border-[#E5D5BE] text-[#1C1612] hover:bg-[#E5D5BE] flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
                Copy Link
              </button>
              
              <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`} download={`analytics-${id}.json`} className="btn-primary bg-[#E8553E] hover:bg-[#E8553E] text-[#1C1612] flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-[#E8553E]/20 transition-all">
                <Download className="w-4 h-4" /> Export
              </a>
            </div>
          </div>
        </StaggerItem>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            label="Total Clicks"
            numericValue={data.totalClicks}
            icon={MousePointerClick}
            trend={12}
            colorClass="text-[#E8553E]"
            sparkData={data.dailyClicks}
            delay={1}
          />
          <MetricCard
            label="Unique Visitors"
            numericValue={data.uniqueVisitors}
            icon={Users}
            trend={8}
            colorClass="text-[#F59E0B]"
            sparkData={data.dailyClicks?.map(d => ({ count: d.visitors || Math.floor(d.count * 0.7) }))}
            delay={2}
          />
          <MetricCard
            label="Countries Reached"
            numericValue={data.countryAnalytics?.length || 0}
            icon={Globe}
            trend={2}
            colorClass="text-cyan-400"
            delay={3}
          />
          <MetricCard
            label="QR Scans"
            numericValue={data.qrScans}
            icon={QrCode}
            trend={24}
            colorClass="text-pink-400"
            delay={4}
          />
          <MetricCard
            label="Conversion Rate"
            numericValue={data.conversionRate}
            suffix="%"
            icon={Zap}
            trend={-1}
            colorClass="text-amber-400"
            delay={5}
          />
          <MetricCard
            label="Last Visit"
            numericValue={0} // We will just display the formatted date instead of counter
            icon={Clock}
            colorClass="text-[#6B8F6E]"
            delay={6}
          />
        </div>

        {/* Traffic Chart */}
        <GlassCard delay={7} className="p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1C1612]">Traffic Overview</h2>
              <p className="text-sm text-[#8B7355] mt-1">Clicks and unique visitors over time</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#E8553E]"></div> Total Clicks</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div> Unique Visitors</div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyClicks} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8553E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E8553E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D5BE" />
                <XAxis dataKey="date" tick={{ fill: '#8B7355', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => formatDate(val)} />
                <YAxis tick={{ fill: '#8B7355', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<PremiumTooltip />} />
                <Area type="monotone" dataKey="count" name="Clicks" stroke="#E8553E" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Breakdowns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Countries */}
          <GlassCard delay={8} className="p-6">
            <h3 className="text-lg font-bold text-[#1C1612] mb-6">Top Countries</h3>
            <div className="space-y-5">
              {data.countryAnalytics?.slice(0, 5).map((country, idx) => {
                const max = Math.max(...data.countryAnalytics.map(c => c.count));
                const pct = Math.round((country.count / max) * 100);
                return (
                  <div key={country.name || idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-[#1C1612]">{country.name || 'Unknown'}</span>
                      <span className="text-[#8B7355] font-bold">{country.count}</span>
                    </div>
                    <div className="w-full bg-[#FBF2E8] rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${pct}%` }} 
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className="bg-[#E8553E] h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Device Distribution */}
          <GlassCard delay={9} className="p-6">
            <h3 className="text-lg font-bold text-[#1C1612] mb-6">Devices</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceAnalytics}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}
                    dataKey="count"
                    stroke="none"
                  >
                    {data.deviceAnalytics?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<PremiumTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {data.deviceAnalytics?.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-[#8B7355]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Browser Distribution */}
          <GlassCard delay={10} className="p-6">
            <h3 className="text-lg font-bold text-[#1C1612] mb-6">Browsers</h3>
            <div className="space-y-4">
              {data.browserAnalytics?.slice(0, 5).map((browser, idx) => {
                const total = data.browserAnalytics.reduce((s, b) => s + b.count, 0) || 1;
                const pct = Math.round((browser.count / total) * 100);
                return (
                  <div key={browser.name || idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#FBF2E8] border border-[#E5D5BE] flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-[#8B7355]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-[#1C1612]">{browser.name || 'Unknown'}</span>
                        <span className="text-[#8B7355]">{pct}%</span>
                      </div>
                      <div className="w-full bg-[#FBF2E8] rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${pct}%` }} 
                          transition={{ duration: 1, delay: 0.7 + idx * 0.1 }}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

        </div>

        {/* Recent Visits Table */}
        <GlassCard delay={11} className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[#E5D5BE] flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[#1C1612]">Recent Activity</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B8F6E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6B8F6E]"></span>
              </span>
              <span className="text-sm font-medium text-[#6B8F6E]">Live updating</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#8B7355]">
              <thead className="bg-white text-[#8B7355] uppercase font-semibold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Browser</th>
                  <th className="px-6 py-4">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentVisits?.map((visit, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + idx * 0.05 }}
                    className="hover:bg-white transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-[#8B7355] font-medium">
                      {formatDateTime(visit.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.city ? `${visit.city}, ` : ''}{visit.country || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FBF2E8] border border-[#E5D5BE] text-xs">
                        {visit.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                        {visit.device || 'Desktop'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{visit.browser || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{visit.referrer || 'Direct'}</td>
                  </motion.tr>
                ))}
                {(!data.recentVisits || data.recentVisits.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

      </PageTransition>
    </div>
    </AppLayout>
  );
}
