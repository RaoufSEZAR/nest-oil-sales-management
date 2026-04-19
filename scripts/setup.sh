#!/bin/bash

echo "🚀 Setting up Oil Sales API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL v12 or higher."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Setting up database..."
# Create database if it doesn't exist
createdb oil-sales-app 2>/dev/null || echo "Database already exists"

echo "📝 Creating environment file..."
if [ ! -f .env ]; then
    cp config.env .env
    echo "✅ Environment file created. Please update .env with your database credentials."
else
    echo "✅ Environment file already exists."
fi

echo "🔧 Building the application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Start the application: npm run start:dev"
echo "3. Visit http://localhost:3000/api/docs for API documentation"
echo ""
echo "🐳 Alternative: Use Docker Compose"
echo "docker-compose up -d"
