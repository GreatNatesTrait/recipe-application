# Base image with Python
FROM python:3.9-slim-buster as base

# Install curl, unzip, and git
RUN apt-get update && apt-get install -y curl unzip git

# Install AWS CLI
RUN apt-get install -y python3-pip && \
    pip3 install --no-cache-dir awscli

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Angular CLI
RUN npm install -g @angular/cli@latest

# Install Terraform
ARG TERRAFORM_VERSION=1.0.0
RUN curl -LO "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip" && \
    unzip "terraform_${TERRAFORM_VERSION}_linux_amd64.zip" -d /usr/local/bin/ && \
    rm "terraform_${TERRAFORM_VERSION}_linux_amd64.zip"

# Install Elastic Beanstalk CLI
ARG EB_CLI_VERSION=3.20.0
RUN pip3 install --no-cache-dir awsebcli==${EB_CLI_VERSION}

# Set environment variables
ENV PATH="/root/.local/bin:${PATH}"

# Set the working directory
WORKDIR /app

# Define the entry point script content
RUN echo '#!/bin/sh' >> jenkins-entrypoint.sh && \
    echo 'set -e' >> jenkins-entrypoint.sh && \
    echo 'echo "Executing Jenkins entry point script..."' >> jenkins-entrypoint.sh && \
    echo '# Add your custom commands or configurations here' >> jenkins-entrypoint.sh && \
    echo 'exec "$@"' >> jenkins-entrypoint.sh

# Make the entry point script executable
RUN chmod +x jenkins-entrypoint.sh

# Define the entry point
ENTRYPOINT ["jenkins-entrypoint.sh"]
