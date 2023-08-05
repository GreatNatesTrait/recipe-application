pipeline {
     agent {
        docker {
            image 'greatnate27/recipe-app-pipeline-env:v3'
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
                sh(script: 'npm i -D')
            }
        }

        stage("Run Unit Tests") {
            steps {
                parallel (
                    'Front end unit tests': {
                        sh(script: 'npm test -w client')                        
                    },
                    'backend unit tests': {
                        sh(script: 'npm test -w server')
                    },
                    'dynamo lambda unit tests': {
                        sh(script: 'npm test -w server/api/lambda-functions/dynamo-API/code')
                    },
                    'logger lambda unit tests': {
                        sh(script: 'npm test -w server/api/lambda-functions/logger-API/code')
                    }
                )
            }
        }


        stage('Deploy Lambdas') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    //credentialsId: "c49b4767-615c-47ed-8880-e33d5b620515",
                    credentialsId: "new",
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        parallel (               
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
                                },
                                "Deploy cache api": {
                                    dir("./server/api/lambda-functions/cache-API/terraform") {                       
                                        sh 'terraform init'
                                        sh 'terraform plan'
                                        sh 'terraform apply -auto-approve'
                                        sh "terraform output -json > '/var/lib/jenkins/workspace/recipe application build/client/src/environments/cache-api-config.json'"
                                    }
                                },
                                "Deploy s3 api": {
                                    dir("./server/api/s3-proxy") {                       
                                        sh 'terraform init'
                                        sh 'terraform plan'
                                        sh 'terraform apply -auto-approve'
                                        sh "terraform output -json > '/var/lib/jenkins/workspace/recipe application build/client/src/environments/outputs.json'"
                                    }
                                },
                                                                
                        )
                         
                                    dir("./server/api/lambda-functions/streams-API") {   
                                        sh 'zip cacheLambda.zip main.js'                 
                                        sh 'aws lambda create-function --function-name cacheLambda --runtime nodejs18.x --handler main.handler --zip-file fileb://cacheLambda.zip --role arn:aws:iam::372554721158:role/dynamo-cache-role'
                                        //sh 'aws lambda create-event-source-mapping --function-name cacheLambda --event-source-arn arn:aws:dynamodb:us-east-1:372554721158:table/RecipeTable/stream/2023-07-09T15:42:37.365 --starting-position LATEST'
                                    }
                               
                    }
                }
            }
        }


        stage('Build app image') {      	
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

        // stage('Run Fargate Terraform') {
        //     steps {
        //         withCredentials([[
        //         $class: 'AmazonWebServicesCredentialsBinding',
        //         credentialsId: "new",
        //         accessKeyVariable: 'AWS_ACCESS_KEY_ID',
        //         secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        //         ]]) {
        //             script {
        //                 dir('./infrastructure') {
        //                     sh(script: 'terraform init')
        //                     sh(script: 'terraform plan')
        //                     sh(script: 'terraform apply -auto-approve')
        //                 }
        //             }
        //         }
        //     }                          
        // }

          stage('Deploy to EKS') {
            environment {
                AWS_REGION = 'us-east-1'
                EKS_CLUSTER_NAME = 'nates-eks-cluster'
            }
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: "new",
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {       
                    // Update kubeconfig to connect to EKS cluster
                    sh 'aws sts get-caller-identity'
                    sh 'aws eks --region $AWS_REGION update-kubeconfig --name $EKS_CLUSTER_NAME'
        
                    // Apply Kubernetes deployment
                    sh 'sudo kubectl apply -f deployment.yaml'
                    sh 'sudo kubectl create -f loadbalancer.yaml'
                    }
            }
        }


        stage('Show external address to load balancer') {
            steps {             
                script {
                input "Continue?"                               
                    withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'c49b4767-615c-47ed-8880-e33d5b620515',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                    sh 'sudo kubectl get services'
                    }                 
                }
            }
        }

        stage('Destroy all infrastructure') {
            steps {             
                script {
                input "Continue?"                               
                    withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'new',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                    parallel (
                        "Destroy dynamo API": {
                        dir('./server/api/lambda-functions/dynamo-API/terraform') {
                            sh 'terraform destroy -auto-approve'
                        }
                        },
                        "Destroy logger API": {
                        dir('./server/api/lambda-functions/logger-API/terraform') {
                            sh 'terraform destroy -auto-approve'
                        }
                        },
                        "Destroy cache API": {
                        dir('./server/api/lambda-functions/cache-API/terraform') {
                            sh 'terraform destroy -auto-approve'
                        }
                        },
                        "Destroy s3 API": {
                        dir('./server/api/s3-proxy') {
                            sh 'aws s3 rm s3://nwebhook-apigateway --recursive'
                            sh 'terraform destroy -auto-approve'
                        }
                        },
                        "Destroy Fargate": {
                        dir('./infrastructure') {
                            sh 'terraform destroy -auto-approve'
                        }
                        }
                    )
                    //sh 'aws lambda list-event-source-mappings --function-name cacheLambda --event-source-arn arn:aws:dynamodb:us-east-1:372554721158:table/RecipeTable/stream'
                    sh 'aws lambda delete-function --function-name cacheLambda'
                    }                 
                }
            }
        }
    }
}