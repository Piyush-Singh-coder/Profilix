#!/usr/bin/env bash
set -euo pipefail

echo "📦 Installing dependencies (including devDependencies for TypeScript build)..."
# NODE_ENV=production causes npm ci to skip devDependencies (@types/*, tsx, etc.)
# We need them to compile TypeScript, so we temporarily override it here.
NODE_ENV=development npm ci

echo "🔨 Building TypeScript..."
npm run build

echo "🌱 Running Prisma..."
npx prisma generate
npx prisma migrate deploy

echo "✅ Build complete!"
