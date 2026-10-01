# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final minimal image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Expose the application port
EXPOSE 8080
# Copy the built jar from the build stage
COPY --from=build /app/target/scheduling-0.0.1-SNAPSHOT.jar app.jar
# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
