#!/bin/sh
set -e

echo "Waiting for Kafka..."
sh /app/wait-for-it.sh kafka:9092 "echo 'Kafka is ready!'"

echo "Waiting for Redis..."
sh /app/wait-for-it.sh redis:6379 "echo 'Redis is ready!'"

echo "Starting home-service application..."
npm run start
