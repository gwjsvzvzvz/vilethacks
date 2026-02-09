import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Gamepad2, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    game: '',
    version: '',
    description: '',
    status: 'TESTING',
    downloadUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!formData.downloadUrl.startsWith('http')) {
        setError("Please enter a valid URL starting with http:// or https://");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
        await onUpload({
            ...formData
        });
        // Reset
        setFormData({ title: '', game: '', version: '', description: '', status: 'TESTING', downloadUrl: '' });
        onClose();
    } catch (err) {
        console.error(err);
        setError("Upload failed. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (error) setError(null);
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
        className="relative w-full max-w-lg bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Upload New Hack
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <form id="upload-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 ml-1">Hack Title</label>
                        <input 
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-600"
                            placeholder="e.g. Aimbot Pro"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 ml-1">Target Game</label>
                        <div className="relative">
                            <Gamepad2 className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input 
                                name="game"
                                required
                                value={formData.game}
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-600"
                                placeholder="e.g. Apex"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 ml-1">Version</label>
                        <input 
                            name="version"
                            required
                            value={formData.version}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-600"
                            placeholder="v1.0.0"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 ml-1">Initial Status</label>
                        <select 
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                        >
                            <option value="TESTING">Testing</option>
                            <option value="UNDETECTED">Undetected</option>
                            <option value="DETECTED">Detected</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">Description</label>
                    <textarea 
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-600 resize-none"
                        placeholder="Describe features, hotkeys, and installation steps..."
                    />
                </div>

                 <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">Download Link (External) <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input 
                            name="downloadUrl"
                            required
                            value={formData.downloadUrl}
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-600"
                            placeholder="https://linkvertise.com/..."
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Use a service like Linkvertise, Mega.nz, or Mediafire.</p>
                </div>
            </form>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
                Cancel
            </button>
            <button 
                form="upload-form"
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {isLoading ? 'Submit for Review' : 'Submit for Review'}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadModal;