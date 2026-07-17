import { Request, Response } from 'express';
import { getDb } from '../db/database';
import axios from 'axios';

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

    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
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
    const { url, quality, title } = req.query as { [key: string]: string };
    if (!url || !quality) return res.status(400).json({ error: 'URL and quality are required' });

    const isAudio = quality === 'audio';
    const videoQuality = quality === 'best' ? 'max' : quality;

    const cobaltRes = await axios.post(
      'https://api.cobalt.tools/',
      {
        url,
        videoQuality: isAudio ? '720' : videoQuality,
        downloadMode: isAudio ? 'audio' : 'auto',
        audioFormat: isAudio ? 'mp3' : 'best',
      },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
    );

    const data = cobaltRes.data;
    if (data.status === 'error') {
      return res.status(500).json({ error: 'Download service error: ' + data.error?.code });
    }

    res.json({ downloadUrl: data.url });
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ error: 'Failed to process download.' });
  }
};
