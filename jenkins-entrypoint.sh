#!/bin/bash

# Set the Docker daemon address
DOCKER_HOST="tcp://docker:4243"

# Run the Jenkins pipeline
jenkinsfile="/app/Jenkinsfile"

# Check if the Jenkinsfile exists
if [ -f "$jenkinsfile" ]; then
  echo "Executing Jenkins pipeline..."
  cat "$jenkinsfile" | docker -H "$DOCKER_HOST" run -i --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD":/app greatnate27/recipe-app-pipeline-env:v1 cat
else
  echo "Jenkinsfile not found."
fi
