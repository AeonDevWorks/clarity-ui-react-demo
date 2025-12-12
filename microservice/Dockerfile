FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including production deps)
RUN npm ci

# Copy source
COPY tsconfig.json .
COPY src ./src

# Build TS (optional if running via ts-node in dev, but good for prod)
# using ts-node for simplicity in this hackathon setup or compiling.
# Let's compile to be safe for Cloud Run.
RUN npm install typescript -g
RUN tsc

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "dist/index.js"]
