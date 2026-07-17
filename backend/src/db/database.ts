import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        videoId TEXT NOT NULL,
        title TEXT NOT NULL,
        thumbnail TEXT,
        format TEXT NOT NULL,
        quality TEXT NOT NULL,
        fileSize TEXT,
        downloadDate DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
};

export const getDb = () => db;
