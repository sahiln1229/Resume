const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now to allow anonymous uploads during testing
    },
    resumeText: {
        type: String,
        required: true
    },
    uploadedFileName: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    analysisStatus: {
        type: String,
        enum: ['pending', 'analyzing', 'completed', 'error'],
        default: 'pending'
    },
    aiAnalysisResult: {
        type: Object, // Will store the JSON structure returned by Gemini
        default: null
    }
});

module.exports = mongoose.model('Resume', resumeSchema);
