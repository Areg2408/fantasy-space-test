# Use official Node.js image as the base image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/main.js"]
