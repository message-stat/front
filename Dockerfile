# docker build -t back:latest

ARG NODE_VERSION=16.18-alpine

FROM node:${NODE_VERSION}

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build-docker

CMD ["npm", "run", "preview"]
