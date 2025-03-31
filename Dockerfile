# Node.js image
FROM node:18
# Working directory
WORKDIR /app
# Copy project files
COPY package*.json ./
# Install dependecies
RUN npm install
# Copy other files
COPY . .
# Expose port 
EXPOSE 44000
# Start server
CMD ["npm", "start"]