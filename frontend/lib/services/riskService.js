// CPIC-based Risk Logic (Precision Medicine Core)
// Data Source: CPIC Guidelines (2025)

const GENE_DRUG_PAIRS = {
    "CYP2C19": {
        "Clopidogrel": {
            "Poor Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Avoid Clopidogrel. Use Prasugrel or Ticagrelor.",
                mechanism: "Reduced formation of active metabolite leads to efficacy failure.",
                clinical_consequence: "High risk of cardiovascular events (stent thrombosis).",
                alternatives: ["Prasugrel", "Ticagrelor"]
            },
            "Intermediate Metabolizer": {
                riskCategory: "Adjust Dosage",
                recommendation: "Consider alternative or higher dose (not recommended by all guidelines).",
                mechanism: "Reduced antiplatelet effect.",
                clinical_consequence: "Reduced platelet inhibition.",
                alternatives: ["Prasugrel", "Ticagrelor"]
            },
            "Ultra-Rapid Metabolizer": {
                riskCategory: "Safe",
                recommendation: "Standard dose, check for bleeding risk.",
                mechanism: "Increased active metabolite.",
                clinical_consequence: "Potential minor bleeding risk."
            }
        },
        "Voriconazole": {
            "Rapid Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Use label-recommended dosage. No specific CPIC recommendation.",
                mechanism: "Increased clearance leads to sub-therapeutic levels.",
                clinical_consequence: "Likely ineffective.",
                alternatives: ["Posaconazole"]
            },
            "Ultra-Rapid Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Avoid Voriconazole. Use alternative antifungal.",
                mechanism: "Rapid clearance leads to treatment failure.",
                clinical_consequence: "Fungal infection progression.",
                alternatives: ["Posaconazole", "Liposomal Amphotericin B"]
            }
        },
        "Omeprazole": { // Also applicable to Lansoprazole/Pantoprazole
            "Rapid Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Increase starting dose by 50-100%.",
                mechanism: "Rapid metabolism reduces acid suppression efficacy.",
                clinical_consequence: "Refractory GERD/H. pylori treatment failure.",
                alternatives: ["Rabeprazole"]
            },
            "Ultra-Rapid Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Increase starting dose by 100-200% or switch agent.",
                mechanism: "Very rapid clearance.",
                clinical_consequence: "Treatment failure.",
                alternatives: ["Rabeprazole"]
            }
        },
        "Lansoprazole": {
            "Rapid Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Increase starting dose.",
                mechanism: "Rapid metabolism reduces efficacy.",
                clinical_consequence: "Likely ineffective.",
                alternatives: ["Rabeprazole"]
            }
        },
        "Escitalopram": {
            "Rapid Metabolizer": {
                riskCategory: "Adjust Dosage",
                recommendation: "Consider identifying alternative drug or titrate to higher dose.",
                mechanism: "Increased metabolism may lead to lower plasma concentrations.",
                clinical_consequence: "Reduced efficacy.",
                alternatives: ["Mental health specialist consultation"]
            }
        },
        "Sertraline": {
            "Rapid Metabolizer": {
                riskCategory: "Adjust Dosage",
                recommendation: "Consider identifying alternative drug or titrate to higher dose.",
                mechanism: "Increased metabolism reduces drug exposure.",
                clinical_consequence: "Reduced efficacy.",
                alternatives: ["Mental health specialist consultation"]
            }
        },
        "Citalopram": {
            "Poor Metabolizer": {
                riskCategory: "Toxic",
                recommendation: "Reduce dose by 50% or avoid.",
                mechanism: "Increased risk of QT prolongation due to high drug levels.",
                clinical_consequence: "Arrhythmia risk.",
                alternatives: ["Sertraline"]
            },
            "Rapid Metabolizer": {
                riskCategory: "Adjust Dosage",
                recommendation: "Consider identifying alternative drug or titrate to higher dose.",
                mechanism: "Increased metabolism reduces drug exposure.",
                clinical_consequence: "Reduced efficacy.",
                alternatives: ["Fluvoxamine"]
            }
        }
    },
    "CYP2D6": {
        "Codeine": {
            "Poor Metabolizer": {
                riskCategory: "Ineffective",
                recommendation: "Avoid Codeine. Use non-opioid or Tramadol (caution).",
                mechanism: "Prodrug failure: No conversion to Morphine (analgesic).",
                clinical_consequence: "Lack of pain relief.",
                alternatives: ["Ibuprofen", "Gabapentin"]
            },
            "Ultra-Rapid Metabolizer": {
                riskCategory: "Toxic",
                recommendation: "Avoid Codeine. Toxicity Risk.",
                mechanism: "Rapid conversion to Morphine leading to respiratory depression.",
                clinical_consequence: "Life-threatening respiratory depression.",
                alternatives: ["Non-opioids"]
            }
        }
    },
    "CYP2C9": {
        "Warfarin": {
            "Poor Metabolizer": {
                riskCategory: "Toxic",
                recommendation: "Lower starting dose significantly. Frequent INR monitoring.",
                mechanism: "Reduced clearance increases bleeding risk.",
                clinical_consequence: "Severe bleeding events.",
                alternatives: ["DOACs (Apixaban, Rivaroxaban)"]
            },
            "Intermediate Metabolizer": {
                riskCategory: "Adjust Dosage",
                recommendation: "Lower starting dose.",
                mechanism: "Reduced clearance.",
                clinical_consequence: "Increased INR and bleeding risk."
            }
        }
    },
    "SLCO1B1": {
        "Simvastatin": {
            "Decreased Function": {
                riskCategory: "Toxic",
                recommendation: "Prescribe lower dose (max 20mg) or switch statin.",
                mechanism: "High plasma levels increase Myopathy/Rhabdomyolysis risk.",
                clinical_consequence: "Muscle pain, weakness, kidney damage.",
                alternatives: ["Rosuvastatin", "Atorvastatin"]
            }
        }
    },
    "TPMT": {
        "Azathioprine": {
            "Poor Metabolizer": {
                riskCategory: "Toxic",
                recommendation: "Avoid Azathioprine. Fatal myelosuppression risk.",
                mechanism: "Accumulation of cytotoxic thioguanine nucleotides.",
                clinical_consequence: "Severe bone marrow suppression.",
                alternatives: ["Alternative Immunosuppressant"]
            }
        }
    },
    "DPYD": {
        "Fluorouracil": {
            "Poor Metabolizer": {
                riskCategory: "Toxic",
                recommendation: "Avoid 5-FU. Use alternative.",
                mechanism: "Severe toxicity (neutropenia, neurotoxicity).",
                clinical_consequence: "Fatal drug toxicity.",
                alternatives: ["Minimal use"]
            }
        }
    }
};

