# Use an official Node.js runtime as a base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Updating NPM
RUN npm install npm@10.4.0

# Install project dependencies
RUN npm install --omit=dev

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Command to run the application
CMD ["npm", "start"]