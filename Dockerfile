# FROM node:18

# RUN mkdir /app
# WORKDIR /app
# COPY . .



# EXPOSE 3000

# FROM node:18 AS ui-build
# WORKDIR /app
# COPY client/package.json ./my-app/
# RUN cd my-app && npm install @angular/cli && npm install && npm run build

# FROM node:10 AS server-build
# WORKDIR /root/
# COPY --from=ui-build /usr/src/app/my-app/dist ./my-app/dist
# COPY package*.json ./
# RUN npm install
# COPY server.js .

# EXPOSE 3080

# CMD ["node", "server.js"]

#stage 1
# FROM node:latest as node
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build --prod
# #stage 2
# FROM nginx:alpine
# COPY --from=node /app/dist /usr/share/nginx/html

# stage 1
# FROM node:lts-alpine as builder
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# COPY client/package.json ./
# RUN npm install

# COPY . .
# RUN npm run build --prod
# #RUN ng build --configuration production --output-path=/dist
# # stage 2
# FROM nginx:stable-alpine
# WORKDIR /usr/share/nginx/html
# # Remove default nginx static assets
# RUN rm -rf ./*
# # Copy static assets from builder stage
# COPY --from=builder client/dist .
# # Containers run nginx with global directives and daemon off
# EXPOSE 80
# ENTRYPOINT ["nginx", "-g", "daemon off;"]



#stage 1
FROM node:latest AS builder
WORKDIR /app
COPY . .
WORKDIR /app/client
#RUN npm cache clean --force
RUN npm install @angular/cli -g
RUN npm i

RUN ng build
#WORKDIR /app
#WORKDIR /app/server
#RUN npm i
#stage 2
FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy dist folder fro build stage to nginx public folder
COPY --from=builder /app/client/dist  /usr/share/nginx/html
#COPY --from=builder /app/server/server.js  /usr/share/nginx/html
#COPY --from=builder /app/server/server.js  /usr/share/nginx/html

# Copy nginx config file
COPY /nginx.conf  /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]






