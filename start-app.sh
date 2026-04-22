#!/bin/bash

echo "🤖 Starting SmartEquip AI..."
echo ""

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Please create .env file with your GitHub App credentials"
    exit 1
fi

# Check if required vars are set
if ! grep -q "APP_ID=" .env || grep -q "APP_ID=your_app_id_here" .env; then
    echo "⚠️  Please update APP_ID in .env file"
    exit 1
fi

npm start
