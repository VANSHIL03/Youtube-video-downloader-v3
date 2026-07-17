import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import VideoDetails from '../components/VideoDetails';

const Home = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    try {
      setIsAnalyzing(true);
      setVideoInfo(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/analyze`, { url });
      setVideoInfo(response.data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze video. Ensure it is a valid, public YouTube link.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 w-full mt-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Download YouTube Videos <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Instantly</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Download videos in MP4 and MP3 formats with multiple quality options including 144p, 360p, 720p, 1080p, 1440p, and 4K. Fast, secure, and beautiful.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl relative z-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 animate-pulse"></div>
        <form onSubmit={handleAnalyze} className="relative glass rounded-2xl p-2 flex items-center">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your YouTube link here..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg text-white placeholder-slate-400 font-medium"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-70"
          >
            {isAnalyzing ? (
              <Loader2 className="animate-spin text-black" size={24} />
            ) : (
              <Search size={24} className="group-hover:scale-110 transition-transform text-black" />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
            <div className="absolute inset-0 h-full w-full bg-white/30 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></div>
          </button>
        </form>
      </motion.div>

      {/* Video Details Section */}
      {videoInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mt-16"
        >
          <VideoDetails info={videoInfo} url={url} />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
