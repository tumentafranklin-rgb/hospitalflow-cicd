pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_REPO = 'tumenta3322/hospitalflow-cicd'
        APP_CONTAINER = 'hospitalflow'
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

        stage('Deploy to EC2') {
            steps {
                sh '''
                    set -e

                    NEW_IMAGE="${DOCKER_REPO}:${BUILD_NUMBER}"

                    echo "========================================="
                    echo "Deploying: $NEW_IMAGE"
                    echo "========================================="

                    echo "Pulling image from Docker Hub..."
                    docker pull "$NEW_IMAGE"

                    OLD_IMAGE=""

                    if docker inspect "$APP_CONTAINER" >/dev/null 2>&1; then
                        OLD_IMAGE=$(docker inspect \
                          --format='{{.Config.Image}}' \
                          "$APP_CONTAINER")

                        echo "Currently running: $OLD_IMAGE"
                    else
                        echo "No existing HospitalFlow container found."
                    fi

                    echo "Stopping current application..."

                    docker rm -f "$APP_CONTAINER" 2>/dev/null || true

                    echo "Starting new application..."

                    docker run -d \
                      --name "$APP_CONTAINER" \
                      --restart unless-stopped \
                      -p 80:80 \
                      "$NEW_IMAGE"

                    echo "Waiting for application to start..."
                    sleep 5

                    echo "Testing new deployment..."

                    if docker exec "$APP_CONTAINER" \
                        wget -qO- http://127.0.0.1:80/ \
                        > /tmp/hospitalflow-deploy.html \
                        && grep -qi "<html" /tmp/hospitalflow-deploy.html
                    then
                        echo "========================================="
                        echo "DEPLOYMENT SUCCESSFUL"
                        echo "Running image: $NEW_IMAGE"
                        echo "========================================="
                    else
                        echo "========================================="
                        echo "DEPLOYMENT FAILED"
                        echo "Starting rollback..."
                        echo "========================================="

                        docker rm -f "$APP_CONTAINER" 2>/dev/null || true

                        if [ -n "$OLD_IMAGE" ]; then
                            echo "Rolling back to: $OLD_IMAGE"

                            docker run -d \
                              --name "$APP_CONTAINER" \
                              --restart unless-stopped \
                              -p 80:80 \
                              "$OLD_IMAGE"

                            sleep 5

                            if docker exec "$APP_CONTAINER" \
                                wget -qO- http://127.0.0.1:80/ \
                                > /tmp/hospitalflow-rollback.html \
                                && grep -qi "<html" /tmp/hospitalflow-rollback.html
                            then
                                echo "Rollback successful."
                            else
                                echo "Rollback failed."
                                exit 1
                            fi
                        else
                            echo "No previous image available for rollback."
                        fi

                        exit 1
                    fi
                '''
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
            echo 'HospitalFlow CI/CD completed successfully!'
        }

        failure {
            echo 'HospitalFlow CI/CD failed.'
        }
    }
}
