import { motion } from 'framer-motion';
import { Mail, Globe, Code, User } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass dark:glass-dark rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1 mb-6 shadow-2xl">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl font-bold text-slate-800 dark:text-slate-100">
              VG
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-slate-50">Vanshil Gupta</h1>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-6">Full Stack Developer</p>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto">
            I built TubeVault to provide a fast, beautiful, and ad-free experience for downloading YouTube videos. 
            Passionate about crafting premium user interfaces and building robust backend architectures.
          </p>

          <div className="flex justify-center gap-6">
            <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300">
              <Code size={24} />
            </a>
            <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300">
              <User size={24} />
            </a>
            <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300">
              <Globe size={24} />
            </a>
            <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
