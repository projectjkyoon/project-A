FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
WORKDIR /app/apps/api
CMD ["npm", "run", "dev"]
