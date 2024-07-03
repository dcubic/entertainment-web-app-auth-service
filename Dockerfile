FROM node:20.11.1-alpine

WORKDIR /server

COPY package*.json ./
COPY jest.config.js ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ ./src/

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]