import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, Download, Video, Music } from 'lucide-react';
import toast from 'react-hot-toast';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistory(res.data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/history/${id}`);
      setHistory(history.filter(h => h.id !== id));
      toast.success('Deleted from history');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <div className="text-center mt-20"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="w-full max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Download History</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">View and manage your past downloads.</p>
      </motion.div>

      {history.length === 0 ? (
        <div className="glass dark:glass-dark rounded-2xl p-12 text-center text-slate-500">
          No downloads yet. Head over to the Downloader to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass dark:glass-dark rounded-xl overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative aspect-video">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg text-white">
                  {item.format === 'mp4' || item.format === 'webm' ? <Video size={16} /> : <Music size={16} />}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 mb-2">{item.title}</h3>
                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <span>{item.quality} • {item.format.toUpperCase()}</span>
                  <span>{new Date(item.downloadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm">
                    <Download size={16} /> Re-download
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