const determinePhenotype = (gene, variants) => {
    // Simplified Diplotype Logic
    const geneVariants = variants.filter(v => v.gene === gene);
    if (geneVariants.length === 0) return "Normal Metabolizer"; // Default *1/*1

    // Check specific variants
    if (gene === "CYP2C19") {
        const has2or3 = geneVariants.some(v => v.variant === "*2" || v.variant === "*3");
        const has17 = geneVariants.some(v => v.variant === "*17");
        const homozygous = geneVariants.some(v => v.genotype === "Homozygous");

        if (has2or3 && homozygous) return "Poor Metabolizer";
        if (has2or3) return "Intermediate Metabolizer";
        if (has17 && homozygous) return "Ultra-Rapid Metabolizer";
        if (has17) return "Rapid Metabolizer";
    }

    if (gene === "CYP2D6") {
        const hasBad = geneVariants.some(v => v.variant === "*4" || v.variant === "*5");
        if (hasBad && geneVariants.some(v => v.genotype === "Homozygous")) return "Poor Metabolizer";
        if (hasBad || geneVariants.some(v => v.variant === "*10")) return "Intermediate Metabolizer";
    }

    if (gene === "CYP2C9") {
        const hasBad = geneVariants.some(v => v.variant === "*2" || v.variant === "*3");
        if (hasBad && geneVariants.some(v => v.genotype === "Homozygous")) return "Poor Metabolizer";
        if (hasBad) return "Intermediate Metabolizer";
    }

    if (gene === "SLCO1B1" && geneVariants.some(v => v.variant === "*5")) return "Decreased Function";

    if (gene === "TPMT") {
        const hasBad = geneVariants.some(v => v.variant === "*3B" || v.variant === "*3C");
        if (hasBad && geneVariants.some(v => v.genotype === "Homozygous")) return "Poor Metabolizer";
        if (hasBad) return "Intermediate Metabolizer";
    }

    if (gene === "DPYD") {
        const hasBad = geneVariants.some(v => v.variant === "*2A" || v.variant === "*13");
        if (hasBad && geneVariants.some(v => v.genotype === "Homozygous")) return "Poor Metabolizer";
        if (hasBad) return "Intermediate Metabolizer";
    }

    return "Normal Metabolizer";
};

