const Resume = require('../models/Resume');
const { extractTextFromFile } = require('../services/fileParser');
const { analyzeResumeWithAI } = require('../services/aiService');
const mongoose = require('mongoose');

// In-memory fallback if MONGODB_URI is not provided
const fallbackStorage = new Map();

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Handle resume upload, parsing, saving, and kick-off AI analysis
 */
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const resumeIdStr = new mongoose.Types.ObjectId().toString();
        let resumeRecord = {
            _id: resumeIdStr,
            uploadedFileName: req.file.originalname,
            resumeText: 'Parsing...',
            analysisStatus: 'analyzing',
            aiAnalysisResult: null
        };

        if (isDbConnected()) {
            resumeRecord = new Resume(resumeRecord);
            await resumeRecord.save();
        } else {
            fallbackStorage.set(resumeIdStr, resumeRecord);
        }

        res.status(202).json({
            message: 'Resume uploaded successfully. Analysis started.',
            resumeId: resumeIdStr,
            status: 'analyzing'
        });

        const io = req.app.get('io');

        // Notify client analysis started
        io.emit(`analysis-progress-${resumeIdStr}`, { status: 'extracting-text' });

        // Step 1: Extract Text
        let extractedText;
        try {
            extractedText = await extractTextFromFile(req.file);
            resumeRecord.resumeText = extractedText;
            if (isDbConnected()) await resumeRecord.save();
            else fallbackStorage.set(resumeIdStr, resumeRecord);

            io.emit(`analysis-progress-${resumeIdStr}`, { status: 'analyzing-ai' });
        } catch (error) {
            resumeRecord.analysisStatus = 'error';
            if (isDbConnected()) await resumeRecord.save();
            else fallbackStorage.set(resumeIdStr, resumeRecord);

            io.emit(`analysis-progress-${resumeIdStr}`, { status: 'error', message: 'Failed to read file format' });
            return;
        }

        // Step 2: AI Analysis
        try {
            const aiResult = await analyzeResumeWithAI(extractedText);

            // Ensure structure contains default arrays if missing
            resumeRecord.aiAnalysisResult = {
                resumeScore: aiResult.resumeScore || 0,
                improvedBulletPoints: aiResult.improvedBulletPoints || [],
                grammarSuggestions: aiResult.grammarSuggestions || [],
                missingSkills: aiResult.missingSkills || [],
                projectSuggestions: aiResult.projectSuggestions || [],
                linkedinSummary: aiResult.linkedinSummary || "",
                viewFeedback: aiResult.sectionFeedback || [],
                interviewQuestions: aiResult.interviewQuestions || []
            };
            resumeRecord.analysisStatus = 'completed';

            if (isDbConnected()) await resumeRecord.save();
            else fallbackStorage.set(resumeIdStr, resumeRecord);

            io.emit(`analysis-progress-${resumeIdStr}`, {
                status: 'completed',
                resumeId: resumeIdStr
            });

        } catch (error) {
            resumeRecord.analysisStatus = 'error';
            if (isDbConnected()) await resumeRecord.save();
            else fallbackStorage.set(resumeIdStr, resumeRecord);

            io.emit(`analysis-progress-${resumeIdStr}`, { status: 'error', message: 'AI Analysis failed' });
        }

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: 'Server error during upload' });
    }
};

/**
 * Fetch a completed resume analysis
 */
const getResumeAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        let resume;

        if (isDbConnected()) {
            resume = await Resume.findById(id);
        } else {
            resume = fallbackStorage.get(id);
        }

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.status(200).json(resume);
    } catch (error) {
        console.error("Fetch analysis error:", error);
        res.status(500).json({ error: 'Server error while fetching analysis' });
    }
};

module.exports = {
    uploadResume,
    getResumeAnalysis
};
