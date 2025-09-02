# ---------- Build Stage ----------
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the JAR
RUN ./mvnw clean package -DskipTests

# ---------- Run Stage ----------
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy only the final JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
