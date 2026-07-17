import { Request, Response } from 'express';
import { downloadVideo } from '../services/ytDlpService';
import { getDb } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import axios from 'axios';

// Extract YouTube video ID from any YouTube URL format
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1]!;
  }
  return null;
};

export const analyzeVideo = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    // Use oEmbed API - works from any IP, no auth needed
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedRes = await axios.get(oembedUrl);
    const oembed = oembedRes.data;

    res.json({
      title: oembed.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: 0,
      channel: oembed.author_name,
      viewCount: 0,
      uploadDate: '',
    });

  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ error: 'Failed to analyze video' });
  }
};

export const startDownload = async (req: Request, res: Response) => {
  try {
    const { url, quality, title, thumbnail } = req.query as { [key: string]: string };
    
    if (!url || !quality) {
      return res.status(400).json({ error: 'URL and quality are required' });
    }

    const outputUuid = uuidv4();
    
    const { path: outputPath, ext } = await downloadVideo(url, quality, outputUuid);

    const db = getDb();
    db.run(
      'INSERT INTO history (videoId, title, thumbnail, format, quality, fileSize) VALUES (?, ?, ?, ?, ?, ?)',
      [outputUuid, title || 'YouTube Video', thumbnail || '', ext, quality, 'Unknown'],
      (err) => { if (err) console.error('Error saving history:', err); }
    );

    const safeTitle = (title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.download(outputPath, `${safeTitle}.${ext}`, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });

  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ error: 'Failed to process download.' });
  }
};
