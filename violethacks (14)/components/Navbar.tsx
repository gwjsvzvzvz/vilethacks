import React from 'react';
import { User, LogIn, LogOut, Zap, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onNavigate: (section: string) => void;
  onOpenProfile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout, onOpenUpload, onNavigate, onOpenProfile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleNav = (action: string) => {
    onNavigate(action);
    setIsMobileMenuOpen(false);
  };

  // Permission: USER role cannot upload. SUPPORTER+ can.
  const canUpload = user && (user.role === 'SUPPORTER' || user.role === 'MODERATOR' || user.role === 'ADMIN');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              Violet<span className="text-primary">Hacks</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
             <button onClick={() => handleNav('community')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Community</button>
             <button onClick={() => handleNav('premium')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Premium</button>
             <button onClick={() => handleNav('support')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Support</button>
            
            {user ? (
              <div className="flex items-center gap-4">
                 {canUpload && (
                    <button 
                      onClick={onOpenUpload}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary/10 border border-primary/50 rounded-lg hover:bg-primary/20 transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    >
                      Upload Hack
                    </button>
                 )}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div 
                    onClick={onOpenProfile}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover group-hover:border-primary transition-colors" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{user.username}</span>
                  </div>
                  <button onClick={onLogout} className="p-2 text-gray-400 hover:text-white transition-colors ml-2">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <button onClick={() => handleNav('community')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Community</button>
             <button onClick={() => handleNav('premium')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Premium</button>
             <button onClick={() => handleNav('support')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Support</button>
             
             {user ? (
               <>
                 {canUpload && (
                   <button 
                    onClick={() => { onOpenUpload(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-white/5"
                   >
                     Upload Hack
                   </button>
                 )}
                 <button 
                  onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5"
                 >
                   My Profile & Dashboard
                 </button>
                 <button 
                  onClick={onLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-white/5"
                 >
                   Logout ({user.username})
                 </button>
               </>
             ) : (
               <button
                onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-primary/20 hover:bg-primary/30"
               >
                 Login / Signup
               </button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;