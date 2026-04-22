#!/bin/bash

echo "🚀 SmartEquip AI Development Setup"
echo "=================================="
echo ""
echo "This will start TWO processes:"
echo "  1. Smee webhook forwarder (in background)"
echo "  2. SmartEquip AI app (in foreground)"
echo ""
echo "Press Ctrl+C to stop both"
echo ""

# Start Smee in background
./start-smee.sh &
SMEE_PID=$!

# Wait a moment for Smee to start
sleep 2

echo ""
echo "=================================="
echo ""

# Start the app in foreground
./start-app.sh

# When app stops, kill Smee too
kill $SMEE_PID 2>/dev/null
