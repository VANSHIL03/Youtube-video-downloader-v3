import { Outlet, Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Deep Space Animated Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/40 rounded-full mix-blend-screen filter blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-cyan-900/30 rounded-full mix-blend-screen filter blur-[90px]" 
        />
      </div>

      <header className="sticky top-0 z-50 glass w-full border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-tr from-cyan-400 to-purple-500 p-2.5 rounded-2xl text-black shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300">
                <Download size={24} />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">TubeVault</span>
            </Link>
            
            <nav className="hidden md:flex gap-10">
              <Link to="/" className="text-slate-300 hover:text-white font-semibold tracking-wide transition-colors hover:glow-text">Downloader</Link>
              <Link to="/history" className="text-slate-300 hover:text-white font-semibold tracking-wide transition-colors hover:glow-text">History</Link>
              <Link to="/about" className="text-slate-300 hover:text-white font-semibold tracking-wide transition-colors hover:glow-text">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <Outlet />
      </main>

      <footer className="glass dark:glass-dark border-t border-black/5 dark:border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Developed by <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Vanshil Gupta</span>
          </p>
          <div className="flex justify-center gap-4 mt-4 text-slate-400">
             <Link to="/about" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">About Developer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
