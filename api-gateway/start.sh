#!/bin/sh
set -e

echo "Waiting for Kafka..."
sh /app/wait-for-it.sh kafka:9092 "echo 'Kafka is ready!'"

echo "Starting home-service application..."
npm run start
