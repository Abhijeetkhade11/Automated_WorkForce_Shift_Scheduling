pipeline {
    agent any

    tools {
        // Uses Java 17 tool configured in Jenkins if available
        jdk 'jdk17'
    }

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

        stage('Run Tests') {
            steps {
                echo '=== STAGE 3: Executing Unit & Integration Tests ==='
                bat 'mvnw.cmd test'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'target/surefire-reports/*.xml'
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

        stage('Deploy') {
            steps {
                echo '=== STAGE 5: Verifying and Deploying Server Artifact ==='
                bat 'if exist target\\scheduling-0.0.1-SNAPSHOT.jar ( echo Artifact verified successfully! Ready for server deployment. ) else ( exit /b 1 )'
                echo 'Application package is verified and ready for environment deployment.'
            }
        }
    }

    post {
        success {
            echo '==================================================='
            echo 'SUCCESS: Pipeline executed cleanly! Week 8 complete.'
            echo '==================================================='
        }
        failure {
            echo '==================================================='
            echo 'FAILURE: Pipeline build failed. Inspect logs above.'
            echo '==================================================='
        }
    }
}
