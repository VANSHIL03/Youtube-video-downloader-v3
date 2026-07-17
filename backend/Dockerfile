# Use official Node.js image (Debian-based for better binary compatibility)
FROM node:20-bookworm-slim

# Install python, build tools, and ffmpeg
RUN apt-get update && apt-get install -y python3 python-is-python3 ffmpeg make g++ && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Force SQLite to compile from source code to match the server's exact Linux version
RUN npm rebuild sqlite3 --build-from-source

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]
