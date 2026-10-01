pipeline {
    agent any

    environment {
        APP_NAME = 'Workforce Scheduling System'
        BUILD_ARTIFACT = 'target/scheduling-0.0.1-SNAPSHOT.jar'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== STAGE 1: Checking out source code from Git ==='
                checkout scm
            }
        }

        stage('Compile & Build') {
            steps {
                echo '=== STAGE 2: Compiling Java source code ==='
                bat 'mvnw.cmd clean compile'
            }
        }

        stage('Continuous Testing (Unit & Selenium UI)') {
            steps {
                echo '=== STAGE 3: Executing Unit Tests & Selenium WebDriver UI Tests ==='
                bat 'mvnw.cmd test'
            }
            post {
                always {
                    echo '=== Archiving Surefire Test Reports ==='
                    junit allowEmptyResults: true, testResults: 'target/surefire-reports/*.xml'
                }
                failure {
                    echo 'WARNING: One or more automated tests failed in Continuous Testing stage!'
                }
            }
        }

        stage('Package Artifact') {
            steps {
                echo '=== STAGE 4: Packaging application into executable JAR ==='
                bat 'mvnw.cmd package -DskipTests'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                }
            }
        }

        stage('Docker Image Build') {
            steps {
                echo '=== STAGE 5: Building Docker Image ==='
                bat 'docker build -t workforce-scheduling:latest .'
            }
        }

        stage('Continuous Deployment (Docker)') {
            steps {
                echo '=== STAGE 6: Deploying Container ==='
                bat '''
                    docker stop shift-scheduler || exit 0
                    docker rm shift-scheduler || exit 0
                    docker run -d -p 8080:8080 --name shift-scheduler workforce-scheduling:latest
                '''
            }
        }
    }

    post {
        success {
            echo '==================================================='
            echo 'SUCCESS: Pipeline & Continuous Testing executed cleanly!'
            echo '==================================================='
        }
        failure {
            echo '==================================================='
            echo 'FAILURE: Pipeline build failed. Inspect logs above.'
            echo '==================================================='
        }
    }
}
