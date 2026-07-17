import { Request, Response } from 'express';
import { getVideoInfo, downloadVideo } from '../services/ytDlpService';
import { getDb } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const analyzeVideo = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const info: any = await getVideoInfo(url);
    
    // Send back simplified info. Frontend will just let user choose 360, 720, 1080, audio, etc.
    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      channel: info.uploader,
      viewCount: info.view_count,
      uploadDate: info.upload_date,
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

    // Save to history
    const db = getDb();
    db.run(
      'INSERT INTO history (videoId, title, thumbnail, format, quality, fileSize) VALUES (?, ?, ?, ?, ?, ?)',
      [outputUuid, title || 'YouTube Video', thumbnail || '', ext, quality, 'Unknown'],
      (err) => {
        if (err) console.error('Error saving history:', err);
      }
    );

    // Send file to client
    const safeTitle = (title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.download(outputPath, `${safeTitle}.${ext}`, (err) => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    });

  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ error: 'Failed to process download. Server error.' });
  }
};
