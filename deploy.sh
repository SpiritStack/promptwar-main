#!/bin/bash
PROJECT_ID=$(gcloud config get-value project)
API_KEY=$(grep '^GEMINI_API_KEY=' .env.local | cut -d '=' -f 2)

echo "Deploying to project: $PROJECT_ID"
echo "Building and deploying from source..."

gcloud run deploy pharmacheck \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=$API_KEY"
