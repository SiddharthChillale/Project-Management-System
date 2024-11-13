FROM node:20.17.0-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 

# ARG DATABASE_URL=postgresql://prisma:prisma@database:5432/prisma_dev?schema=public

COPY ./src/alt_schema/sandbox.prisma /app/src/alt_schema/sandbox.prisma

COPY . .

# RUN npx prisma generate
# RUN npx prisma migrate deploy
# RUN npm run build-fake-db

ENTRYPOINT ["./entrypoint.sh"]


EXPOSE 3000