export const calculateRisk = (variants, targetDrug = null) => {
    let report = [];
    let genePhenotypes = {};
    const genes = ["CYP2C19", "CYP2D6", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"];

    // 1. Determine Phenotypes
    genes.forEach(g => {
        genePhenotypes[g] = determinePhenotype(g, variants);
    });

    // 2. Generate General Report OR Specific Drug Report
    if (targetDrug) {
        // Find gene relevant to this drug (Case Insensitive)
        let relevantGene = null;
        let canonicalDrugName = null;

        for (const g of genes) {
            if (GENE_DRUG_PAIRS[g]) {
                const drugKeys = Object.keys(GENE_DRUG_PAIRS[g]);
                const matchedKey = drugKeys.find(k => k.toLowerCase() === targetDrug.toLowerCase());
                if (matchedKey) {
                    relevantGene = g;
                    canonicalDrugName = matchedKey;
                    break;
                }
            }
        }

        // Use canonical name for lookup if found
        if (canonicalDrugName) targetDrug = canonicalDrugName;

        if (relevantGene) {
            const phenotype = genePhenotypes[relevantGene];
            const rule = GENE_DRUG_PAIRS[relevantGene][targetDrug][phenotype] || {
                riskCategory: "Safe", // Default if no specific rule for "Normal"
                recommendation: "No dosage adjustment needed. Standard dosing guidelines apply.",
                mechanism: "Normal metabolism expected.",
                clinical_consequence: "Standard efficacy and safety profile."
            };

            // STRICT JSON OUTPUT FOR CHALLENGE
            return {
                gene: relevantGene,
                variants: variants.filter(v => v.gene === relevantGene).map(v => `${v.variant} (${v.rsid})`),
                diplotype: "Inferred from Variants", // Placeholder for actual star allele parser
                phenotype: phenotype,
                drug_risks: rule.riskCategory,
                dosing_recommendation: rule.recommendation,
                clinical_explanation: `${rule.clinical_consequence} ${rule.mechanism}`,
                alternatives: rule.alternatives || []
            };
        } else {
            return {
                riskCategory: "Unknown",
                message: `No pharmacogenomic guidelines found for ${targetDrug} in our database.`
            };
        }
    }

    // General Report (Legacy support for Dashboard)
    for (const [gene, phenotype] of Object.entries(genePhenotypes)) {
        if (GENE_DRUG_PAIRS[gene]) {
            for (const [drug, rules] of Object.entries(GENE_DRUG_PAIRS[gene])) {
                const rule = rules[phenotype];
                if (rule) {
                    report.push({
                        gene,
                        drug,
                        phenotype,
                        risk: rule.riskCategory,
                        recommendation: rule.recommendation,
                        mechanism: rule.mechanism,
                        alternatives: rule.alternatives || []
                    });
                }
            }
        }
    }

    return { phenotypeProfile: genePhenotypes, riskReport: report };
};
