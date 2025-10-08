# Use Node 22
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything
COPY . .

# Set environment variable for Windows Docker file watching
ENV CHOKIDAR_USEPOLLING=true

# Expose port
EXPOSE 5000

# Start in dev mode
CMD ["npm", "run", "dev"]
