# 22 Technology Stack & Dependencies

## Overview
The Pharmacy ERP system is built on a high-performance MERN Stack architecture optimized for production cloud deployment on Vercel and MongoDB Atlas.

## Tech Stack Summary

### Frontend Layer
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Dark Medical Theme
- **State & Router**: React Router v7 + TanStack Query
- **Charts & UI**: Recharts + Thermal Receipt ESC/POS Generator

### Backend Layer
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ODM
- **Authentication**: JWT (Access Tokens + HttpOnly Refresh Cookies) + bcryptjs
- **Exports & Documents**: PDFKit (PDF Invoices) + ExcelJS (Reports)
- **Deployment**: Vercel Monorepo Serverless Engine
