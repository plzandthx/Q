#!/bin/bash

# Q CSAT Local Development Setup Script
# This script will set up your local development environment

set -e

echo "🚀 Q CSAT Local Development Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for required tools
check_requirements() {
    echo "📋 Checking requirements..."

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed. Please install npm${NC}"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ is required. Current version: $(node -v)${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Node.js $(node -v) installed${NC}"
    echo -e "${GREEN}✅ npm $(npm -v) installed${NC}"
}

# Setup environment files
setup_env() {
    echo ""
    echo "📝 Setting up environment files..."

    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${GREEN}✅ Created .env from .env.example${NC}"
        else
            echo -e "${YELLOW}⚠️  No .env.example found, skipping .env creation${NC}"
        fi
    else
        echo -e "${GREEN}✅ .env already exists${NC}"
    fi

    if [ ! -f frontend/.env.local ]; then
        cat > frontend/.env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
        echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
    else
        echo -e "${GREEN}✅ frontend/.env.local already exists${NC}"
    fi
}

# Install dependencies
install_deps() {
    echo ""
    echo "📦 Installing dependencies..."

    echo "Installing backend dependencies..."
    npm install

    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..

    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Generate Prisma client
generate_prisma() {
    echo ""
    echo "🔧 Generating Prisma client..."

    npm run db:generate || {
        echo -e "${YELLOW}⚠️  Prisma generation failed. You may need to run this manually after setting up your database.${NC}"
        return 0
    }

    echo -e "${GREEN}✅ Prisma client generated${NC}"
}

# Setup database
setup_database() {
    echo ""
    echo "🗄️  Database Setup"
    echo ""
    echo "The application requires a PostgreSQL database and Redis."
    echo ""
    echo "Option 1: Using Docker (recommended)"
    echo "  docker-compose up -d postgres redis"
    echo ""
    echo "Option 2: Manual Setup"
    echo "  1. Install PostgreSQL and Redis locally"
    echo "  2. Create a database named 'qcsat'"
    echo "  3. Update DATABASE_URL in .env"
    echo "  4. Run: npm run db:push"
    echo ""
}

# Build applications
build_apps() {
    echo ""
    echo "🔨 Building applications..."

    echo "Building backend..."
    npm run build || {
        echo -e "${YELLOW}⚠️  Backend build has TypeScript errors (this is expected if Prisma isn't generated)${NC}"
    }

    echo "Building frontend..."
    cd frontend && npm run build && cd ..

    echo -e "${GREEN}✅ Applications built${NC}"
}

# Print completion message
print_completion() {
    echo ""
    echo "=================================="
    echo -e "${GREEN}🎉 Setup Complete!${NC}"
    echo "=================================="
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Set up your database (PostgreSQL + Redis)"
    echo "   docker-compose up -d postgres redis"
    echo ""
    echo "2. Run database migrations"
    echo "   npm run db:push"
    echo ""
    echo "3. Generate Prisma client"
    echo "   npm run db:generate"
    echo ""
    echo "4. Start the development servers"
    echo "   Terminal 1 (Backend):  npm run dev"
    echo "   Terminal 2 (Frontend): cd frontend && npm run dev"
    echo ""
    echo "5. Open the application"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo ""
    echo "For more information, see the README.md file."
}

# Main execution
main() {
    check_requirements
    setup_env
    install_deps
    setup_database
    generate_prisma
    build_apps
    print_completion
}

# Run main function
main "$@"
