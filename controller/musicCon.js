const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

exports.uploadMusic = async (req, res) => {
  try {
    const { title, artist, lyrics } = req.body;
    const filename = req.file.filename;
    const query = 'INSERT INTO music (title, artist, filename, lyrics) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [title, artist, filename, lyrics]);
    const newMusicId = result.insertId;
    const newMusic = { id: newMusicId, title, artist, filename, lyrics };
    console.log('New music added:', newMusic);
    res.status(201).json({ message: 'Music uploaded successfully', music: newMusic });
  } catch (error) {
    console.error('Error uploading music:', error);
    res.status(500).json({ error: 'Error uploading music', details: error.message });
  }
};

exports.getAllMusic = async (req, res) => {
  try {
    const query = 'SELECT id, title, artist, filename, lyrics FROM music';
    const [rows] = await db.execute(query);
    console.log('Retrieved music list:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching music list:', error);
    res.status(500).json({ error: 'Error fetching music list', details: error.message });
  }
};

exports.searchMusic = async (req, res) => {
  try {
    const { q } = req.query;
    const query = 'SELECT id, title, artist, filename, lyrics FROM music WHERE title LIKE ? OR artist LIKE ?';
    const [rows] = await db.execute(query, [`%${q}%`, `%${q}%`]);
    console.log('Search results:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error searching music:', error);
    res.status(500).json({ error: 'Error searching music', details: error.message });
  }
};

exports.getMusicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM music WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Music not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching music details:', error);
    res.status(500).json({ error: 'Error fetching music details', details: error.message });
  }
};

exports.deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT filename FROM music WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Music not found' });
    }
    const filename = rows[0].filename;
    await fs.unlink(path.join(__dirname, '..', 'upload', filename));
    await db.execute('DELETE FROM music WHERE id = ?', [id]);
    res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Error deleting music:', error);
    res.status(500).json({ error: 'Error deleting music', details: error.message });
  }
};