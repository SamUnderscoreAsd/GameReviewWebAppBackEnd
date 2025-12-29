# Set reference Image
FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package-lock.json package.json ./
RUN npm ci --omit=dev

# Copy source Cody
COPY Project_Structure/ ./

# Select port
EXPOSE 3001

# Build the project
CMD ["node", "Business/Controller.js"]

