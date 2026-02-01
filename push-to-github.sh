#!/bin/bash

# Script to push code to GitHub
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
    echo "Example: ./push-to-github.sh john-doe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="patient-appointment-systems"

echo "Setting up GitHub remote..."
git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git 2>/dev/null || git remote set-url origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

echo "Setting branch to main..."
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "📦 Repository URL: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com or https://netlify.com to deploy the frontend"
echo "2. Go to https://render.com or https://railway.app to deploy the backend"
echo "3. See DEPLOYMENT.md for detailed instructions"
