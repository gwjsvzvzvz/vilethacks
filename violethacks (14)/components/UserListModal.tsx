import React from 'react';
import { motion } from 'framer-motion';
import { X, Circle, Shield, Gem, User as UserIcon, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: User[];
  type: 'ONLINE' | 'ALL';
  onUserClick: (userId: string) => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ isOpen, onClose, title, users, type, onUserClick }) => {
  if (!isOpen) return null;

  // Simulate online status for the UI (randomly assign if type is ALL, strictly top if ONLINE)
  // In a real app, this comes from the DB
  const isOnline = (index: number) => type === 'ONLINE' || index % 3 === 0;

  const getRoleBadge = (role: string) => {
      switch(role) {
          case 'ADMIN': return <ShieldAlert className="w-3 h-3 text-red-400" />;
          case 'MODERATOR': return <Shield className="w-3 h-3 text-green-400" />;
          case 'SUPPORTER': return <Gem className="w-3 h-3 text-purple-400" />;
          default: return <UserIcon className="w-3 h-3 text-gray-400" />;
      }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
        case 'ADMIN': return 'text-red-400 bg-red-400/10 border-red-400/20';
        case 'MODERATOR': return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'SUPPORTER': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <UserIcon className="w-5 h-5 text-primary" />
             </div>
             <div>
                 <h2 className="text-lg font-bold text-white">{title}</h2>
                 <p className="text-xs text-gray-400">{users.length} users listed</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar p-2">
          {users.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No users found.</div>
          ) : (
              <div className="grid gap-2">
                  {users.map((user, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={user.id} 
                        onClick={() => onUserClick(user.id)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                                {isOnline(idx) && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0f0f12] rounded-full"></span>
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-white text-sm group-hover:text-primary transition-colors">{user.username}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    {isOnline(idx) ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border flex items-center gap-1 ${getRoleColor(user.role)}`}>
                            {getRoleBadge(user.role)}
                            {user.role}
                        </div>
                    </motion.div>
                  ))}
              </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserListModal;