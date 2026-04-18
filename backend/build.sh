#!/usr/bin/env bash
set -euo pipefail

echo "📦 Installing dependencies (including devDependencies for TypeScript build)..."
# NODE_ENV=production causes npm ci to skip devDependencies (@types/*, tsx, etc.)
# We need them to compile TypeScript, so we temporarily override it here.
NODE_ENV=development npm ci

echo "🔨 Building TypeScript..."
npm run build

echo "🌱 Generating Prisma Client..."
# Only generate the client — schema is already set up in production DB.
# Run schema changes manually with: npx prisma db push
npx prisma generate

echo "✅ Build complete!"
