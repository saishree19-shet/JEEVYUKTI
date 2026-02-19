const { parseVCF } = require('./backend/services/vcfService');
const path = require('path');

const sampleFile = path.join(__dirname, 'sample_genome.vcf');

console.log(`Testing parser with: ${sampleFile}`);

parseVCF(sampleFile).then(result => {
    console.log("Parsing Complete.");
    console.log(`Variants Detected: ${result.variants.length}`);
    console.log(JSON.stringify(result, null, 2));
}).catch(err => {
    console.error("Parsing Failed:", err);
});
