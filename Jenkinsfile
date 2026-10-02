pipeline {
    agent any

    environment {
        DOCKER_REPO = 'tumenta3322/hospitalflow-cicd'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${DOCKER_REPO}:${BUILD_NUMBER} \
                      -t ${DOCKER_REPO}:latest \
                      .
                '''
            }
        }

        stage('Test Docker Image') {
            steps {
                sh '''
                    set -e

                    CONTAINER_NAME="hospitalflow-test-${BUILD_NUMBER}"

                    docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

                    docker run -d \
                      --name "$CONTAINER_NAME" \
                      ${DOCKER_REPO}:${BUILD_NUMBER}

                    sleep 5

                    docker exec "$CONTAINER_NAME" \
                      wget -qO- http://127.0.0.1:80/ > /tmp/hospitalflow-test.html

                    grep -qi "<html" /tmp/hospitalflow-test.html

                    docker rm -f "$CONTAINER_NAME"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e

                        echo "$DOCKER_PASSWORD" | docker login \
                          --username "$DOCKER_USERNAME" \
                          --password-stdin

                        docker push ${DOCKER_REPO}:${BUILD_NUMBER}
                        docker push ${DOCKER_REPO}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                docker rm -f hospitalflow-test-${BUILD_NUMBER} 2>/dev/null || true
            '''
        }

        success {
            echo 'HospitalFlow CI completed successfully!'
        }

        failure {
            echo 'HospitalFlow CI failed.'
        }
    }
}
