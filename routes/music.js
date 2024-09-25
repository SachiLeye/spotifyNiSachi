const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const musicController = require('../controller/MusicCon');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  next();
}, musicController.uploadMusic);

router.get('/', musicController.getAllMusic);
router.get('/search', musicController.searchMusic);
router.get('/:id', musicController.getMusicDetails);
router.delete('/:id', musicController.deleteMusic);

module.exports = router;