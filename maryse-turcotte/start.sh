#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Kill any process using our ports
echo "Cleaning up ports..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true

# Start the backend server
echo "Starting Maryse Turcotte Neural Core..."
cd "$SCRIPT_DIR/backend" && npm install && node index.js &
BACKEND_PID=$!

# Wait a moment for the backend to initialize
sleep 2

# Start the web server
echo "Starting Maryse Turcotte Neural Interface..."
cd "$SCRIPT_DIR/web" && python3 -m http.server 8000 &
WEB_PID=$!

echo "🧠 Maryse Turcotte Neural System Online!"
echo "Access Neural Interface at: http://localhost:8000/character.html"
echo "Neural Core API running at: http://localhost:3000"
echo "Press Ctrl+C to terminate neural connections"

# Function to cleanup processes on exit
cleanup() {
    echo "Shutting down neural systems..."
    kill $BACKEND_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    exit 0
}

# Set up trap to catch SIGINT (Ctrl+C) and other termination signals
trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?