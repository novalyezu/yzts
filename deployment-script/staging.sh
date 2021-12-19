# !/bin/bash
set -e
# if you test on your local comp
# export DEPLOYMENT_NAME=staging-yzts
# export PROJECT_ID=google-project-id
# export CLUSTER_NAME=yzts-staging-cluster
# export CLOUDSDK_COMPUTE_ZONE=asia-southeast2-a
# export CONTAINER_NAME=staging-yzts
# export REG_ID=staging-yzts
# export DEPLOYMENT_ENVIRONMENT=staging
# export ACCOUNT_ID=circleci-service@google-project-id.iam.gserviceaccount.com
# export CIRCLE_SHA1=123456

echo "Deploying to ${DEPLOYMENT_ENVIRONMENT}"
echo $GCLOUD_SERVICE_KEY > service_key.txt
base64 -i service_key.txt -d > ${HOME}/gcloud-service-key.json
gcloud auth activate-service-account ${ACCOUNT_ID} --key-file ${HOME}/gcloud-service-key.json
# gcloud auth activate-service-account ${ACCOUNT_ID} --key-file google-project-id-service.json
gcloud config set project $PROJECT_ID
gcloud --quiet config set container/cluster $CLUSTER_NAME
gcloud config set compute/zone $CLOUDSDK_COMPUTE_ZONE
gcloud --quiet container clusters get-credentials $CLUSTER_NAME
docker build -t gcr.io/${PROJECT_ID}/${REG_ID}:$CIRCLE_SHA1 .
gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/${REG_ID}:$CIRCLE_SHA1
kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=gcr.io/${PROJECT_ID}/${REG_ID}:$CIRCLE_SHA1

echo "Successfully deployed to ${DEPLOYMENT_ENVIRONMENT}"