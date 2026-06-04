import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const bentoFeatures = [
  {
    icon: (
      <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ), 
    title: 'Instant Shortening', 
    desc: 'Deployed on edge infrastructure. Links generate in milliseconds and resolve globally with zero latency.',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1',
    bg: 'bg-zinc-900/50',
    visual: (
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none overflow-hidden rounded-r-3xl flex items-center justify-end pr-8">
        <div className="w-48 h-48 border-[1px] border-zinc-700 rounded-full flex items-center justify-center">
          <div className="w-32 h-32 border-[1px] border-zinc-600 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border-[1px] border-zinc-500 rounded-full bg-coral/20 blur-[2px]" />
          </div>
        </div>
      </div>
    )
  },
  { 
    icon: (
      <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ), 
    title: 'Live Analytics', 
    desc: 'Enterprise-grade telemetry. Track every click instantly without sampling delays.',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1 md:row-span-2',
    bg: 'bg-zinc-900/80',
    visual: (
      <div className="mt-8 flex h-32 items-end gap-1.5 px-2 opacity-70">
        {[40, 70, 45, 90, 60, 100, 85].map((h, i) => (
          <motion.div 
            key={i} 
            initial={{ height: 0 }} 
            whileInView={{ height: `${h}%` }} 
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5, type: 'spring', stiffness: 100 }}
            viewport={{ once: true }}
            className="flex-1 bg-gradient-to-t from-coral to-amber rounded-t-sm" 
          />
        ))}
      </div>
    )
  },
  { 
    icon: (
      <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ), 
    title: 'Custom Aliases', 
    desc: 'Create memorable branded links to increase click-through rates by up to 34%.',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    bg: 'bg-zinc-950',
  },
  { 
    icon: (
      <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ), 
    title: 'API First', 
    desc: 'Integrate link generation programmatically into your existing software stack.',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    bg: 'bg-zinc-900/40',
  },
  { 
    icon: (
      <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ), 
    title: 'Enterprise Security', 
    desc: 'Advanced access controls, auto-expiry, and SOC2 compliance for teams.',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1',
    bg: 'bg-zinc-950',
  }
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0A0A0A] text-zinc-200 font-sans selection:bg-coral/30 selection:text-white">
      
      {/* Premium Dark Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-coral opacity-[0.15] blur-[100px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]"></div>
      </div>

      {/* Navbar - Ultra-sleek */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 sm:px-12 ${
          scrolled 
            ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-zinc-800/80 shadow-sm' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-coral text-white transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(232,85,62,0.3)]">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Zestlink</span>
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          {['Features', 'Developers', 'Pricing'].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`}
               className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
               {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Log in</Link>
          <Link to="/register">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-md bg-coral text-white px-4 py-2 text-sm font-semibold transition-all hover:bg-coral-dark"
            >
              Sign up
            </motion.span>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[95vh] flex-col items-center justify-start px-6 pt-40 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center max-w-5xl mx-auto w-full">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <a href="#" className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/5 backdrop-blur-sm px-3 py-1 text-xs font-medium text-coral hover:bg-coral/10 transition-colors">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
              </span>
              Zestlink Enterprise is now generally available
              <svg className="w-3 h-3 text-coral/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </a>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 max-w-5xl text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400"
          >
            The URL infrastructure <br className="hidden md:block"/> for modern teams.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-400 font-medium"
          >
            Secure, scalable, and ridiculously fast. Zestlink provides the APIs and dashboard you need to manage branded links at scale.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(232,85,62,0.3)' }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-coral px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-coral-dark h-12 shadow-[0_0_15px_rgba(232,85,62,0.2)]"
              >
                Start deploying
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(39,39,42,1)' }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-8 py-3.5 text-sm font-medium text-white transition-all h-12 hover:border-zinc-700"
              >
                Read documentation
              </motion.button>
            </Link>
          </motion.div>

          {/* High-Fidelity Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-24 w-full max-w-6xl"
          >
            <div className="absolute inset-0 -top-8 rounded-[2rem] bg-coral/10 blur-[80px]" />
            <div className="relative rounded-xl border border-zinc-800 bg-[#0A0A0A] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-1 ring-white/5">
              
              {/* Window Controls */}
              <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-[#111]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                </div>
                <div className="mx-auto flex h-7 items-center justify-center rounded-md bg-zinc-900 px-3 text-[12px] font-mono text-zinc-500 border border-zinc-800">
                  <svg className="w-3 h-3 mr-2 opacity-60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  app.zestlink.com
                </div>
                <div className="w-10"></div> {/* Spacer for alignment */}
              </div>

              {/* Application UI Mock */}
              <div className="p-6 md:p-8 flex gap-8 h-[400px] text-left">
                {/* Sidebar mock */}
                <div className="hidden md:flex flex-col w-48 gap-2">
                  <div className="h-8 w-full rounded bg-zinc-800/50" />
                  <div className="h-8 w-3/4 rounded bg-zinc-900" />
                  <div className="h-8 w-5/6 rounded bg-zinc-900" />
                  <div className="h-8 w-full rounded bg-zinc-900 mt-8" />
                  <div className="h-8 w-2/3 rounded bg-zinc-900" />
                </div>
                
                {/* Main Content mock */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                    <div className="h-6 w-32 rounded bg-zinc-700" />
                    <div className="h-8 w-24 rounded bg-zinc-200" />
                  </div>
                  
                  {/* Grid of metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="rounded-lg border border-zinc-800 bg-[#111] p-4 flex flex-col gap-3">
                        <div className="h-4 w-16 rounded bg-zinc-800" />
                        <div className="h-8 w-24 rounded bg-zinc-700" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart Line Mock */}
                  <div className="flex-1 border border-zinc-800 rounded-lg bg-[#111] p-4 relative overflow-hidden flex items-end">
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                        viewport={{ once: true }}
                        d="M0 80 Q 20 60, 40 70 T 80 40 T 100 20 L 100 100 L 0 100 Z" 
                        fill="rgba(232,85,62,0.15)" 
                      />
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                        viewport={{ once: true }}
                        d="M0 80 Q 20 60, 40 70 T 80 40 T 100 20" 
                        fill="none" 
                        stroke="#e8553e" 
                        strokeWidth="2" 
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 border-y border-zinc-900 bg-[#050505] py-16 mt-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale mix-blend-screen">
            {['ACME Corp', 'Quantum', 'Nebula', 'Echo', 'Vertex'].map(brand => (
              <span key={brand} className="text-xl font-bold tracking-tighter text-zinc-300 font-display">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Sleek Bento */}
      <section id="features" className="relative z-10 py-32 bg-[#0A0A0A]">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Built for performance.</h2>
            <p className="mt-4 text-xl text-zinc-400 font-medium max-w-2xl">Everything you need to manage, track, and scale your links without compromising on speed or security.</p>
          </motion.div>
          
          <motion.div 
            variants={stagger} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }} 
            className="grid gap-4 md:gap-4 grid-cols-1 md:grid-cols-3 auto-rows-[280px]"
          >
            {bentoFeatures.map(f => (
              <motion.div 
                key={f.title} 
                variants={item} 
                className={`group relative overflow-hidden rounded-2xl border border-zinc-800 ${f.bg} ${f.colSpan} ${f.rowSpan} p-8 transition-colors hover:bg-zinc-800/80 flex flex-col justify-between`}
              >
                {/* Subtle radial gradient on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {f.visual}

                <div className="relative z-10">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50 text-xl shadow-sm">{f.icon}</div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400 max-w-md">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-zinc-900 bg-[#0A0A0A] pt-16 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-coral text-white shadow-sm">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></svg>
                </div>
                <span className="text-sm font-bold tracking-tight text-white">Zestlink</span>
              </Link>
              <p className="text-sm text-zinc-500 max-w-xs">The robust URL infrastructure designed for modern engineering and marketing teams.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Analytics', 'API', 'Pricing'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">© 2026 Zestlink Inc. Powered by katomaran. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(l => (
                <a key={l} href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
