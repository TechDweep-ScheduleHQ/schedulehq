# Use Node 22
FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5173

# Start Vite dev server (hot reload)
CMD ["npm", "run", "dev", "--", "--host"]
