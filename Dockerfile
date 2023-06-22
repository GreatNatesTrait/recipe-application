# Use the official Node.js image as the base image
FROM node:18 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY client/package*.json ./

# Install the project dependencies
#RUN npm ci --only=production
RUN npm i
# Copy the Angular app source code to the container
COPY client/ ./

RUN npm install -g @angular/cli@latest 

# Build the Angular app
RUN npm run build

# Use a new base image for the server
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the built Angular app from the previous stage
COPY --from=builder /app/dist ./dist

# Copy the server files to the container
COPY server/package*.json .
COPY server/server.js .

# Install dependencies
RUN npm i
RUN npm ci --production

# Expose port 3000
EXPOSE 3000

# Define the entrypoint script
RUN echo "#!/bin/bash\nnode server.js" > /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
