FROM node:23.7-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Create src directory if it doesn't exist
RUN mkdir -p src

EXPOSE 3000

# Start the development server
CMD ["npm", "start"]