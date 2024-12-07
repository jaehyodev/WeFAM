# JDK 이미지를 통한 executable jar 빌드
FROM eclipse-temurin:17-alpine AS build
RUN apk add --no-cache bash

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
# COPY build.gradle.kts settings.gradle.kts ./    Kotlin인 경우 .kts 확장자 적용

RUN ./gradlew dependencies --no-daemon

COPY . .

RUN chmod +x ./gradlew

RUN ./gradlew bootJar --no-daemon

# jar 실행을 위한 JRE 이미지 적용
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -g 1000 worker && \
    adduser -u 1000 -G worker -s /bin/sh -D worker

COPY --from=build --chown=worker:worker /app/build/libs/*.jar ./main.jar

USER worker:worker

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "main.jar"]
