# BACKEND

## Requirements
- Node.js v18+
- PostgreSQL
- npm

## Run
Create a PostgreSQL database and user for the application.

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

edit the `.env` file to set your database connection string and other environment variables.
