import { motion } from 'framer-motion';
import { Bot, Globe, Laptop, Link2, TrendingUp } from 'lucide-react';

function buildInsights(data) {
  const insights = [];
  const daily = data.dailyClicks || [];
  const countries = data.countryAnalytics || [];
  const devices = data.deviceAnalytics || [];
  const total = data.totalClicks || 0;

  if (daily.length >= 2) {
    const recent = daily.slice(-7);
    const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
    const secondHalf = recent.slice(Math.ceil(recent.length / 2));
    const sum = (arr) => arr.reduce((s, d) => s + d.count, 0);
    const a = sum(firstHalf) || 1;
    const b = sum(secondHalf);
    const pct = Math.round(((b - a) / a) * 100);
    if (pct !== 0) {
      insights.push({
        icon: TrendingUp,
        text: pct > 0 ? `Clicks increased by ${pct}% recently` : `Clicks decreased by ${Math.abs(pct)}% recently`,
        tone: pct > 0 ? 'positive' : 'neutral',
      });
    }
  }

  if (countries[0]?.name) {
    insights.push({
      icon: Globe,
      text: `Most visitors from ${countries[0].name}`,
      tone: 'info',
    });
  }

  const desktop = devices.find((d) => /desktop/i.test(d.name));
  const mobile = devices.find((d) => /mobile|phone/i.test(d.name));
  const deskCount = desktop?.count || 0;
  const mobCount = mobile?.count || 0;
  const deviceTotal = deskCount + mobCount || total || 1;
  if (deskCount || mobCount) {
    const pct = Math.round((deskCount / deviceTotal) * 100);
    insights.push({
      icon: Laptop,
      text: `${pct}% desktop traffic`,
      tone: 'info',
    });
  }

  if (data.topBrowser?.name && data.topBrowser.name !== 'N/A') {
    insights.push({
      icon: Link2,
      text: `Top browser: ${data.topBrowser.name}`,
      tone: 'neutral',
    });
  }

  if (total > 0 && insights.length < 4) {
    insights.push({
      icon: Bot,
      text: total < 10 ? 'Share your link to grow traffic faster' : 'Peak engagement — keep promoting your short link',
      tone: 'tip',
    });
  }

  return insights.slice(0, 4);
}

export default function AIInsightsPanel({ data }) {
  const insights = buildInsights(data);

  if (!insights.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card relative overflow-hidden p-5 sm:p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-violet-500/5 to-cyan-500/5" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/25">
            <Bot className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">AI Insights</h3>
            <p className="text-xs text-ink-muted">Generated from your traffic patterns</p>
          </div>
        </div>
        <ul className="space-y-3">
          {insights.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-start gap-3 rounded-xl border border-brand-500/10 bg-white/50 px-3 py-2.5 dark:bg-white/[0.03]"
            >
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span className="text-sm text-ink-muted">{item.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
