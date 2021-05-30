exec docker run \
    --env AWS_ACCESS_KEY_ID="$(aws configure get default.aws_access_key_id)" \
    --env AWS_SECRET_ACCESS_KEY="$(aws configure get default.aws_secret_access_key)" \
    --env AWS_SESSION_TOKEN="$(aws configure get default.aws_session_token)" \
    --env AWS_REGION="$(aws configure get default.region)" \
    -p 9080:8080 \
    jumble-service dist/functions/jumbleMessage.index