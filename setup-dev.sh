#!/bin/bash

# ASX Stock Analyzer - Development Setup Script
# This script sets up the development environment for both frontend and backend

echo "🚀 Setting up ASX Stock Analyzer Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "CURSOR_DEVELOPMENT_GUIDE.md" ]; then
    print_error "Please run this script from the asx-analyzer-dev-package directory"
    exit 1
fi

print_info "Setting up development environment..."

# Backend Setup
echo ""
echo "🐍 Setting up Flask Backend..."

cd asx_backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_warning "Virtual environment not found. Creating new one..."
    python3 -m venv venv
    if [ $? -eq 0 ]; then
        print_status "Virtual environment created"
    else
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment and install dependencies
print_info "Activating virtual environment and installing dependencies..."
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_warning "requirements.txt not found, installing basic dependencies..."
    pip install flask flask-sqlalchemy flask-cors requests
fi

cd ..

# Frontend Setup
echo ""
echo "⚛️ Setting up React Frontend..."

cd asx-stock-analyzer

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing pnpm..."
    npm install -g pnpm
    if [ $? -eq 0 ]; then
        print_status "pnpm installed"
    else
        print_error "Failed to install pnpm"
        exit 1
    fi
fi

# Install frontend dependencies
print_info "Installing frontend dependencies..."
pnpm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create environment files
echo ""
echo "📝 Creating environment configuration files..."

# Backend .env
if [ ! -f "asx_backend/.env" ]; then
    cat > asx_backend/.env << EOF
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=dev-secret-key-change-in-production

# API Keys (add your real keys here)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
YAHOO_FINANCE_API_KEY=your_yahoo_finance_key_here
FINNHUB_API_KEY=your_finnhub_key_here

# Database
DATABASE_URL=sqlite:///app.db
EOF
    print_status "Backend .env file created"
else
    print_info "Backend .env file already exists"
fi

# Frontend .env
if [ ! -f "asx-stock-analyzer/.env" ]; then
    cat > asx-stock-analyzer/.env << EOF
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_REAL_DATA=false
VITE_ENABLE_CHARTS=true
EOF
    print_status "Frontend .env file created"
else
    print_info "Frontend .env file already exists"
fi

# Create launch scripts
echo ""
echo "🚀 Creating launch scripts..."

# Backend launch script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🐍 Starting Flask Backend..."
cd asx_backend
source venv/bin/activate
export FLASK_ENV=development
export FLASK_DEBUG=1
python src/main.py
EOF
chmod +x start-backend.sh
print_status "Backend launch script created (start-backend.sh)"

# Frontend launch script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "⚛️ Starting React Frontend..."
cd asx-stock-analyzer
pnpm run dev
EOF
chmod +x start-frontend.sh
print_status "Frontend launch script created (start-frontend.sh)"

# Full stack launch script
cat > start-fullstack.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Full Stack Application..."

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🐍 Starting Flask Backend..."
cd asx_backend
source venv/bin/activate
export FLASK_ENV=development
export FLASK_DEBUG=1
python src/main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

echo "⚛️ Starting React Frontend..."
cd asx-stock-analyzer
pnpm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Full Stack Application Started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5000"
echo "📚 API Docs: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF
chmod +x start-fullstack.sh
print_status "Full stack launch script created (start-fullstack.sh)"

# Create development guide shortcut
cat > quick-start.md << 'EOF'
# Quick Start Guide

## 🚀 Start Development Servers

### Option 1: Full Stack (Recommended)
```bash
./start-fullstack.sh
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Option 2: Individual Servers
```bash
# Terminal 1 - Backend
./start-backend.sh

# Terminal 2 - Frontend  
./start-frontend.sh
```

## 📝 Key Files to Edit

### Frontend (React)
- `asx-stock-analyzer/src/App.jsx` - Main UI component
- `asx-stock-analyzer/src/App.css` - Styling

### Backend (Flask)
- `asx_backend/src/routes/stock_yahoo.py` - Real data integration
- `asx_backend/src/routes/stock_production.py` - Demo data

## 🔧 API Integration

Edit `.env` files to add your API keys:
- `asx_backend/.env` - Backend configuration
- `asx-stock-analyzer/.env` - Frontend configuration

## 📚 Full Documentation

See `CURSOR_DEVELOPMENT_GUIDE.md` for comprehensive instructions.
EOF
print_status "Quick start guide created (quick-start.md)"

# Final setup summary
echo ""
echo "🎉 Development Environment Setup Complete!"
echo ""
print_info "Next Steps:"
echo "  1. Open in Cursor: cursor ."
echo "  2. Add your API keys to .env files"
echo "  3. Start development: ./start-fullstack.sh"
echo ""
print_info "Available Commands:"
echo "  ./start-fullstack.sh  - Start both frontend and backend"
echo "  ./start-backend.sh    - Start Flask backend only"
echo "  ./start-frontend.sh   - Start React frontend only"
echo ""
print_info "URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo "  API Test: http://localhost:5000/api/analyze/CBA"
echo ""
print_info "Documentation:"
echo "  Quick Start: quick-start.md"
echo "  Full Guide:  CURSOR_DEVELOPMENT_GUIDE.md"
echo ""
print_status "Ready to develop! 🚀"
