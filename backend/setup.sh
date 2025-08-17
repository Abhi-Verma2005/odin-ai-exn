#!/bin/bash

echo "🚀 Setting up Algo Chat Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "📝 Setting up environment variables..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

echo "🔧 Building TypeScript..."
npm run build

echo "✅ Backend setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your database URLs and API keys"
echo "2. Set up your PostgreSQL databases"
echo "3. Run 'npm run dev' to start the development server"
echo "4. The server will be available at http://localhost:3001"
echo ""
echo "🔗 Health check: http://localhost:3001/health" 