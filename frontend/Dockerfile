# filepath: Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]