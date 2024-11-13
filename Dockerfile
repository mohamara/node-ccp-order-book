# Base stage with Linux (Debian in this case)
FROM ubuntu:latest as base
# RUN apt-get update && apt-get install -y curl

# Second stage with Node.js
FROM node:latest

# Copy the necessary files from the base stage
# COPY --from=base /usr/bin/curl /usr/bin/curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]