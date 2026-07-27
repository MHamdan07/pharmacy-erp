# Pharmacy ERP Full-Stack Setup

This project is a pharmacy management system with a Node.js/Express backend and a React/Vite frontend. It provides authentication, role-based access, and a dashboard experience for managing pharmacy operations.

## Project Overview

- Backend: Express.js API with MongoDB and Mongoose
- Frontend: React + Vite user interface
- Authentication: JWT-based login and protected routes
- Admin setup: seed script creates the initial owner account

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas account or a local MongoDB instance

## 1. Install dependencies

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies from the frontend folder:

```bash
cd frontend
npm install
```

## 2. Configure environment variables

Create a `.env` file in the backend root with the following values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/pharmacy_erp?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
JWT_ACCESS_SECRET=super_secret_access_key
JWT_REFRESH_SECRET=super_secret_refresh_key
```

If you are using a local MongoDB instance, use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/pharmacy_erp
```

## 3. Seed the database

Run the seed script once to create the initial admin account:

```bash
node seed.js
```

Default login credentials:
- Email: admin@pharmacy.com
- Password: adminpassword123

## 4. Run the backend

From the backend folder:

```bash
cd backend
npm run dev
```

The backend API will run at:
- http://localhost:5000

## 5. Run the frontend

Open a new terminal and go to the frontend folder:

```bash
cd frontend
npm run dev
```

The frontend will run at:
- http://localhost:5173

You can open that URL in your browser to use the app.

## 6. Useful commands

- Backend start: `npm run dev`
- Backend production start: `npm start`
- Frontend dev server: `npm run dev`
- Frontend build: `npm run build`

## 7. Notes

- Make sure your MongoDB Atlas network access allows your current IP address.
- If you change the MongoDB URI, restart the backend process.
- The frontend expects the backend API to be available at http://localhost:5000.
