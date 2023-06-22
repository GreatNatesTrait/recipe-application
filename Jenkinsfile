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
        stage('Build image') {
            steps {
                    sh 'docker build -t greatnate27/recipe-application:latest .'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push greatnate27/recipe-application:latest'
                    sh 'docker logout'
            }
        }
        stage('Fargate Terraform') {  
             agent {
                    docker {
                        image 'greatnate27/recipe-app-pipeline-env:v1'
                    }
                }        
            stages {
                stage('Run Terraform') {
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

