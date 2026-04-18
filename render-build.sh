#!/usr/bin/env bash
set -euo pipefail

echo "📦 Installing backend dependencies..."
cd backend
npm ci

echo "🔨 Building backend..."
npm run build

echo "🌱 Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Render build complete!"
