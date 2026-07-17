import { useState } from 'react';
import { Download, Clock, Eye, Calendar, User } from 'lucide-react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  channel: string;
  viewCount: number;
  uploadDate: string;
}

export default function VideoDetails({ info, url }: { info: VideoInfo, url: string }) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  };

  const formatNumber = (num: number) => {
    if (!num) return 'Unknown';
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  const handleDownload = (quality: string) => {
    setDownloading(quality);
    
    // Construct the download URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const downloadUrl = new URL(`${apiUrl}/api/download`);
    downloadUrl.searchParams.append('url', url);
    downloadUrl.searchParams.append('quality', quality);
    downloadUrl.searchParams.append('title', info.title);
    downloadUrl.searchParams.append('thumbnail', info.thumbnail);
    
    // Create an invisible iframe to trigger the download without leaving the page
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl.toString();
    document.body.appendChild(iframe);
    
    // We do NOT remove the iframe immediately because doing so cancels the browser's HTTP request!
    // The backend yt-dlp process takes 10-60 seconds depending on quality.
    
    // Keep the UI spinning for 15 seconds to indicate that the server is processing the video.
    setTimeout(() => {
      setDownloading(null);
    }, 15000);
  };

  const qualities = ['360', '720', '1080', '1440', '2160', 'best'];

  return (
    <div className="glass rounded-3xl p-6 md:p-8 w-full shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10">
            <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
              {formatDuration(info.duration)}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 text-sm text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-2"><User size={16} className="text-cyan-400" /> <span className="font-semibold text-white">{info.channel}</span></div>
            <div className="flex items-center gap-2"><Eye size={16} className="text-green-400" /> <span>{formatNumber(info.viewCount)} views</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} className="text-purple-400" /> <span>{formatDate(info.uploadDate)}</span></div>
            <div className="flex items-center gap-2"><Clock size={16} className="text-orange-400" /> <span>{formatDuration(info.duration)}</span></div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white line-clamp-2 leading-tight">
            {info.title}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></span> Video Quality
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {qualities.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleDownload(q)}
                    disabled={downloading !== null}
                    className="flex items-center justify-between p-4 rounded-xl border border-cyan-500/30 bg-black/40 hover:bg-cyan-900/40 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all group relative overflow-hidden disabled:opacity-50"
                  >
                    <span className="font-bold text-white tracking-wider">{q === 'best' ? 'Max Quality' : `${q}p`}</span>
                    {downloading === q ? (
                       <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                       <Download size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_#c084fc]"></span> Audio Only
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleDownload('audio')}
                  disabled={downloading !== null}
                  className="flex items-center justify-between p-4 rounded-xl border border-purple-500/30 bg-black/40 hover:bg-purple-900/40 hover:border-purple-400/60 hover:shadow-[0_0_15px_rgba(192,132,252,0.2)] transition-all group relative overflow-hidden disabled:opacity-50"
                >
                  <span className="font-bold text-white tracking-wider">High Quality MP3</span>
                  {downloading === 'audio' ? (
                     <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                     <Download size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </div>
            
            {downloading && (
               <div className="text-sm text-cyan-400 animate-pulse mt-4 bg-cyan-950/50 p-3 rounded-lg border border-cyan-500/20 text-center">
                 Your download is being processed on the server and will begin shortly! High quality videos (1080p+) take longer because the audio and video must be merged.
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
