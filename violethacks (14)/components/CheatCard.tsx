import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Info, User, ArrowUpRight, Download } from 'lucide-react';
import { Cheat } from '../types';

interface CheatCardProps {
  cheat: Cheat;
  index: number;
  onClick: () => void;
  onAuthorClick: (authorId: string) => void;
}

const CheatCard: React.FC<CheatCardProps> = ({ cheat, index, onClick, onAuthorClick }) => {
  const statusConfig = {
    'UNDETECTED': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Shield className="w-3 h-3" /> },
    'DETECTED': { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertTriangle className="w-3 h-3" /> },
    'TESTING': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Info className="w-3 h-3" /> },
  };

  const status = statusConfig[cheat.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative flex flex-col h-full bg-[#121215] border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-4px]"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none -z-10" />
      <div className="absolute inset-0 border border-primary/50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full relative z-10">
          
          <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-2">
                 <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${status.bg} ${status.color} ${status.border}`}>
                     {status.icon}
                     {cheat.status}
                 </div>
             </div>
             <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                 {cheat.version}
             </span>
          </div>

          <div className="mb-4">
              <div className="text-[10px] text-primary font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {cheat.game}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                  {cheat.title}
              </h3>
          </div>

          <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed line-clamp-2">
              {cheat.description}
          </p>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
              <div 
                onClick={(e) => { e.stopPropagation(); onAuthorClick(cheat.authorId); }}
                className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-white hover:underline transition-colors cursor-pointer"
              >
                  <User className="w-3 h-3" />
                  {cheat.authorName}
              </div>
              
              <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {cheat.downloads}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                  </div>
              </div>
          </div>
      </div>
    </motion.div>
  );
};

export default CheatCard;