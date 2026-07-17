import ytDlp, { exec } from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const ffmpegPath = ffmpegInstaller.path;

export const getVideoInfo = async (url: string) => {
  try {
       const output = await ytDlp(url, {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      extractorArgs: 'youtube:player_client=android,web',
    } as any);
    return output;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video information');
  }
};

export const downloadVideo = (url: string, quality: string, outputUuid: string): Promise<{path: string, ext: string}> => {
  return new Promise((resolve, reject) => {
    const downloadsDir = path.join(__dirname, '../../downloads');
    
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const isAudio = quality === 'audio';
    const formatStr = isAudio ? 'bestaudio/best' : (quality !== 'best' ? `bestvideo[height<=${quality}]+bestaudio/best` : 'bestvideo+bestaudio/best');

    // Use %(ext)s so yt-dlp chooses the correct extension (e.g. mkv, webm, mp4, mp3)
    const outputTemplate = path.join(downloadsDir, `${outputUuid}.%(ext)s`);

        const options: any = {
      f: formatStr,
      o: outputTemplate,
      ffmpegLocation: ffmpegPath,
      extractorArgs: 'youtube:player_client=android,web',
    };

    if (isAudio) {
      options.extractAudio = true;
      options.audioFormat = 'mp3';
    } else {
      // Force mkv container for merged video formats to avoid ffmpeg codec incompatibilities
      options.mergeOutputFormat = 'mkv';
    }

    const process = exec(url, options);

    let stderrOutput = '';
    if (process.stderr) {
      process.stderr.on('data', (data: any) => {
        stderrOutput += data.toString();
        console.error('yt-dlp stderr:', data.toString());
      });
    }

    process.on('close', (code: number | null) => {
      if (code === 0) {
        // Find the actual file generated
        const files = fs.readdirSync(downloadsDir);
        const generatedFile = files.find(f => f.startsWith(outputUuid));
        if (generatedFile) {
          resolve({
            path: path.join(downloadsDir, generatedFile),
            ext: path.extname(generatedFile).replace('.', '')
          });
        } else {
          reject(new Error('Downloaded file could not be found'));
        }
      } else {
        reject(new Error(`Download failed with code ${code}. Stderr: ${stderrOutput}`));
      }
    });

    process.on('error', (err: any) => {
      reject(err);
    });
  });
};
