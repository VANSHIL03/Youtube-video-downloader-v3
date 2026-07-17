import ytDlp, { exec } from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const ffmpegPath = ffmpegInstaller.path;

export const getVideoInfo = async (url: string) => {
  try {
    const cookiesPath = path.join(process.cwd(), 'cookies.txt');
    const options: any = {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
    };
    
    if (fs.existsSync(cookiesPath)) {
      options.cookies = cookiesPath;
    }
    
    const output = await ytDlp(url, options);
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

    const outputTemplate = path.join(downloadsDir, `${outputUuid}.%(ext)s`);

    const cookiesPath = path.join(process.cwd(), 'cookies.txt');
    const options: any = {
      f: formatStr,
      o: outputTemplate,
      ffmpegLocation: ffmpegPath,
    };
    
    if (fs.existsSync(cookiesPath)) {
      options.cookies = cookiesPath;
    }

    if (isAudio) {
      options.extractAudio = true;
      options.audioFormat = 'mp3';
    } else {
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
