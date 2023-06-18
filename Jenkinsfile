pipeline {
    agent {
        docker {
            image 'greatnate27/recipe-app-pipeline-env:v1'
        }
    }  
    environment {
        HOME = '.'
        //AWS_ACCESS_KEY_ID = ''
        //AWS_SECRET_ACCESS_KEY = ''
        //AWS_ACCESS_KEY_ID = credentials('c49b4767-615c-47ed-8880-e33d5b620515').accessKey.toString()
        //AWS_SECRET_ACCESS_KEY = credentials('c49b4767-615c-47ed-8880-e33d5b620515').secretKey.toString()
        //AWS = credentials('c49b4767-615c-47ed-8880-e33d5b620515')
    }
    stages {    
        //        stage('Configure AWS Credentials') {
        //     steps {
        //         withCredentials([
        //             [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'c49b4767-615c-47ed-8880-e33d5b620515', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
        //         ]) {
        //             // Credentials are now available as environment variables
        //             // Set the global environment variables to be used in other stages
        //             script {
        //                 env.AWS_ACCESS_KEY_ID = sh(script: 'echo $AWS_ACCESS_KEY_ID', returnStdout: true).trim()
        //                 env.AWS_SECRET_ACCESS_KEY = sh(script: 'echo $AWS_SECRET_ACCESS_KEY', returnStdout: true).trim()
        //             }
        //         }
        //     }
        // }
        
        // stage('Other Stage') {
        //     steps {
        //         // You can now reference the AWS credentials using the environment variables
        //         sh """
        //             # Example usage
        //             aws --version
        //             aws configure set aws_access_key_id ${env.AWS.AWS_ACCESS_KEY_ID}
        //             aws configure set aws_secret_access_key ${env.AWS.AWS_SECRET_ACCESS_KEY}
        //             aws configure set region us-east-1
        //             aws s3 cp my-file.txt s3://my-bucket/
        //         """
        //     }
        // }
        // stage('Confi') {
        //     steps {
        //         withCredentials([
        //             [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'c49b4767-615c-47ed-8880-e33d5b620515', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
        //         ]) {
        //             sh """
        //                 # Configure AWS credentials
        //                 mkdir -p ~/.aws
        //                 echo "[default]" > ~/.aws/credentials
        //                 echo "aws_access_key_id=${AWS_ACCESS_KEY_ID}" >> ~/.aws/credentials
        //                 echo "aws_secret_access_key=${AWS_SECRET_ACCESS_KEY}" >> ~/.aws/credentials
        //             """
        //         }
        //     }
        // }    
        stage('tesintg') {        
           steps {
                  sh 'echo ${PWD}'
                  sh 'echo $PWD'
                  sh 'echo ${USER}'
                  sh 'echo $USER'
                  sh 'node --version'
                  //sh 'aws --version'
                  //sh 'ls $PWD'
           }                        
        }
        stage('Checkout') {
            steps {
                //withCredentials([gitUsernamePassword(credentialsId: 'e478701a-01ce-4a26-9b6b-d977fbeee953', gitToolName: 'git-tool')]) {
                    git branch: 'dev', url:'https://github.com/GreatNatesTrait/recipe-application.git'
                //}
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
                //steps {
                    // sh '''#!/bin/bash
                    //         npm install "${PWD}/client" 
                    //         ng build
                    // '''
                //}
                script {                   
                   // Install frontend dependencies
                    dir('${PWD}/client') {
                        sh 'echo ${PWD}'
                        sh 'echo $PWD'
                        sh 'ls /app'
                        sh 'ls app'
                        sh 'npm install'
                        //sh 'sudnpm install -C "app/client"'
                        sh 'ng build'
                    }

                    // Install backend dependencies
                    dir("${PWD}/server") {
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
                //string(credentialsId: 'secret', variable: 'SECRET'),
                withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                accessKeyVariable: '${AWS_ACCESS_KEY_ID}',
                secretKeyVariable: '${AWS_SECRET_ACCESS_KEY}'
                ]]) {
                        // # Install AWS CLI (skip if already installed)
                        // sudo apt-get install -y awscli
                        // sudo apt-get install -y zip
                        //mkdir -p "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        //cp -R client/dist server/server.js server/package.json "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        //cd "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        //zip -r archive.zip *
                        //rm -r "/var/lib/jenkins/workspace/recipe application build/path/to/temp"
                        //zip -r archive.zip app/client/dist app/server/server.js app/server/package.json 
                        //aws configure set aws_access_key_id ${env.AWS_ACCESS_KEY_ID}
                        //aws configure set aws_secret_access_key ${env.AWS_SECRET_ACCESS_KEY}
                        //aws configure set region us-east-1
                                                //zip -r "${PWD}/output.zip" "${PWD}/mytmp"                                    
                        //aws s3 cp archive.zip s3://${S3_BUCKET_NAME}/archive.zip   
                    sh '''                   
                        mkdir -p "${PWD}/mytmp"
                        cp -R "${PWD}/client/dist" "${PWD}/server/server.js" "${PWD}/server/package.json" "${PWD}/mytmp"
                        zip -r "${PWD}/output.zip" "${PWD}/mytmp"                                    
                        aws s3 cp "${PWD}/output.zip" s3://${S3_BUCKET_NAME}/archive.zip 
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

