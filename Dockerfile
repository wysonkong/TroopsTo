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
# BUILD FRONTEND STAGE
FROM node:20 AS frontend-builder
WORKDIR /frontend
RUN corepack enable

# Copy frontend package files
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy frontend source and build
COPY frontend/ ./
RUN yarn build

# BUILD BACKEND STAGE
FROM gradle:8.6-jdk21 AS backend-builder
WORKDIR /app
COPY . .

# Copy the built frontend into Spring Boot's static resources
COPY --from=frontend-builder /frontend/build ./src/main/resources/static

# Build the Spring Boot application
RUN gradle clean build -x test

# RUN STAGE
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=backend-builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]