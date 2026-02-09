import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Shield, AlertTriangle, Info, User, Calendar, ExternalLink, Gamepad2, Send, MessageSquare } from 'lucide-react';
import { Cheat, User as UserType, Comment } from '../types';

interface CheatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cheat: Cheat | null;
  onDownload: (cheatId: string) => void;
  currentUser: UserType | null;
  comments: Comment[];
  onAddComment: (text: string) => Promise<void>;
  onOpenAuth: () => void;
  onAuthorClick: (authorId: string) => void;
}

const CheatDetailModal: React.FC<CheatDetailModalProps> = ({ 
    isOpen, 
    onClose, 
    cheat, 
    onDownload, 
    currentUser, 
    comments, 
    onAddComment,
    onOpenAuth,
    onAuthorClick
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top when modal opens or cheat changes
  useEffect(() => {
    if (isOpen) {
        setCommentText('');
    }
  }, [isOpen, cheat]);

  if (!isOpen || !cheat) return null;

  const statusColor = {
    'UNDETECTED': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'DETECTED': 'text-red-400 bg-red-400/10 border-red-400/20',
    'TESTING': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };

  const statusIcon = {
    'UNDETECTED': <Shield className="w-4 h-4" />,
    'DETECTED': <AlertTriangle className="w-4 h-4" />,
    'TESTING': <Info className="w-4 h-4" />,
  };

  const handleDownloadClick = () => {
    if (cheat.downloadUrl && cheat.downloadUrl !== '#') {
        window.open(cheat.downloadUrl, '_blank');
        onDownload(cheat.id);
    } else {
        alert("Invalid download link.");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      
      setIsSubmitting(true);
      try {
          await onAddComment(commentText);
          setCommentText('');
      } finally {
          setIsSubmitting(false);
      }
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
        className="relative w-full max-w-3xl bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header Image / Pattern */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-900/20 relative border-b border-white/5 shrink-0">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors border border-white/10"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${statusColor[cheat.status]}`}>
                                {statusIcon[cheat.status]}
                                {cheat.status}
                            </div>
                            <span className="text-sm font-mono text-gray-500 px-2 py-0.5 bg-white/5 rounded">{cheat.version}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">{cheat.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Gamepad2 className="w-4 h-4" />
                            <span>{cheat.game}</span>
                        </div>
                    </div>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                     <div 
                        onClick={() => onAuthorClick(cheat.authorId)}
                        className="bg-white/5 rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all group"
                     >
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Author</div>
                        <div className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">{cheat.authorName}</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Download className="w-3 h-3" /> Downloads</div>
                        <div className="text-sm font-medium text-white">{cheat.downloads.toLocaleString()}</div>
                     </div>
                     <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Updated</div>
                        <div className="text-sm font-medium text-white">{new Date(cheat.createdAt).toLocaleDateString()}</div>
                     </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4">About this Hack</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {cheat.description}
                    </div>
                </div>

                {/* Download Section */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                    <div>
                        <h4 className="font-bold text-white mb-1">Ready to dominate?</h4>
                        <p className="text-sm text-gray-400">Ensure you have read the safety guidelines before using.</p>
                    </div>
                    <button 
                        onClick={handleDownloadClick}
                        className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 group"
                    >
                        <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Go to Download
                    </button>
                </div>

                {/* Comments Section */}
                <div className="border-t border-white/10 pt-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        Comments ({comments.length})
                    </h3>

                    {/* Comment Form */}
                    <div className="mb-8">
                        {currentUser ? (
                            <form onSubmit={handleSubmitComment} className="flex gap-3">
                                <div className="shrink-0">
                                    {currentUser.avatar ? (
                                        <img src={currentUser.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting || !commentText.trim()}
                                            className="px-4 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                                <p className="text-gray-400 text-sm mb-2">You must be logged in to post comments.</p>
                                <button 
                                    onClick={onOpenAuth}
                                    className="text-primary hover:text-white transition-colors text-sm font-medium"
                                >
                                    Log in to join the discussion
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4 group">
                                    <div 
                                        className="shrink-0 cursor-pointer"
                                        onClick={() => onAuthorClick(comment.userId)}
                                    >
                                        {comment.userAvatar ? (
                                            <img src={comment.userAvatar} alt={comment.username} className="w-10 h-10 rounded-full object-cover border border-white/10 hover:border-primary transition-colors" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span 
                                                className={`font-semibold text-sm cursor-pointer hover:underline ${comment.isAdmin ? 'text-primary' : 'text-white'}`}
                                                onClick={() => onAuthorClick(comment.userId)}
                                            >
                                                {comment.username}
                                            </span>
                                            {comment.isAdmin && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20 uppercase font-bold">Admin</span>}
                                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheatDetailModal;