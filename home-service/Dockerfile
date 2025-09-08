# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy wait-for-it script and make it executable
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod 755 /app/wait-for-it.sh

# Copy start script and make it executable
COPY start.sh /app/start.sh
RUN chmod 755 /app/start.sh

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose application port
EXPOSE 4001

# Command to run when container starts
CMD ["sh", "/app/start.sh"]
