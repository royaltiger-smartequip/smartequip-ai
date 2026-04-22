#!/bin/bash

SMEE_URL=$(cat .smee-url 2>/dev/null)

if [ -z "$SMEE_URL" ] || [ "$SMEE_URL" = "https://smee.io/YOUR_CHANNEL_ID_HERE" ]; then
    echo "⚠️  Please update .smee-url with your actual Smee.io URL"
    echo ""
    echo "Steps:"
    echo "1. Go to https://smee.io"
    echo "2. Click 'Start a new channel'"
    echo "3. Copy the URL and paste it in .smee-url"
    exit 1
fi

echo "🔗 Starting Smee webhook forwarding..."
echo "📡 Forwarding from: $SMEE_URL"
echo "🎯 Forwarding to: http://localhost:3000"
echo ""

smee -u "$SMEE_URL" -t http://localhost:3000 -p /
