FROM node:18 as builder
WORKDIR /app
COPY client/package.json ./
RUN npm i --production
COPY client/ ./
RUN npm install -g @angular/cli@16.0.0
RUN npm run build -w client

FROM node:18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server/package*.json .
COPY server/server.js .
RUN npm i --production

EXPOSE 3000
RUN echo "#!/bin/bash\nnode server.js" > /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
