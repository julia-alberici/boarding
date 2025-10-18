# Boarding Project

This is a full-stack application with a Node.js/Express backend and a React/Vite frontend.

## Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database
- pnpm, npm, or yarn package manager

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```
Replace the values with your PostgreSQL database credentials.

4. Run database migrations:
```bash
npx prisma migrate deploy
```

5. Start the development server:
```bash
npm run dev
```

The backend server will start at `http://localhost:3000` (or your configured port).

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## Build for Production

### Backend

1. Build the backend:
```bash
cd backend
npm run build
```

2. Start the production server:
```bash
npm start
```

### Frontend

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Technologies Used

Backend:
- Node.js with TypeScript
- Express.js
- Prisma (ORM)
- PostgreSQL
- Authentication with JWT
- CORS enabled

Frontend:
- React 19
- TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- React Router DOM
- Framer Motion
- Radix UI Components
- Hello Pangea DnD (Drag and Drop)
- Axios (HTTP Client)