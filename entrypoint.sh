#!/bin/sh

echo "env variables: "
env

echo "Generating Prisma Client..."
npx prisma generate

echo "Applying Database Migrations..."
npx prisma migrate deploy

echo "Waiting for DB..."
node waitForDB.js

echo "Starting Server..."
if [ "$1" = "--dev" ]; then
    npm run dev
elif [ "$1" = "--prod" ]; then
    npm start
else
    echo "Usage: $0 --dev | --prod"
    exit 1
fi