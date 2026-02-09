import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
  stats: {
    activeHacks: number;
    downloads: number;
  };
}

const Hero: React.FC<HeroProps> = ({ onNavigate, stats }) => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6 backdrop-blur-sm">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             <span>v2.0 is now live</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            The <span className="text-gradient">One-Step</span> Solution<br />
            for Legit Gaming
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            VioletHacks provides a secure, community-driven platform for high-quality game modifications. 
            Undetected, performant, and designed for the modern gamer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('community')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
            >
              Explore Hacks
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('safety')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety Guarantee
            </button>
          </div>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10"
        >
            <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stats.activeHacks}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Active Hacks</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stats.downloads.toLocaleString()}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Downloads</div>
            </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Uptime</div>
            </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Support</div>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;