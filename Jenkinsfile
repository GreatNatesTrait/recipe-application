pipeline {
    agent any

    stages {
        stage('Increment Version') {
            steps {
                withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        // Run the AWS CLI command and store the output in a variable
                        def version = sh(script: 'aws elasticbeanstalk describe-application-versions --application-name recipe-application --region us-east-1 --query "ApplicationVersions[0].VersionLabel" --output text', returnStdout: true).trim()
                        
                        // Check if the version is empty
                        if (version=='None') {
                            // Version is empty, set it to 1
                            env.app_version = "1"
                            echo "New version number: ${env.app_version}"
                        } else {
                            // Add 1 to the version
                            def nextVersion = Integer.parseInt(version) + 1
                            //def nextVersion = version + 1

                            // Set the variable in Jenkins
                            env.app_version = nextVersion.toString()
                            echo "New version number: ${env.app_version}"
                    }
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'dev', url:'https://github.com/GreatNatesTrait/recipe-application.git'
            }
        }

        stage('Update Lambda Functions') {
            steps {
                script {
                        def changes = sh(
                            returnStdout: true,
                            script: 'git diff --name-only HEAD HEAD^ server/api/lambda-functions'
                        ).trim()
                        
                        if (changes) {
                            // Files have been modified, run Terraform
                            stage('Run Terraform') {
                                steps {
                                    sh 'terraform init'
                                    sh 'terraform plan'
                                    sh 'terraform apply -auto-approve'
                                }
                            }
                        } else {
                            // No files have been modified, skip Terraform
                            echo "No changes detected in server/api/lambda-functions"
                        }
                    }
            }
        }

        stage('Build') {
            steps {
                sh '''
                    // Check if Node.js is installed
                    def nodeVersion = sh(returnStdout: true, script: 'node --version', returnStatus: true)
                    if (nodeVersion == 0) {
                        // Node.js is not installed, install it
                        sh 'curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -'
                        sh 'sudo apt-get install -y nodejs'
                    }

                    // Check if Angular CLI is installed
                    def ngVersion = sh(returnStdout: true, script: 'ng version', returnStatus: true)
                    if (ngVersion == 0) {
                        // Angular CLI is not installed, install it
                        sh 'sudo npm install -g @angular/cli'
                    }

                    # Install frontend dependencies
                    cd client
                    sudo npm install
                    # Build Angular app
                    ng build
                    cd ..

                    # Install backend dependencies
                    cd server
                    sudo npm install
                    cd ..
                '''
            }
        }

        stage('Deploy to S3') {
            environment {
                S3_BUCKET_NAME = 'recipe-app-code'
                local_folder_path = 'temp/dist/*'
                server_path = 'server/server.js'
            }
            steps {
                withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh '''
                        # Install AWS CLI (skip if already installed)
                        sudo apt-get install -y awscli
                        sudo apt-get install -y zip
                        sudo mkdir -p "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        sudo cp -R client/dist server/server.js server/package.json "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        cd "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        sudo zip -r archive.zip *
                        
                        # Upload files to S3 bucket
                        aws s3 cp archive.zip s3://${S3_BUCKET_NAME}/archive.zip
                        sudo rm -r "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                    '''
                }
            }
        }
      
        stage('Deploy to Elastic Beanstalk') {
            environment {
                S3_BUCKET_NAME = 'recipe-app-code'
                YOUR_APPLICATION_NAME = 'recipe-application'
                YOUR_ENVIRONMENT_NAME = 'recipe-env'
            }
            steps {
                withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        sh '''
                            #!/bin/bash
                            # Create new Elastic Beanstalk application version
                            aws elasticbeanstalk create-application-version --application-name ${YOUR_APPLICATION_NAME} --version-label $app_version --region us-east-1 --source-bundle S3Bucket=${S3_BUCKET_NAME},S3Key=archive.zip
        
                            # Update Elastic Beanstalk environment to use the new version
                            aws elasticbeanstalk update-environment --environment-name ${YOUR_ENVIRONMENT_NAME} --application-name ${YOUR_APPLICATION_NAME} --version-label $app_version --region us-east-1
                        '''
                    }
               }
             }   
          }
    }    
}
