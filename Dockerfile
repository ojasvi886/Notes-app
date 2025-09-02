# Use Java 17 JDK
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (better caching)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the Spring Boot JAR
RUN ./mvnw clean package -DskipTests

# Copy the final JAR
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
