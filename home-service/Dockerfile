# Use the official Node.js image as the base image
FROM node:18.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Node.js app will run
EXPOSE 4001

# Environment variables for connecting to MySQL

# Command to start your Node.js application
CMD ["npm", "start"]
