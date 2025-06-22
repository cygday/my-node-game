FROM node:20-alpine
WORKDIR /number-guessing-game
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
