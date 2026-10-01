# Week 11: Docker Image and Container Lifecycle

## Overview
This week focuses on containerizing our Spring Boot application using Docker. Containerization ensures that the application runs identically across different environments (development, testing, and production) by bundling the application, runtime, and dependencies into a single immutable artifact.

## 1. Creating the Dockerfile
We created a multi-stage `Dockerfile` in the root of the repository:
- **Stage 1 (Build)**: Uses a JDK 17 base image with Maven to compile the application and build the final JAR file. This ensures that the build environment is consistent.
- **Stage 2 (Runtime)**: Uses a lighter JRE 17 base image to run the JAR file. This minimizes the size of the final Docker image by excluding the Maven build tools.

## 2. Creating `.dockerignore`
We added a `.dockerignore` file to prevent unnecessary files (e.g., local IDE settings, `.git/`, and local build output `target/`) from being sent to the Docker daemon, improving build performance and security.

## 3. Building the Docker Image
To build the Docker image, ensure Docker Desktop is running and execute:
```bash
docker build -t workforce-scheduling:latest .
```
This builds the image and tags it as `workforce-scheduling:latest`.

## 4. Running the Container
To run the container locally and test the application:
```bash
docker run -d -p 8080:8080 --name shift-scheduler workforce-scheduling:latest
```
This maps port 8080 on your host machine to port 8080 inside the container. You can then access the application at `http://localhost:8080`.

## 5. Lifecycle Management Commands
- **View running containers**: `docker ps`
- **Stop the container**: `docker stop shift-scheduler`
- **Start the container**: `docker start shift-scheduler`
- **Remove the container**: `docker rm shift-scheduler`
- **View logs**: `docker logs shift-scheduler`
