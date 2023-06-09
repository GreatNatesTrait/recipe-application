FROM node:18 as builder

WORKDIR /app
RUN npm install -g @angular/cli@16.0.0
COPY client/package.json ./
RUN npm i
COPY client/ ./
RUN ng build --configuration production --aot


FROM node:18

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server/package*.json .
COPY server/server.js .
RUN npm i

EXPOSE 3000
RUN echo "#!/bin/bash\nnode server.js" > /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
