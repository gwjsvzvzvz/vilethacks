import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Shield, ShieldAlert, Gem, Star, Download, Gamepad2 } from 'lucide-react';
import { User as UserType, Cheat } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  userCheats: Cheat[];
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, userCheats }) => {
  if (!isOpen || !user) return null;

  const roleBadge = (role: string) => {
      switch(role) {
          case 'ADMIN': return <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 uppercase font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Admin</span>;
          case 'MODERATOR': return <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 uppercase font-bold flex items-center gap-1"><Shield className="w-3 h-3" /> Mod</span>;
          case 'SUPPORTER': return <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 uppercase font-bold flex items-center gap-1"><Gem className="w-3 h-3" /> Supporter</span>;
          default: return <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded border border-gray-500/30 uppercase font-bold flex items-center gap-1"><User className="w-3 h-3" /> Member</span>;
      }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/10 to-purple-900/10 relative shrink-0">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10 p-2 bg-black/20 rounded-full backdrop-blur-md">
                <X className="w-5 h-5" />
             </button>
        </div>

        <div className="px-8 relative flex-1 overflow-y-auto custom-scrollbar pb-8">
            {/* Avatar - overlapping banner */}
            <div className="-mt-12 mb-4 relative inline-block">
                <div className="w-24 h-24 rounded-full border-4 border-[#0f0f12] bg-[#18181b] overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/10">
                            <User className="w-10 h-10 text-gray-500" />
                        </div>
                    )}
                </div>
                {user.isBanned && (
                    <div className="absolute bottom-1 right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0f0f12]">
                        BANNED
                    </div>
                )}
            </div>

            {/* Header Info */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">{user.username}</h2>
                    {roleBadge(user.role)}
                </div>
                
                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.badges.map(badge => (
                            <span key={badge} className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-500" />
                                {badge}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-6">
                    {user.bio || "No bio provided."}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4">
                     <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/5 flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Member Since</div>
                            <div className="text-sm font-medium text-white">{formatDate(user.joinedAt)}</div>
                        </div>
                     </div>
                     <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/5 flex items-center gap-3">
                        <Gamepad2 className="w-4 h-4 text-gray-400" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Total Uploads</div>
                            <div className="text-sm font-medium text-white">{userCheats.length}</div>
                        </div>
                     </div>
                </div>
            </div>

            {/* User's Cheats */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Published Hacks
                </h3>
                
                <div className="space-y-3">
                    {userCheats.length === 0 ? (
                        <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5 text-gray-500 text-sm">
                            This user hasn't uploaded any hacks yet.
                        </div>
                    ) : (
                        userCheats.map(cheat => (
                            <div key={cheat.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">{cheat.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <span className="bg-white/5 px-1.5 py-0.5 rounded">{cheat.game}</span>
                                        <span>•</span>
                                        <span>{cheat.downloads} downloads</span>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                                    cheat.status === 'UNDETECTED' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                                    cheat.status === 'DETECTED' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                    'text-amber-400 border-amber-500/20 bg-amber-500/10'
                                }`}>
                                    {cheat.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;