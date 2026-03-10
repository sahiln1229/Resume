const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text from an uploaded file (PDF, DOCX, TXT)
 * @param {Object} file - The file object from multer
 * @returns {Promise<string>} - The extracted text
 */
const extractTextFromFile = async (file) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const filePath = file.path;

    try {
        let extractedText = '';

        if (fileExtension === 'pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        } else if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else if (fileExtension === 'txt') {
            extractedText = fs.readFileSync(filePath, 'utf8');
        } else {
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }

        // Clean up temporary file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return extractedText.trim();
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("Text extraction error:", error);
        throw new Error('Failed to extract text from file');
    }
};

module.exports = {
    extractTextFromFile
};
