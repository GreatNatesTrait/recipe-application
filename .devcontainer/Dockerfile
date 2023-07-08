FROM node:18

USER root

RUN mkdir /app
WORKDIR /app
COPY . .

# Install curl, unzip, and git
RUN apt-get update && apt-get install -y curl zip unzip git

#RUN npm install -g aws-cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install -i /usr/local/aws-cli -b /usr/local/bin

# Install Angular CLI
RUN npm install -g @angular/cli@16.0.0

# Install Terraform
ARG TERRAFORM_VERSION=1.4.6
RUN curl -LO "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip" && \
    unzip "terraform_${TERRAFORM_VERSION}_linux_amd64.zip" -d /usr/local/bin/ && \
    rm "terraform_${TERRAFORM_VERSION}_linux_amd64.zip"


ENV PATH="/root/.local/bin:/usr/local/bin:${PATH}"
ENV SUDO_FORCE_REMOVE=yes

RUN useradd -ms /bin/bash jenkins
RUN chown -R jenkins:jenkins /app
RUN chmod -R 777 /app

USER root

EXPOSE 3000


