#!/bin/bash

BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH_NAME" == *"/prod" || "$BRANCH_NAME" == "prod" ]]; then
    echo "Init deploy production"
    npm run deploy-prod
elif [[ "$BRANCH_NAME" == *"/stage" || "$BRANCH_NAME" == "stage" ]]; then
    echo "Init deploy uat"
    npm run deploy-uat
else
    echo "Init deploy development"
    npm run deploy-dev
fi
