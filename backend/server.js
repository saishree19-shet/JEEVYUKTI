const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const aiRoutes = require('./routes/aiRoutes');
const vcfRoutes = require('./routes/vcfRoutes');

app.use('/api/ai', aiRoutes);
app.use('/api/vcf', vcfRoutes);

app.get('/', (req, res) => {
  res.send('PharmaGuard Backend is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
