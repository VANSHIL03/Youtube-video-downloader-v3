import { Router } from 'express';
import { analyzeVideo, startDownload } from '../controllers/videoController';
import { getHistory, deleteHistory } from '../controllers/historyController';

const router = Router();

router.post('/analyze', analyzeVideo);
router.get('/download', startDownload);
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistory);

export default router;
