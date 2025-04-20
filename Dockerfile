FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 1234

# Run the server
CMD ["node", "server.js"]