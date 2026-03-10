const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const parseResume = async (filePath) => {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (extension === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } else if (extension === '.txt') {
        return fs.readFileSync(filePath, 'utf8');
    } else {
        throw new Error('Unsupported file format');
    }
};

module.exports = { parseResume };
