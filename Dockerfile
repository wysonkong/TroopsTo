# BUILD STAGE
FROM gradle:8.6-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# RUN STAGE
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
