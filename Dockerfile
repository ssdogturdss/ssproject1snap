# syntax=docker/dockerfile:1
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
