const Resume = require('../models/Resume');
const { extractTextFromFile } = require('../services/fileParser');
const { analyzeResumeWithAI } = require('../services/aiService');

/**
 * Handle resume upload, parsing, saving, and kick-off AI analysis
 */
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Initialize resume record in DB
        const newResume = new Resume({
            uploadedFileName: req.file.originalname,
            resumeText: 'Parsing...', // Placeholder
            analysisStatus: 'analyzing'
        });
        await newResume.save();

        res.status(202).json({
            message: 'Resume uploaded successfully. Analysis started.',
            resumeId: newResume._id,
            status: 'analyzing'
        });

        const io = req.app.get('io');
        const resumeIdStr = newResume._id.toString();

        // Notify client analysis started
        io.emit(`analysis-progress-${resumeIdStr}`, { status: 'extracting-text' });

        // Step 1: Extract Text
        let extractedText;
        try {
            extractedText = await extractTextFromFile(req.file);
            newResume.resumeText = extractedText;
            await newResume.save();
            io.emit(`analysis-progress-${resumeIdStr}`, { status: 'analyzing-ai' });
        } catch (error) {
            newResume.analysisStatus = 'error';
            await newResume.save();
            io.emit(`analysis-progress-${resumeIdStr}`, { status: 'error', message: 'Failed to read file format' });
            return;
        }

        // Step 2: AI Analysis
        try {
            const aiResult = await analyzeResumeWithAI(extractedText);

            // Ensure structure contains default arrays if missing
            newResume.aiAnalysisResult = {
                resumeScore: aiResult.resumeScore || 0,
                improvedBulletPoints: aiResult.improvedBulletPoints || [],
                grammarSuggestions: aiResult.grammarSuggestions || [],
                missingSkills: aiResult.missingSkills || [],
                projectSuggestions: aiResult.projectSuggestions || [],
                linkedinSummary: aiResult.linkedinSummary || "",
                viewFeedback: aiResult.sectionFeedback || [],
                interviewQuestions: aiResult.interviewQuestions || []
            };
            newResume.analysisStatus = 'completed';
            await newResume.save();

            io.emit(`analysis-progress-${resumeIdStr}`, {
                status: 'completed',
                resumeId: resumeIdStr
            });

        } catch (error) {
            newResume.analysisStatus = 'error';
            await newResume.save();
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
        const resume = await Resume.findById(id);

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
