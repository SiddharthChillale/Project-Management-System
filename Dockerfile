FROM node:20.17.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 


# Stage 2: Runtime Stage
FROM node:20.17.0-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . . 

RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]