FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Cài toàn bộ (bao gồm devDependencies để chạy test trong CI)
RUN npm install

COPY . .

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["npm", "start"]