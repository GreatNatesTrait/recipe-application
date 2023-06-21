pipeline {
    agent any
    // agent {
    //     docker {
    //         image 'greatnate27/recipe-app-pipeline-env:v1'
    //     }
    // }  
    environment {
        HOME = '.'
    }
    stages {    
        stage('Checkout') {
            steps {
                    git branch: 'dev', url:'https://github.com/GreatNatesTrait/recipe-application.git'
            }
        }
        stage('Build image') {
            steps {
                    sh 'docker build -u 115:122 -t greatnate27/recipe-application:latest .'
            }
        }
        stage('Update Dynamo API') {
            when {
                expression {
                    def isChanged = sh(
                        returnStdout: true,
                        script: 'git diff --name-only HEAD HEAD^ server/api/lambda-functions'
                    ).trim()
                    isChanged != null && !isChanged.isEmpty()
                }
            }
            stages {
                stage('Test Lambda Function') {
                    steps {
                        echo 'Test Completed'
                    }
                }
                stage('Run Terraform') {
                    steps {
                        withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                        ]]) {
                           script {
                                def terraformDirectories = [
                                    "/var/lib/jenkins/workspace/recipe application build/server/api/lambda-functions/dynamo-API/terraform",
                                    "/var/lib/jenkins/workspace/recipe application build/server/api/lambda-functions/logger-API/terraform"
                                ]

                                def outputPaths = [
                                    "/var/lib/jenkins/workspace/recipe application build/client/src/environments/dynamo-api-config.json",
                                    "/var/lib/jenkins/workspace/recipe application build/client/src/environments/logger-api-config.json"
                                ]

                                terraformDirectories.eachWithIndex { terraformDirectory, index ->
                                    script {
                                        dir(terraformDirectory) {
                                            def terraformInitOutput = sh(script: 'terraform init')
                                            def terraformPlanOutput = sh(script: 'terraform plan')
                                            def terraformApplyOutput = sh(script: 'terraform apply -auto-approve')

                                            def outputPath = outputPaths[index]
                                            def terraformOutputOutput = sh(script: "terraform output -json > '${outputPath}'")
                                        }
                                    }
                                }
                            }

                        }                                 
                    }
                }
            }
        }

        stage("Test") {
            steps {
                parallel (
                    'Front end unit tests': {
                        echo "run ng test here"                   
                    },
                    'backend unit tests': {
                        echo "run npm test here"                    
                    }
                )
            }
        }

        stage('Build') {
            steps {
                script {                   
                   // Install frontend dependencies
                    dir('./client') {                      
                        sh 'npm install'
                        sh 'ng build'
                    }

                    // Install backend dependencies
                    dir('./server') {
                        sh 'npm install'
                    }
                }
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
                        #!/bin/bash              
                        mkdir -p "${PWD}/mytmp"
                        cp -R "${PWD}/client/dist" "${PWD}/server/server.js" "${PWD}/server/package.json" "${PWD}/mytmp"
                        cd "${PWD}/mytmp"
                        zip -r archive.zip *    
                        aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
                        aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
                        aws configure set region us-east-1                                                    
                        aws s3 cp archive.zip s3://${S3_BUCKET_NAME}/archive.zip 
                    '''
                }
            }
        }

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

