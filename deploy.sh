#! /bin/bash

echo PROFILE_NAME = $PROFILE_NAME;
echo BUCKET_NAME = $BUCKET_NAME;
echo DISTRIBUTION_ID = $DISTRIBUTION_ID;
echo ENVIRONMENT = $ENVIRONMENT;

ng build --configuration $ENVIRONMENT

BUILD_FOLDER="new-engine-ui"

aws configure set s3.multipart_threshold 128MB --profile ${PROFILE_NAME}
aws s3 sync dist/${BUILD_FOLDER}/browser s3://$BUCKET_NAME --profile ${PROFILE_NAME} --delete
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths '/*' --profile ${PROFILE_NAME}
