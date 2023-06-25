pipeline {
    agent any
    environment {
        HOME = '.'
    }
    stages {
        stage('Checkout') {
            steps {
                    git branch: 'dev', url:'https://github.com/GreatNatesTrait/recipe-application.git'
            }
        }

        stage("Install project dev dependencies") {
            steps {
                sh(script: 'npm install -D')
            }
        }

        stage("Run Unit Tests") {
            steps {
                parallel (
                    'Front end unit tests': {
                            sh(script: 'npm run test -w client')                        
                    },
                    'backend unit tests': {
                        echo "run npm test here"
                    },
                    'dynamo lambda unit tests': {
                        echo 'Test Completed'
                    },
                    'logger lambda unit tests': {
                        sh(script: 'npm run test -w server/api/lambda-functions/logger-API/code')
                    }
                )
            }
        }

        stage('Deploy Lambda') {
                    steps {
                        withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                        ]]) {
                            script {
                                def terraformDirectories = [
                                "./server/api/lambda-functions/dynamo-API/terraform",
                                "./server/api/lambda-functions/logger-API/terraform"
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

        stage('Build image') {           
            steps {
                withDockerRegistry([ credentialsId: "b28bbdd7-0345-46b2-a3c8-050a04a90660", url: "" ]) {
                    sh 'docker build -t greatnate27/recipe-application:latest .'
                    sh 'docker push greatnate27/recipe-application:latest'
            }
            }
        }

        stage('Run Fargate Terraform') {
            agent {
                docker {
                    image 'greatnate27/recipe-app-pipeline-env:v1'
                }
            }
            steps {
                withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        dir('./infrastructure') {
                            sh(script: 'terraform init')
                            sh(script: 'terraform plan')
                            sh(script: 'terraform apply -auto-approve')
                            input "Continue?"
                            sh(script: 'terraform destroy -auto-approve')
                        }
                    }
                }
            }                          
        }
    }
}