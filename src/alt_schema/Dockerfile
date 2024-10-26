FROM node:20.17.0-alpine

RUN npm install -g prisma

WORKDIR /app

ENV DATABASE_URL=postgresql://prisma:prisma@database:5432/prisma_dev?schema=public

COPY ./sandbox.prisma ./prisma/schema.prisma

RUN npm init -y

CMD ["npx", "prisma", "studio"]

EXPOSE 5555