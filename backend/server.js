const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseResume } = require('./resume-parser/parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = await parseResume(req.file.path);

    // Forward to AI Engine
    try {
      const aiResponse = await axios.post(`${AI_ENGINE_URL}/analyze`, { text });
      res.json(aiResponse.data);
    } catch (aiError) {
      console.error('AI Engine Error:', aiError.message);
      // Return mock data if AI engine is not reachable
      res.json({
        status: 'mock_success',
        score: 78,
        suggestions: [
          { original: "Worked with the team", improved: "Collaborated with cross-functional teams to deliver scale" }
        ],
        skillMatch: { "React": 90, "Node.js": 75 }
      });
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
