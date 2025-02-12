FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with --legacy-peer-deps to avoid issues
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

EXPOSE 5173

# Remove VITE_HOST and update the command
CMD ["npm", "run", "dev", "--", "--host"]