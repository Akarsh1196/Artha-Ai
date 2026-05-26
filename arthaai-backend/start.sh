#!/bin/bash
echo "Loading environment variables from .env..."
export $(grep -v '^#' .env | xargs)

echo "Starting Spring Boot server..."
./mvnw spring-boot:run
