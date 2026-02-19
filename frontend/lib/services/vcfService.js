
// Expanded Target Gene List for Hackathon (CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD)
const TARGET_VARIANTS = {
    // CYP2C19
    "rs12248560": { gene: "CYP2C19", variant: "*17", impact: "Increased Function", type: "SNP" },
    "rs4244285": { gene: "CYP2C19", variant: "*2", impact: "No Function", type: "SNP" },
    "rs4986893": { gene: "CYP2C19", variant: "*3", impact: "No Function", type: "SNP" },

    // CYP2D6 (Simplified - normally needs CNV analysis)
    "rs3892097": { gene: "CYP2D6", variant: "*4", impact: "No Function", type: "SNP" },
    "rs1065852": { gene: "CYP2D6", variant: "*10", impact: "Decreased Function", type: "SNP" },

    // CYP2C9 (Warfarin)
    "rs1799853": { gene: "CYP2C9", variant: "*2", impact: "Decreased Function", type: "SNP" },
    "rs1057910": { gene: "CYP2C9", variant: "*3", impact: "Decreased Function", type: "SNP" },

    // SLCO1B1 (Statins)
    "rs4149056": { gene: "SLCO1B1", variant: "*5", impact: "Decreased Function", type: "SNP" },

    // TPMT (Thiopurines)
    "rs1800460": { gene: "TPMT", variant: "*3B", impact: "No Function", type: "SNP" },
    "rs1142345": { gene: "TPMT", variant: "*3C", impact: "No Function", type: "SNP" },

    // DPYD (Fluorouracil)
    "rs3918290": { gene: "DPYD", variant: "*2A", impact: "No Function", type: "SNP" },
    "rs55886062": { gene: "DPYD", variant: "*13", impact: "No Function", type: "SNP" }
};

// Removed mammoth dependency for serverless simplicity - relying on text extraction before calling or txt input
// If DOCX is strictly needed, we can re-add it using buffer input, but text is safer for Vercel functions for now.

export const parseVCFContent = async (fileContent, fileName = "unknown") => {
    let lines = fileContent.split(/\r?\n/);

    console.log(`[VCF Parser] Extracted ${lines.length} lines from ${fileName}`);
    if (lines.length > 0) {
        console.log(`[VCF Parser] First 5 lines preview:`);
        lines.slice(0, 5).forEach((l, i) => console.log(`Line ${i + 1}: ${JSON.stringify(l)}`));
    }

    const detectedVariants = [];
    const auditLog = {
        timestamp: new Date().toISOString(),
        file: fileName,
        status: "success",
        parser_version: "v2.1"
    };

    try {
        for (const line of lines) {
            if (!line || line.trim() === '') continue;
            if (line.startsWith('#')) continue;

            // Handle both tab and space/multiple space delimiters just in case
            const cols = line.split(/[\t\s]+/);
            if (cols.length < 5) continue;

            const rsid = cols[2];

            // Find the Genotype column (usually 9th index / 10th column in standard VCF)
            // But sometimes info is earlier. We look for the format column 'GT'
            let genotypeIndex = -1;

            // Simple heuristic: If FORMAT is col 8, Sample is col 9.
            if (cols[8] && cols[8].includes('GT')) {
                genotypeIndex = 9;
            } else {
                // Fallback: try to find the first column that looks like 0/1 or 1/1
                genotypeIndex = cols.findIndex(c => c.match(/[012]\/[012]|[012]\|[012]/));
            }

            const genotypeField = genotypeIndex > -1 ? cols[genotypeIndex] : null;

            if (TARGET_VARIANTS[rsid]) {
                // Robust Genotype Parsing
                // 0/0 = Reference (No Variant)
                // 0/1 = Heterozygous (One Copy)
                // 1/1 = Homozygous (Two Copies)
                // 1/2 = Heterozygous Alt (Two different variants)

                let zygosity = "None";
                let hasVariant = false;

                if (genotypeField) {
                    const gt = genotypeField.split(':')[0]; // Take only GT part (e.g., "0/1:10:...")

                    if (gt.includes("1") || gt.includes("2")) {
                        hasVariant = true;
                        if (gt === "0/1" || gt === "1/0") zygosity = "Heterozygous";
                        else if (gt === "1/1") zygosity = "Homozygous";
                        else if (gt === "1/2" || gt === "2/1") zygosity = "Compound Heterozygous";
                        else zygosity = "Present";
                    }
                }

                if (hasVariant) {
                    detectedVariants.push({
                        rsid,
                        ...TARGET_VARIANTS[rsid],
                        genotype: zygosity,
                        raw_gt: genotypeField
                    });
                }
            }
        }
    } catch (err) {
        auditLog.status = "error";
        auditLog.error = err.message;
    }

    return { variants: detectedVariants, audit: auditLog };
};
