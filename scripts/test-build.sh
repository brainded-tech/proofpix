#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting ProofPix Enterprise build test...${NC}\n"

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "Node.js version: ${GREEN}$NODE_VERSION${NC}"
if [[ ! $NODE_VERSION =~ ^v20 ]]; then
    echo -e "${RED}Error: Node.js 20.x is required${NC}"
    exit 1
fi

# Set OpenSSL legacy provider for Node.js 20
export NODE_OPTIONS="--openssl-legacy-provider"
echo -e "Setting Node options: ${GREEN}$NODE_OPTIONS${NC}"

# Clean previous build
echo -e "\n${YELLOW}Cleaning previous build...${NC}"
rm -rf build/
rm -rf node_modules/

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm ci
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
fi

# Type checking
echo -e "\n${YELLOW}Running type check...${NC}"
npm run type-check
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Type check failed${NC}"
    exit 1
fi

# Linting
echo -e "\n${YELLOW}Running linting...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Linting failed${NC}"
    exit 1
fi

# Testing
echo -e "\n${YELLOW}Running tests...${NC}"
npm run test:ci
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Tests failed${NC}"
    exit 1
fi

# Production build
echo -e "\n${YELLOW}Creating production build...${NC}"
NODE_ENV=production npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

# Analyze bundle size
echo -e "\n${YELLOW}Analyzing bundle size...${NC}"
npm run build:analyze

# Test Docker build
echo -e "\n${YELLOW}Testing Docker build...${NC}"
docker build -t proofpix-enterprise-test .
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
fi

# Run container test
echo -e "\n${YELLOW}Testing container...${NC}"
docker run -d -p 8080:80 --name proofpix-test proofpix-enterprise-test
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start container${NC}"
    docker rm -f proofpix-test 2>/dev/null
    exit 1
fi

# Wait for container to start
sleep 5

# Test container health
curl -f http://localhost:8080/health
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Container health check failed${NC}"
    docker rm -f proofpix-test
    exit 1
fi

# Clean up
docker rm -f proofpix-test

echo -e "\n${GREEN}Build test completed successfully!${NC}"
echo -e "Next steps:"
echo -e "1. Review bundle analysis report"
echo -e "2. Check test coverage report"
echo -e "3. Verify Docker image size"
echo -e "4. Deploy to staging environment" 