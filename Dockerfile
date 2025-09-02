# Use Java 17 JDK
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

#  Fix permissions for mvnw
RUN chmod +x mvnw

# Download dependencies (better caching)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the Spring Boot JAR
RUN ./mvnw clean package -DskipTests

# Final stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
