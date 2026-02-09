import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password?: string) => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
        await onLogin(email, password);
        // Reset form
        setEmail('');
        setPassword('');
        setError(null);
        onClose();
    } catch (err: any) {
        console.error(err);
        setError(typeof err === 'string' ? err : 'Authentication failed. Please check credentials.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="p-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Join VioletHacks'}</h2>
                <p className="text-gray-400 text-sm">
                    {isLogin ? 'Enter your credentials to access your dashboard.' : 'Create an account to start downloading safe cheats.'}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                     <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                                placeholder="Display Name"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-primary hover:text-white transition-colors font-medium"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;