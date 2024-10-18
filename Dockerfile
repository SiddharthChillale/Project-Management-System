FROM node:20.17.0-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install 

COPY ./src/alt_schema/sandbox.prisma /app/src/alt_schema/sandbox.prisma
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build-fake-db
COPY . .
CMD ["npm", "run", "dev"]

EXPOSE 3000