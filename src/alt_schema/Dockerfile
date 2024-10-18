FROM node:20.17.0-alpine
RUN npm install -g prisma
RUN mkdir /app
WORKDIR /app
COPY ./sandbox.prisma ./prisma/schema.prisma

RUN npm init -y

CMD ["npx", "prisma", "studio"]

EXPOSE 5555