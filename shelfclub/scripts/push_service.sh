#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

SERVICE_NAME=$1

# Change directory to the service dir
cd ~/dev/shelfclub/$1

# Build the image with multiple tags
docker build -t $SERVICE_NAME .

# Tag the image with the ECR repo
docker tag media_catalog_api:latest public.ecr.aws/z5a9u7t7/media_catalog_api

# Push to the ECR repo
docker push public.ecr.aws/z5a9u7t7/media_catalog_api

# Update the service with force-new-deployment
aws ecs update-service \
  --cluster prod \
  --service media_catalog_api \
  --task-definition media_catalog_api \
  --force-new-deployment
