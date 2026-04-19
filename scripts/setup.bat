@echo off
echo 🚀 Setting up Oil Sales API...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL v12 or higher.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo 🗄️  Setting up database...
REM Create database if it doesn't exist
createdb oil-sales-app 2>nul || echo Database already exists

echo 📝 Creating environment file...
if not exist .env (
    copy config.env .env
    echo ✅ Environment file created. Please update .env with your database credentials.
) else (
    echo ✅ Environment file already exists.
)

echo 🔧 Building the application...
npm run build

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env file with your database credentials
echo 2. Start the application: npm run start:dev
echo 3. Visit http://localhost:3000/api/docs for API documentation
echo.
echo 🐳 Alternative: Use Docker Compose
echo docker-compose up -d
pause
