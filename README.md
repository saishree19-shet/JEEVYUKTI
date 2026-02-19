# PharmaGuard - RIFT 2026 Hackathon

## Overview
PharmaGuard is a Precision Medicine platform that analyzes patient genetic data (VCF files) to predict drug risks based on CPIC guidelines.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Firebase Auth
- **Backend**: Node.js, Express, Gemini 1.5 Pro
- **Bioinformatics**: custom VCF stream parsing, CPIC logic engine

## Setup

### 1. Backend
```bash
cd backend
npm install
# Create .env file with:
# GEMINI_API_KEY=your_key_here
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
# Create .env.local with Firebase config
npm run dev
```

## Features
- **VCF Parsing**: Drag & drop data ingestion.
- **Risk Analysis**: Immediate "Red/Yellow/Green" safety alerts.
- **AI Chatbot**: Ask "Why is Clopidogrel risky for me?"
