import { Request, Response } from 'express';
import { getDb } from '../db/database';

export const getHistory = (req: Request, res: Response) => {
  const db = getDb();
  db.all('SELECT * FROM history ORDER BY downloadDate DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve history' });
    }
    res.json(rows);
  });
};

export const deleteHistory = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.run('DELETE FROM history WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete history' });
    }
    res.json({ message: 'Deleted successfully', changes: this.changes });
  });
};
