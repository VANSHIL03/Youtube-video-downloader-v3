# Use official Node.js image (Debian-based for better binary compatibility)
FROM node:20-bookworm-slim

# Install python, build tools, ffmpeg and curl
RUN apt-get update && apt-get install -y python3 python-is-python3 ffmpeg make g++ curl && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Force SQLite to compile from source code
RUN npm rebuild sqlite3 --build-from-source

# *** CRITICAL: Replace the old bundled yt-dlp with the latest version ***
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/src/app/node_modules/yt-dlp-exec/bin/yt-dlp && chmod a+rx /usr/src/app/node_modules/yt-dlp-exec/bin/yt-dlp

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]
