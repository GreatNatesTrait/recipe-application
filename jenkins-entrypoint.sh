#!/bin/bash

# Set the Docker daemon address
DOCKER_HOST="tcp://docker:4243"

# Run the Jenkins pipeline
jenkinsfile="/app/Jenkinsfile"

# Check if the Jenkinsfile exists
if [ -f "$jenkinsfile" ]; then
  echo "Executing Jenkins pipeline..."
  cat "$jenkinsfile" | sudo docker -H "$DOCKER_HOST" run -i --rm -v /var/run/docker.sock:/var/run/docker.sock cat
else
  echo "Jenkinsfile not found."
fi

# Execute the subsequent command or process
exec sudo "$@"
