# Stage 1: Build the Spring Boot application
FROM maven:3.9-eclipse-temurin-22 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:22-jre
WORKDIR /app

# Copy built artifact from builder
COPY --from=builder /app/target/*.jar app.jar

# Render assigns port dynamically via $PORT
ENV PORT=8080
ENV JAVA_OPTS="-Xmx320m -Xms128m -XX:+UseSerialGC -Xss512k"
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
