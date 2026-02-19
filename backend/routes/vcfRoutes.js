const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseVCF } = require('../services/vcfService');
const { calculateRisk } = require('../services/riskService');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('vcf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate File Type
    // Validate File Type (Allow VCF, TXT, and now DOCX)
    if (!req.file.originalname.match(/\.(vcf|txt|docx)$/i) &&
        !req.file.mimetype.includes('text') &&
        !req.file.mimetype.includes('wordprocessingml')) {

        // Remove invalid file
        fs.unlink(req.file.path, () => { });
        return res.status(400).json({
            message: "Invalid file format. Please upload a .vcf, .txt, or .docx file.",
            details: "Detected file type: " + req.file.mimetype
        });
    }

    try {
        // 1. Parse VCF
        const vcfResult = await parseVCF(req.file.path);

        // 2. Clean up temp file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete temp file:", err);
        });

        // 3. Calculate Risk
        const drugToCheck = req.body.drug || null;
        let analysisResult;

        if (drugToCheck) {
            // Specific Drug Mode
            const specificRisk = calculateRisk(vcfResult.variants, drugToCheck);

            // General Report (Correctly separating the call)
            const generalReport = calculateRisk(vcfResult.variants);
            const safeRiskReport = Array.isArray(generalReport?.riskReport) ? generalReport.riskReport : [];

            analysisResult = {
                ...vcfResult,
                specificDrugAnalysis: specificRisk,
                riskReport: safeRiskReport,
                phenotypeProfile: generalReport?.phenotypeProfile || {},
                summary: {
                    totalVariants: vcfResult.variants.length,
                    highRiskCount: safeRiskReport.filter(r => r.risk === "Toxic" || r.risk === "High").length,
                    genesAnalyzed: [...new Set(safeRiskReport.map(r => r.gene))]
                }
            };
        } else {
            // General Mode Only
            const generalReport = calculateRisk(vcfResult.variants);
            const safeRiskReport = Array.isArray(generalReport?.riskReport) ? generalReport.riskReport : [];

            analysisResult = {
                ...vcfResult,
                riskReport: safeRiskReport,
                phenotypeProfile: generalReport?.phenotypeProfile || {},
                summary: {
                    totalVariants: vcfResult.variants.length,
                    highRiskCount: safeRiskReport.filter(r => r.risk === "Toxic" || r.risk === "High").length,
                    genesAnalyzed: [...new Set(safeRiskReport.map(r => r.gene))]
                }
            };
        }

        // 4. Return Combined Analysis
        res.json(analysisResult);

    } catch (error) {
        console.error("VCF Processing Error:", error);
        // Return 'message' so frontend can display it
        res.status(500).json({
            message: `Processing Failed: ${error.message}`,
            details: error.toString()
        });
    }
});

module.exports = router;
