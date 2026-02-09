import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User as UserIcon, Settings, LayoutGrid, Edit2, CheckCircle2, Loader2, Link, ShieldAlert, Trash2, XCircle, AlertCircle, Users, Ban, Shield, Gem, Star, Calendar } from 'lucide-react';
import { User, Cheat, UserRole } from '../types';
import { updateUserAdminData } from '../mockDb';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  userCheats: Cheat[];
  allUsers?: User[]; // For admin
  onUpdateProfile: (user: User) => Promise<void>;
  onUpdateCheat: (cheat: Cheat) => Promise<void>;
  onDeleteCheat: (cheatId: string) => Promise<void>;
  onToggleBan?: (userId: string) => Promise<void>;
  onUpdateRole?: (userId: string, newRole: UserRole) => Promise<void>;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  userCheats, 
  allUsers = [],
  onUpdateProfile, 
  onUpdateCheat,
  onDeleteCheat,
  onToggleBan,
  onUpdateRole
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cheats' | 'users'>('profile');
  const [activeUserFilter, setActiveUserFilter] = useState<'ALL' | 'BANNED'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  
  // Admin Management State
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    bio: currentUser.bio || '',
    avatar: currentUser.avatar || ''
  });

  // Cheat Edit State
  const [editingCheatId, setEditingCheatId] = useState<string | null>(null);
  const [editCheatData, setEditCheatData] = useState<Partial<Cheat>>({});

  useEffect(() => {
    setProfileData({
      bio: currentUser.bio || '',
      avatar: currentUser.avatar || ''
    });
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdateProfile({
        ...currentUser,
        bio: profileData.bio,
        avatar: profileData.avatar
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditCheat = (cheat: Cheat) => {
    setEditingCheatId(cheat.id);
    setEditCheatData({ ...cheat });
  };

  const saveCheat = async () => {
    if (!editingCheatId || !editCheatData) return;
    setIsLoading(true);
    try {
        const originalCheat = userCheats.find(c => c.id === editingCheatId);
        if (originalCheat) {
             await onUpdateCheat({ ...originalCheat, ...editCheatData } as Cheat);
        }
        setEditingCheatId(null);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStatusChange = async (cheat: Cheat, newStatus: 'VERIFIED' | 'REJECTED') => {
      setIsLoading(true);
      try {
          await onUpdateCheat({ ...cheat, verificationStatus: newStatus });
      } finally {
          setIsLoading(false);
      }
  };

  const handleDelete = async (cheatId: string) => {
      if (confirm('Are you sure you want to permanently delete this post?')) {
          setIsLoading(true);
          try {
              await onDeleteCheat(cheatId);
          } finally {
              setIsLoading(false);
          }
      }
  };

  const handleBanToggle = async (userId: string, isCurrentlyBanned: boolean) => {
      if (!onToggleBan) return;
      if (confirm(`Are you sure you want to ${isCurrentlyBanned ? 'UNBAN' : 'BAN'} this user?`)) {
          setIsLoading(true);
          try {
              await onToggleBan(userId);
          } finally {
              setIsLoading(false);
          }
      }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
      if (!onUpdateRole) return;
      setIsLoading(true);
      try {
          await onUpdateRole(userId, newRole as UserRole);
      } finally {
          setIsLoading(false);
      }
  };

  // Admin: Save specific user data (notes/badges)
  const handleSaveAdminData = async (user: User) => {
      setIsLoading(true);
      try {
          await updateUserAdminData(user.id, adminNoteInput, user.badges || []);
          setExpandedUserId(null);
      } finally {
          setIsLoading(false);
      }
  };

  const toggleBadge = async (user: User, badge: string) => {
      const currentBadges = user.badges || [];
      const newBadges = currentBadges.includes(badge) 
          ? currentBadges.filter(b => b !== badge)
          : [...currentBadges, badge];
      
      // Optimistic update in UI handled by parent re-render usually, but for mock we just wait
      await updateUserAdminData(user.id, user.adminNotes || '', newBadges);
      // Force refresh logic would go here in real app
  };

  const verificationBadge = (status: string) => {
      switch(status) {
          case 'VERIFIED': return <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 rounded uppercase"><CheckCircle2 className="w-3 h-3" /> Live</span>;
          case 'REJECTED': return <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 rounded uppercase"><XCircle className="w-3 h-3" /> Rejected</span>;
          default: return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase"><AlertCircle className="w-3 h-3" /> Pending</span>;
      }
  };

  const roleBadge = (role: string) => {
      switch(role) {
          case 'ADMIN': return <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 uppercase font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Admin</span>;
          case 'MODERATOR': return <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30 uppercase font-bold flex items-center gap-1"><Shield className="w-3 h-3" /> Mod</span>;
          case 'SUPPORTER': return <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 uppercase font-bold flex items-center gap-1"><Gem className="w-3 h-3" /> Supporter</span>;
          default: return <span className="text-[10px] bg-gray-500/20 text-gray-400 px-1.5 py-0.5 rounded border border-gray-500/30 uppercase font-bold flex items-center gap-1"><UserIcon className="w-3 h-3" /> Member</span>;
      }
  };

  // Filter Users
  const displayUsers = activeUserFilter === 'BANNED' 
    ? allUsers.filter(u => u.isBanned) 
    : allUsers;

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
        className="relative w-full max-w-5xl bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex shrink-0">
            {/* Sidebar / Tabs */}
            <div className="w-64 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-8 px-2">
                     {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-primary/30" />
                     ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <UserIcon className="w-5 h-5" />
                        </div>
                     )}
                     <div className="overflow-hidden">
                         <div className="font-bold text-white truncate">{currentUser.username}</div>
                         <div className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                            {roleBadge(currentUser.role)}
                         </div>
                     </div>
                </div>

                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-primary/20 text-white border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                </button>
                <button 
                    onClick={() => setActiveTab('cheats')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'cheats' ? 'bg-primary/20 text-white border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                    {currentUser.role === 'ADMIN' ? 'Global Post Management' : 'My Cheats'}
                </button>
                
                {currentUser.role === 'ADMIN' && (
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-primary/20 text-white border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Users className="w-4 h-4" />
                        User Management
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                        {activeTab === 'profile' ? 'Edit Profile' : 
                         activeTab === 'cheats' ? (currentUser.role === 'ADMIN' ? 'Global Post Management' : 'Manage Your Uploads') :
                         'User Administration'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 max-w-xl">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Member Since</div>
                                    <div className="text-white font-medium">
                                        {currentUser.joinedAt ? new Date(currentUser.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Badges Display */}
                            {currentUser.badges && currentUser.badges.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-2 block">Your Badges</label>
                                    <div className="flex flex-wrap gap-2">
                                        {currentUser.badges.map(b => (
                                            <span key={b} className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400" />
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Avatar URL</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <Link className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                            <input 
                                                value={profileData.avatar}
                                                onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                                placeholder="https://imgur.com/..."
                                            />
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {profileData.avatar ? (
                                                <img src={profileData.avatar} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-5 h-5 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Bio</label>
                                    <textarea 
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                        rows={4}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-4 text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-600 resize-none"
                                        placeholder="Tell the community about yourself..."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-lg shadow-primary/20 font-medium disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* CHEATS TAB */}
                    {activeTab === 'cheats' && (
                        <div className="space-y-4">
                            {userCheats.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    {currentUser.role === 'ADMIN' ? 'No hacks uploaded yet.' : "You haven't uploaded any hacks yet."}
                                </div>
                            ) : (
                                userCheats.map(cheat => (
                                    <div key={cheat.id} className={`bg-white/5 border border-white/5 rounded-xl p-4 transition-all hover:border-white/10 ${cheat.verificationStatus === 'PENDING' && currentUser.role === 'ADMIN' ? 'border-l-4 border-l-amber-500' : cheat.verificationStatus === 'REJECTED' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'}`}>
                                        {editingCheatId === cheat.id ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input 
                                                        value={editCheatData.title || ''}
                                                        onChange={(e) => setEditCheatData({...editCheatData, title: e.target.value})}
                                                        className="bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                                        placeholder="Title"
                                                    />
                                                    <input 
                                                        value={editCheatData.downloadUrl || ''}
                                                        onChange={(e) => setEditCheatData({...editCheatData, downloadUrl: e.target.value})}
                                                        className="bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                                        placeholder="https://linkvertise..."
                                                    />
                                                </div>
                                                <textarea 
                                                    value={editCheatData.description || ''}
                                                    onChange={(e) => setEditCheatData({...editCheatData, description: e.target.value})}
                                                    className="w-full bg-black/30 border border-white/10 rounded p-3 text-white text-sm"
                                                    rows={2}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => setEditingCheatId(null)}
                                                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={saveCheat}
                                                        disabled={isLoading}
                                                        className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs hover:bg-green-500/30 flex items-center gap-1"
                                                    >
                                                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-white">{cheat.title}</h3>
                                                        {verificationBadge(cheat.verificationStatus)}
                                                        {currentUser.role === 'ADMIN' && (
                                                            <span className="text-xs text-gray-500 flex items-center gap-1 border border-white/10 px-1.5 rounded-full ml-2">
                                                                <UserIcon className="w-3 h-3" />
                                                                {cheat.authorName}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{cheat.game}</span>
                                                        <a href={cheat.downloadUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 truncate max-w-[200px]">
                                                            <Link className="w-3 h-3" />
                                                            {cheat.downloadUrl}
                                                        </a>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {currentUser.role === 'ADMIN' && (
                                                        <>
                                                            {cheat.verificationStatus !== 'VERIFIED' && (
                                                                <button 
                                                                    onClick={() => handleStatusChange(cheat, 'VERIFIED')}
                                                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/20"
                                                                    title="Approve Post"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {cheat.verificationStatus !== 'REJECTED' && (
                                                                <button 
                                                                    onClick={() => handleStatusChange(cheat, 'REJECTED')}
                                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                                                                    title="Reject Post"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <div className="w-px h-6 bg-white/10 mx-1"></div>
                                                            <button 
                                                                onClick={() => handleDelete(cheat.id)}
                                                                className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-lg transition-colors"
                                                                title="Delete Post"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => startEditCheat(cheat)}
                                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                        title="Edit Post"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    
                    {/* USERS TAB (Enhanced) */}
                    {activeTab === 'users' && currentUser.role === 'ADMIN' && (
                        <div className="space-y-6">
                            {/* Filter Tabs */}
                            <div className="flex gap-2 pb-4 border-b border-white/5">
                                <button 
                                    onClick={() => setActiveUserFilter('ALL')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeUserFilter === 'ALL' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    All Members
                                </button>
                                <button 
                                    onClick={() => setActiveUserFilter('BANNED')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeUserFilter === 'BANNED' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'}`}
                                >
                                    Banned List
                                </button>
                            </div>

                            <div className="space-y-3">
                                {displayUsers.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        {activeUserFilter === 'BANNED' ? 'No banned users found.' : 'No users found.'}
                                    </div>
                                ) : (
                                    displayUsers.map(u => (
                                        <div key={u.id} className="bg-white/5 border border-white/5 rounded-xl transition-all hover:bg-white/10">
                                            {/* User Row Header */}
                                            <div className="p-4 flex items-center justify-between">
                                                <div 
                                                    className="flex items-center gap-4 cursor-pointer"
                                                    onClick={() => {
                                                        if (expandedUserId === u.id) {
                                                            setExpandedUserId(null);
                                                        } else {
                                                            setExpandedUserId(u.id);
                                                            setAdminNoteInput(u.adminNotes || '');
                                                        }
                                                    }}
                                                >
                                                    <div className="relative">
                                                        {u.avatar ? (
                                                            <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                                <UserIcon className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        {u.isBanned && (
                                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-[#0f0f12]">
                                                                <Ban className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-bold ${u.isBanned ? 'text-red-400 line-through decoration-red-400' : 'text-white'}`}>
                                                                {u.username}
                                                            </span>
                                                            {roleBadge(u.role)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {!u.isAdmin && (
                                                        <>
                                                            <select
                                                                value={u.role}
                                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                                className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                                                                disabled={isLoading}
                                                            >
                                                                <option value="USER">Member</option>
                                                                <option value="SUPPORTER">Supporter</option>
                                                                <option value="MODERATOR">Moderator</option>
                                                                <option value="ADMIN">Admin</option>
                                                            </select>
                                                            <div className="w-px h-6 bg-white/10"></div>
                                                            <button 
                                                                onClick={() => handleBanToggle(u.id, !!u.isBanned)}
                                                                disabled={isLoading}
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                                    u.isBanned 
                                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' 
                                                                        : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                                }`}
                                                            >
                                                                {u.isBanned ? (
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                ) : (
                                                                    <Ban className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Expanded Admin Tools */}
                                            {expandedUserId === u.id && (
                                                <div className="px-4 pb-4 pt-0 border-t border-white/5 bg-black/20 rounded-b-xl">
                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Admin Notes (Private)</label>
                                                            <textarea 
                                                                value={adminNoteInput}
                                                                onChange={(e) => setAdminNoteInput(e.target.value)}
                                                                className="w-full bg-[#1e1e24] border border-yellow-500/10 text-yellow-100/80 text-sm p-3 rounded-lg focus:outline-none focus:border-yellow-500/30 resize-none h-24"
                                                                placeholder="Reason for ban, warning history, etc..."
                                                            />
                                                            <div className="mt-2 flex justify-end">
                                                                <button 
                                                                    onClick={() => handleSaveAdminData(u)}
                                                                    disabled={isLoading}
                                                                    className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-gray-300"
                                                                >
                                                                    Save Notes
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Badges</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['VIP', 'DEV', 'OG', 'VERIFIED'].map(badge => (
                                                                    <button
                                                                        key={badge}
                                                                        onClick={() => toggleBadge(u, badge)}
                                                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                                                            u.badges?.includes(badge)
                                                                            ? 'bg-primary/20 border-primary/40 text-primary'
                                                                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
                                                                        }`}
                                                                    >
                                                                        {badge}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="mt-4">
                                                                <div className="text-xs text-gray-500 mb-1">Joined At</div>
                                                                <div className="text-sm font-mono text-gray-400">
                                                                    {new Date(u.joinedAt).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardModal;