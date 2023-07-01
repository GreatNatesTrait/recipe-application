FROM node:18 as builder
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g @angular/cli@16.0.0
COPY client/package.json ./
#RUN npm i --omit=dev
RUN npm install --production
COPY client/ ./

#RUN npm run build
RUN ng build

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
