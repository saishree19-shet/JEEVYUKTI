import { NextResponse } from 'next/server';
import { parseVCFContent } from '@/lib/services/vcfService';
import { calculateRisk } from '@/lib/services/riskService';
import mammoth from 'mammoth'; // Import conditionally if needed, but for now we'll try to stick to text. 
// If mammoth is needed, we'll need to install it. For now, assuming VCF (text).

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('vcf'); // Matches 'upload.single("vcf")'
        const drugToCheck = formData.get('drug');

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let fileContent = '';

        if (file.name.endsWith('.docx')) {
             try {
                const result = await mammoth.extractRawText({ buffer: buffer });
                fileContent = result.value;
            } catch (error) {
                console.error("Error reading DOCX:", error);
                 return NextResponse.json({ message: "Failed to read DOCX file content" }, { status: 400 });
            }
        } else {
            // Assume text/vcf
            fileContent = buffer.toString('utf-8');
        }

        // 1. Parse VCF
        const vcfResult = await parseVCFContent(fileContent, file.name);

        // 2. Calculate Risk
        let analysisResult;

        if (drugToCheck) {
            // Specific Drug Mode
            const specificRisk = calculateRisk(vcfResult.variants, drugToCheck);

            // General Report
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

        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ 
            message: `Processing Failed: ${error.message}`,
            details: error.toString()
        }, { status: 500 });
    }
}
