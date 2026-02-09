import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CheatCard from './components/CheatCard';
import AuthModal from './components/AuthModal';
import UploadModal from './components/UploadModal';
import InfoModal from './components/InfoModal';
import DashboardModal from './components/DashboardModal';
import CheatDetailModal from './components/CheatDetailModal';
import StatsBar from './components/StatsBar';
import UserListModal from './components/UserListModal';
import UserProfileModal from './components/UserProfileModal';
import { getCheats, createCheat, loginUser, updateUserProfile, updateCheat, incrementDownload, deleteCheat, getSiteStats, getComments, addComment, getAllUsers, toggleUserBan, updateUserRole } from './mockDb';
import { Cheat, User, SiteStats, Comment, UserRole } from './types';
import { Loader2, Shield, Crown, LifeBuoy, FileText, Lock, Plus } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cheats, setCheats] = useState<Cheat[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); 
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  
  // View other user profile state
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingProfileCheats, setViewingProfileCheats] = useState<Cheat[]>([]);

  // User List Modal State
  const [userListModalData, setUserListModalData] = useState<{
    isOpen: boolean;
    title: string;
    users: User[];
    type: 'ONLINE' | 'ALL';
  }>({ isOpen: false, title: '', users: [], type: 'ALL' });
  
  // Selected Cheat & Comments
  const [selectedCheat, setSelectedCheat] = useState<Cheat | null>(null);
  const [selectedCheatComments, setSelectedCheatComments] = useState<Comment[]>([]);

  // Initial Fetch
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cheatsData, statsData, usersData] = await Promise.all([
          getCheats(),
          getSiteStats(),
          getAllUsers() // We fetch this upfront now to support the stats click
      ]);
      setCheats(cheatsData);
      setSiteStats(statsData);
      setAllUsers(usersData);
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password?: string) => {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser);
    
    // Refresh stats and users
    const stats = await getSiteStats();
    setSiteStats(stats);
    const users = await getAllUsers();
    setAllUsers(users);
  };

  const handleLogout = () => {
    setUser(null);
    setIsDashboardOpen(false);
  };

  const handleUpload = async (formData: any) => {
    if (!user) return;
    try {
        const newCheat = await createCheat(formData, user);
        setCheats([newCheat, ...cheats]);
        
        // Refresh stats
        const stats = await getSiteStats();
        setSiteStats(stats);

        if (newCheat.verificationStatus === 'PENDING') {
            alert("Upload successful! Your post is hidden and pending approval from an administrator. You can view its status in your Dashboard.");
            setIsDashboardOpen(true);
        }
    } catch (e) {
        alert(e);
    }
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    const newUser = await updateUserProfile(updatedUser);
    setUser(newUser);
  };

  const handleUpdateCheat = async (updatedCheat: Cheat) => {
    await updateCheat(updatedCheat);
    setCheats(cheats.map(c => c.id === updatedCheat.id ? updatedCheat : c));
    const stats = await getSiteStats();
    setSiteStats(stats);
  };
  
  const handleDeleteCheat = async (cheatId: string) => {
      await deleteCheat(cheatId);
      setCheats(cheats.filter(c => c.id !== cheatId));
      const stats = await getSiteStats();
      setSiteStats(stats);
  };

  // Admin User Management
  const handleToggleBan = async (userId: string) => {
      const updatedUser = await toggleUserBan(userId);
      if (updatedUser) {
          setAllUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
      }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
      const updatedUser = await updateUserRole(userId, newRole);
      if (updatedUser) {
           setAllUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
      }
  };

  const handleDownload = async (cheatId: string) => {
      const updatedCheat = await incrementDownload(cheatId);
      if (updatedCheat) {
          setCheats(prevCheats => prevCheats.map(c => c.id === cheatId ? updatedCheat : c));
          if (selectedCheat && selectedCheat.id === cheatId) {
              setSelectedCheat(updatedCheat);
          }
      }
  };

  const handleOpenCheat = async (cheat: Cheat) => {
      setSelectedCheat(cheat);
      const comments = await getComments(cheat.id);
      setSelectedCheatComments(comments);
  };

  const handleAddComment = async (text: string) => {
      if (!user || !selectedCheat) return;
      const newComment = await addComment(selectedCheat.id, user, text);
      setSelectedCheatComments([newComment, ...selectedCheatComments]);
      const stats = await getSiteStats();
      setSiteStats(stats);
  };

  const handleNavigate = (action: string) => {
    if (action === 'community' || action === 'explore') {
        document.getElementById('cheats')?.scrollIntoView({ behavior: 'smooth' });
    } else {
        setActiveInfoModal(action);
    }
  };

  // Handle viewing another user's profile
  const handleViewProfile = (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (targetUser) {
        // Get verified uploads by this user
        const userUploads = cheats.filter(c => c.authorId === userId && c.verificationStatus === 'VERIFIED');
        setViewingProfile(targetUser);
        setViewingProfileCheats(userUploads);
        
        // Close other interactive modals for clarity
        setUserListModalData(prev => ({ ...prev, isOpen: false }));
        setSelectedCheat(null);
    }
  };

  // Handlers for StatsBar clicks
  const handleShowOnlineUsers = () => {
      // In a real app this is a specific API call. For mock, we'll take the first N users based on the stats count
      if(!siteStats) return;
      const count = siteStats.onlineMembers;
      const onlineMock = allUsers.slice(0, count);
      
      setUserListModalData({
          isOpen: true,
          title: 'Online Members',
          users: onlineMock,
          type: 'ONLINE'
      });
  };

  const handleShowAllUsers = () => {
      setUserListModalData({
          isOpen: true,
          title: 'Community Members',
          users: allUsers,
          type: 'ALL'
      });
  };

  const getModalContent = () => {
    switch (activeInfoModal) {
      case 'premium':
        return {
          title: 'VioletHacks Premium',
          content: (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-4">
                <Crown className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                    <h3 className="text-lg font-bold text-primary mb-1">Pro Subscription</h3>
                    <p className="text-sm text-gray-300">Unlock the full potential of VioletHacks with our premium tier. Designed for serious gamers who demand the best.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Exclusive Benefits:</h4>
                <ul className="space-y-3">
                  {[
                    'Private, Stream-Proof Builds',
                    'Cloud Configuration Sync',
                    'Priority 24/7 Ticket Support',
                    'Built-in HWID Spoofer',
                    'Early Access to New Cheats'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button className="w-full py-3.5 bg-primary hover:bg-primary-dark rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  Upgrade Now - $19.99/mo
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">Cancel anytime. Secure payment via Stripe.</p>
              </div>
            </div>
          )
        };
      case 'safety':
        return {
          title: 'Safety Guarantee',
          content: (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <Shield className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
              <p className="text-center text-gray-300">
                At VioletHacks, user safety is our #1 priority. We employ advanced, industry-leading techniques to ensure your account remains secure and undetected.
              </p>
              
              <div className="grid gap-4 mt-6">
                 {[
                   { title: 'Kernel-Level Drivers', desc: 'Our cheats operate at ring 0 level, hidden from standard anti-cheat scans.' },
                   { title: 'Polymorphic Code', desc: 'Unique signature generation for every single download prevents mass detection.' },
                   { title: 'Auto-Kill Switch', desc: 'Instantly disables the cheat if an update or anomaly is detected.' }
                 ].map((feat, i) => (
                   <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                     <h4 className="font-semibold text-white mb-1">{feat.title}</h4>
                     <p className="text-xs text-gray-400">{feat.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          )
        };
      case 'support':
        return {
          title: 'Customer Support',
          content: (
            <div className="space-y-6">
                <div className="text-center">
                    <LifeBuoy className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-gray-300">Need help with installation, payments, or have a bug to report? Our team is available 24/7 to assist you.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="https://discord.gg/6FYkrgZJKd" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 hover:bg-[#5865F2]/20 transition-all group">
                        <div className="font-bold text-[#5865F2] text-lg group-hover:scale-105 transition-transform">Discord Community</div>
                        <div className="text-xs mt-2 text-gray-400">Live Chat & Tickets</div>
                    </a>
                    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="font-bold text-white text-lg">Email Support</div>
                        <div className="text-xs mt-2 text-gray-400">support@violethacks.io</div>
                    </div>
                </div>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Last Updated: February 2026</span>
              </div>
              <p>1. <span className="text-white">Acceptance:</span> By downloading or using VioletHacks, you agree to these terms.</p>
              <p>2. <span className="text-white">Usage:</span> You agree not to reverse engineer, crack, or distribute our software. Violations will result in an immediate HWID ban.</p>
              <p>3. <span className="text-white">Liability:</span> We are not responsible for any bans, suspensions, or damages to your account. Use at your own risk.</p>
              <p>4. <span className="text-white">Refunds:</span> Refunds are only provided if the software is proven to be non-functional on your machine within 24 hours of purchase.</p>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Data Protection</span>
              </div>
              <p>We respect your privacy. VioletHacks collects minimal data required for authentication and HWID locking.</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>We do not sell your personal data to third parties.</li>
                  <li>We do not log game chat, screenshots, or personal files.</li>
                  <li>Payment data is handled securely by our payment processor (Stripe/Crypto).</li>
              </ul>
            </div>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  const modalData = getModalContent();

  const verifiedCheats = cheats.filter(c => c.verificationStatus === 'VERIFIED');
  
  const getFilteredCheats = () => {
    let list = verifiedCheats;

    if (activeFilter === 'Undetected') {
      list = list.filter(cheat => cheat.status === 'UNDETECTED');
    }
    if (activeFilter === 'Popular') {
      list = list.filter(cheat => cheat.downloads > 1000).sort((a, b) => b.downloads - a.downloads);
    }
    
    return list;
  };

  const displayCheats = getFilteredCheats();
  const activeHacksCount = verifiedCheats.length;
  const totalDownloads = verifiedCheats.reduce((acc, cheat) => acc + cheat.downloads, 0);
  
  const dashboardCheats = user 
    ? (user.role === 'ADMIN' ? cheats : cheats.filter(c => c.authorName === user.username))
    : [];

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-primary/30 flex flex-col relative z-0">
      
      <Navbar 
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onLogout={handleLogout}
        onOpenUpload={() => setIsUploadOpen(true)}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsDashboardOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <Hero 
          onNavigate={handleNavigate} 
          stats={{ activeHacks: activeHacksCount, downloads: totalDownloads }}
        />

        <section className="py-20" id="cheats">
           <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-bold">Latest <span className="text-primary">Releases</span></h2>
               <div className="flex gap-2">
                   {['All', 'Undetected', 'Popular'].map((filter) => (
                       <button 
                        key={filter} 
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilter === filter ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                       >
                           {filter}
                       </button>
                   ))}
               </div>
           </div>

           {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
               {displayCheats.map((cheat, index) => (
                 <CheatCard 
                    key={cheat.id} 
                    cheat={cheat} 
                    index={index} 
                    onClick={() => handleOpenCheat(cheat)}
                    onAuthorClick={(authorId) => handleViewProfile(authorId)}
                 />
               ))}
               {displayCheats.length === 0 && (
                 <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                    <p className="text-lg text-gray-400 mb-2">No active hacks found.</p>
                    <p className="text-sm text-gray-600 mb-6">Cheats submitted by users are currently pending Admin review.</p>
                    <button 
                      onClick={() => user ? setIsUploadOpen(true) : setIsAuthOpen(true)}
                      className="flex items-center gap-2 px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors border border-primary/20"
                    >
                      <Plus className="w-4 h-4" />
                      Upload Now
                    </button>
                 </div>
               )}
             </div>
           )}
        </section>
      </main>
      
      {/* Updated Stats Bar with Click Handlers */}
      <StatsBar 
        stats={siteStats} 
        onOpenOnline={handleShowOnlineUsers} 
        onOpenMembers={handleShowAllUsers}
      />

      <footer className="border-t border-white/5 bg-black/20 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-500 text-sm">© 2026 VioletHacks. All rights reserved.</p>
              <div className="flex justify-center gap-6 mt-4">
                  <button onClick={() => handleNavigate('terms')} className="text-gray-600 hover:text-primary transition-colors text-sm">Terms</button>
                  <button onClick={() => handleNavigate('privacy')} className="text-gray-600 hover:text-primary transition-colors text-sm">Privacy</button>
                  <a href="https://discord.gg/6FYkrgZJKd" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary transition-colors text-sm">Discord</a>
              </div>
          </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin}
      />
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUpload={handleUpload}
      />
      <InfoModal 
        isOpen={!!activeInfoModal} 
        onClose={() => setActiveInfoModal(null)} 
        title={modalData.title}
      >
          {modalData.content}
      </InfoModal>

      {/* New User List Modal */}
      <UserListModal
        isOpen={userListModalData.isOpen}
        onClose={() => setUserListModalData(prev => ({ ...prev, isOpen: false }))}
        title={userListModalData.title}
        users={userListModalData.users}
        type={userListModalData.type}
        onUserClick={(userId) => handleViewProfile(userId)}
      />

      <UserProfileModal 
        isOpen={!!viewingProfile}
        onClose={() => setViewingProfile(null)}
        user={viewingProfile}
        userCheats={viewingProfileCheats}
      />

      {user && (
        <DashboardModal
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          currentUser={user}
          userCheats={dashboardCheats}
          allUsers={allUsers}
          onUpdateProfile={handleUpdateProfile}
          onUpdateCheat={handleUpdateCheat}
          onDeleteCheat={handleDeleteCheat}
          onToggleBan={handleToggleBan}
          onUpdateRole={handleUpdateRole}
        />
      )}

      <CheatDetailModal 
        isOpen={!!selectedCheat}
        onClose={() => setSelectedCheat(null)}
        cheat={selectedCheat}
        onDownload={handleDownload}
        currentUser={user}
        comments={selectedCheatComments}
        onAddComment={handleAddComment}
        onOpenAuth={() => { setSelectedCheat(null); setIsAuthOpen(true); }}
        onAuthorClick={(authorId) => handleViewProfile(authorId)}
      />
      
    </div>
  );
}

export default App;