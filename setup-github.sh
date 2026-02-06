#!/bin/bash
# Setup script for pushing to GitHub

echo "🚀 Setting up Git repository..."

# Initialize git (if not already)
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized"
fi

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HKids Child Reading Platform - Complete POC with frontend and backend"

echo ""
echo "✅ Repository ready!"
echo ""
echo "📝 Next steps:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📖 See DEPLOYMENT.md for Vercel deployment instructions"
