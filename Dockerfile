# Use the base image for your application
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code to the container
COPY . .

# Install application dependencies
WORKDIR /app/server
RUN npm install

# Specify the command to run when the container starts
EXPOSE 3000
CMD [ "node", "server.js" ]
