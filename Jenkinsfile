pipeline {
    agent any
    environment {
        HOME = '.'
        DOCKERHUB_CREDENTIALS=credentials('b28bbdd7-0345-46b2-a3c8-050a04a90660')
    }
    stages {    
        stage('Checkout') {
            steps {
                    git branch: 'dev', url:'https://github.com/GreatNatesTrait/recipe-application.git'
            }
        }
        // stage("Test") {
        // steps {
        //     parallel (
        //         'Front end unit tests': {
        //             echo "run ng test here"                   
        //         },
        //         'backend unit tests': {
        //             echo "run npm test here"                    
        //         },
                    // 'lambda unit tests': {
                    //     echo 'Test Completed'
                    // }
        //     )
        // }
        // }
       
        // stage('Test Lambda Function') {
        //     steps {
        //         echo 'Test Completed'
        //     }
        // }

        
        stage('Terraform') {  
             agent {
                    docker {
                        image 'greatnate27/recipe-app-pipeline-env:v1'
                    }
                }        
            stages {
                stage('Lambda') {
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
                                    //"/var/lib/jenkins/workspace/recipe application build/server/api/lambda-functions/logger-API/terraform"
                                ]

                                def outputPaths = [
                                    "./dynamo-api-config.json",
                                    //"./client/src/environments/dynamo-api-config.json",
                                    //"/var/lib/jenkins/workspace/recipe application build/client/src/environments/logger-api-config.json"
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
                            //sh 'grep docker /etc/group'
                            //sh 'sudo chmod -R 777 /var/lib/jenkins/workspace'
                            //sh 'sudo chmod -x -R /var/lib/jenkins/workspace'
                            sh 'ausermod -aG docker jenkins'
                            sh 'docker build -t greatnate27/recipe-application:latest .'
                            sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                            sh 'docker push greatnate27/recipe-application:latest'
                            sh 'docker logout'
                    }
                }

                stage('Fargate') {
                    steps {
                        withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                        ]]) {
                           script {
                                dir('./infrastructure') {
                                    def terraformInitOutput = sh(script: 'terraform init')
                                    def terraformPlanOutput = sh(script: 'terraform plan')
                                    def terraformApplyOutput = sh(script: 'terraform apply -auto-approve')  
                                     input "Continue?"
                                    sh(script: 'terraform destroy -auto-approve')                                                                        
                                }
                            }
                        }                                 
                    }
                }
            }
        }   
    }    
}

