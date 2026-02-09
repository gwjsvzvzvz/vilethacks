import React from 'react';
import { Users, MessageSquare, User, UserPlus } from 'lucide-react';
import { SiteStats } from '../types';

interface StatsBarProps {
  stats: SiteStats | null;
  onOpenOnline: () => void;
  onOpenMembers: () => void;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats, onOpenOnline, onOpenMembers }) => {
  if (!stats) return null;

  const items = [
    {
      id: 'online',
      icon: <Users className="w-5 h-5 text-emerald-400" />, 
      label: 'Online Members',
      value: stats.onlineMembers.toLocaleString(),
      isText: false,
      onClick: onOpenOnline,
      clickable: true
    },
    {
      id: 'comments',
      icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
      label: 'Total Comments',
      value: stats.totalComments.toLocaleString(),
      isText: false,
      onClick: undefined,
      clickable: false
    },
    {
      id: 'members',
      icon: <User className="w-5 h-5 text-primary" />,
      label: 'Total Members',
      value: stats.totalMembers.toLocaleString(),
      isText: false,
      onClick: onOpenMembers,
      clickable: true
    },
    {
      id: 'latest',
      icon: <UserPlus className="w-5 h-5 text-amber-400" />,
      label: 'Latest Member',
      value: stats.latestMember,
      isText: true,
      onClick: undefined,
      clickable: false
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
      <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-[0_0_40px_-10px_rgba(139,92,246,0.1)] bg-[#0f0f12]/60 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 md:divide-x divide-white/5">
          {items.map((item) => (
            <div 
                key={item.id} 
                onClick={item.onClick}
                className={`flex items-center gap-4 justify-center md:justify-start md:pl-4 group ${item.clickable ? 'cursor-pointer' : ''}`}
            >
              <div className={`p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 ${item.clickable ? 'group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]' : ''}`}>
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                  {item.label}
                </span>
                <span className={`font-bold text-white truncate ${item.isText ? 'text-sm' : 'text-xl'} ${item.clickable ? 'group-hover:text-primary transition-colors' : ''}`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;