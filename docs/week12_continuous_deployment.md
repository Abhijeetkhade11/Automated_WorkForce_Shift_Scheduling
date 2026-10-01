# Week 12: Jenkins-Docker Continuous Deployment

## Overview
This week we completed the continuous deployment loop! By combining Jenkins and Docker, any new code pushed to the repository that passes the automated Selenium and Unit tests is automatically built into a new Docker Image and deployed as a running Container.

## 1. Updating the Jenkinsfile
We replaced the dummy deployment stage with two new stages in our `Jenkinsfile`:

### Stage 5: Docker Image Build
```groovy
stage('Docker Image Build') {
    steps {
        echo '=== STAGE 5: Building Docker Image ==='
        bat 'docker build -t workforce-scheduling:latest .'
    }
}
```
This stage takes the successfully tested and packaged code and builds a fresh `workforce-scheduling:latest` Docker image.

### Stage 6: Continuous Deployment
```groovy
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
```
This stage does the following:
1. **Stops** the currently running `shift-scheduler` container (if any).
2. **Removes** the old container to prevent naming conflicts.
3. **Runs** the newly built Docker image on port 8080.

## 2. Zero-Touch Deployment
With this integration, the DevOps lifecycle is fully automated from code push to production deployment. Whenever a commit is pushed to GitHub, Jenkins automatically:
1. Checks out the code
2. Compiles it
3. Runs the unit and Selenium UI tests
4. Packages the artifact
5. Builds a new Docker image
6. Replaces the live running container with the new version seamlessly!
