#!/bin/sh

echo "env variables: "
env

echo "Generating Prisma Client..."
npx prisma generate

echo "Starting Server..."
if [ "$1" == "--dev" ]; then
    npm run dev
elif [ "$1" == "--prod" ]; then
    npm start
else
    echo "Usage: $0 --dev | --prod"
    exit 1
fi