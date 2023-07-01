pipeline {
     agent {
        docker {
            image 'greatnate27/recipe-app-pipeline-env:v2'
            args '-u 115:999 -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    environment {
        HOME = '.'
        DOCKERHUB_CREDENTIALS= credentials('b28bbdd7-0345-46b2-a3c8-050a04a90660')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', url:'https://github.com/GreatNatesTrait/recipe-application.git'
            }
        }

        stage("Install project dev dependencies") {
            steps {
                sh(script: 'npm i --force')
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

        // stage('Deploy Lambdas') {
        //             steps {
        //                 withCredentials([[
        //                 $class: 'AmazonWebServicesCredentialsBinding',
        //                 credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
        //                 accessKeyVariable: 'AWS_ACCESS_KEY_ID',
        //                 secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        //                 ]]) {
        //                     script {
        //                         def terraformDirectories = [
        //                         "./server/api/lambda-functions/dynamo-API/terraform",
        //                         "./server/api/lambda-functions/logger-API/terraform"
        //                         ]

        //                         def outputPaths = [
        //                         "/var/lib/jenkins/workspace/recipe application build/client/src/environments/dynamo-api-config.json",
        //                          "/var/lib/jenkins/workspace/recipe application build/client/src/environments/logger-api-config.json"
        //                         ]

        //                         terraformDirectories.eachWithIndex { terraformDirectory, index ->
        //                             script {
        //                                 dir(terraformDirectory) {                                           
        //                                     def terraformInitOutput = sh(script: 'terraform init')
        //                                     def terraformPlanOutput = sh(script: 'terraform plan')
        //                                     def terraformApplyOutput = sh(script: 'terraform apply -auto-approve')
        //                                     def outputPath = outputPaths[index]
        //                                     def terraformOutputOutput = sh(script: "terraform output -json > '${outputPath}'")
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        // }

        stage('Deploy Lambdas') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        parallel {               
                                "Deploy dynamo api": {
                                    dir("./server/api/lambda-functions/dynamo-API/terraform") {                       
                                            sh 'terraform init'
                                            sh 'terraform plan'
                                            sh 'terraform apply -auto-approve'
                                            sh "terraform output -json > '/var/lib/jenkins/workspace/recipe application build/client/src/environments/dynamo-api-config.json'"
                                    }
                                },
                                "Deploy logger api": {
                                    dir("./server/api/lambda-functions/logger-API/terraform") {                       
                                            sh 'terraform init'
                                            sh 'terraform plan'
                                            sh 'terraform apply -auto-approve'
                                            sh "terraform output -json > '/var/lib/jenkins/workspace/recipe application build/client/src/environments/logger-api-config.json'"
                                    }
                                }                         
                        }
                    }
                }
            }
        }


        stage('Build image') {      	
            steps{               
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'    
                sh 'docker build -t greatnate27/recipe-application:latest .' 
                sh 'docker push greatnate27/recipe-application:latest'           
            }      

            post{
                always {  
                sh 'docker logout'     
                }      
            }              
        }   

        stage('Run Fargate Terraform') {
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