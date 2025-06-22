pipeline {

    agent any     

    environment {

        // Environment variables that will be available throughout the pipeline

        APP_NAME = 'my-node-game'                   // Name of your application

        DOCKER_IMAGE = 'cygday/my-node-game:${BUILD_NUMBER}' 

        // Docker image name with your DockerHub username and build number as tag

        DOCKER_REGISTRY = 'dockerhub'             // Using DockerHub as registry

        PROD_SERVER = 'local'                     // Indicates local deployment

    }
 
    stages {

        stage('Initialize') {

            steps {

                script {

                    // Verify Node.js and npm are available

                    sh 'node --version'  // Checks installed Node.js version

                    sh 'npm --version'   // Checks installed npm version

                }

            }

        }
 
        stage('Build') {

            steps {

                echo 'Building the Node.js application...'

                sh 'npm install'         // Installs all Node.js dependencies

            }

        }
 
        stage('Unit Test') {

            steps {

                echo 'Running unit tests...'

            }

        }
 
stage('Build Docker Image') {

    steps {

        script {

            echo 'Building Docker image...'

            sh "docker build -t my-node-game:${BUILD_NUMBER} ."
            
        }

    }

}
 
stage('Push Docker Image to Docker Hub') {

    steps {

        script {

            withDockerRegistry([credentialsId: 'dockerhubcredentials', url: '']) {

                sh "docker push cygday/my-node-game:${BUILD_NUMBER}"

            }

        }

    }

}
 
 
stage('Deploy to Prod Env') {

    steps {

        script {

            echo 'Deploying to production environment...'

            // Stop and remove any existing container

            sh 'docker stop my-node-game:latest || true'

            sh 'docker rm my-node-game:latest || true'

            // Run new container

            sh "docker run -d -p 3000:3000 --name my-node-game-prod cygday/my-node-game:${BUILD_NUMBER}"

        }

    }

}

    }

    post{
 
                always {
 
                    mail to: 'amethystpun98@gmail.com',
 
                    subject: "Job '${JOB_NAME}' (${BUILD_NUMBER}) status",
 
                    body: "Please go to ${BUILD_URL} and verify the build"
 
                }

                success {
 
                    mail bcc: '', body: """Hi Team,
 
                    Build #$BUILD_NUMBER is successful, please go through the url
 
                    $BUILD_URL
 
                    and verify the details.
 
                    Regards,
 
                    DevOps Team""", cc: '', from: '', replyTo: '', subject: 'BUILD SUCCESS NOTIFICATION', to: 'amethystpun98@gmail.com'
 
                }

                failure {
 
                        mail bcc: '', body: """Hi Team,
 
                        Build #$BUILD_NUMBER is unsuccessful, please go through the url
 
                        $BUILD_URL
 
                        and verify the details.
 
                        Regards,
 
                        DevOps Team""", cc: '', from: '', replyTo: '', subject: 'BUILD FAILED NOTIFICATION', to: 'amethystpun98@gmail.com'
 
                }
 
         }

}
 
