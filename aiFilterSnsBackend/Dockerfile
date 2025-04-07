FROM openjdk:17-jdk-slim AS builder

# create a work dir.
WORKDIR /home/app

COPY . .

RUN ./gradlew clean bootJar --no-daemon


FROM openjdk:17-jdk-slim

# copy a jvm app.
COPY --from=builder /home/app/build/libs/*SNAPSHOT.jar app.jar

# open port 8080 for a jvm app.
EXPOSE 8080

# startup a jvm app.
ENTRYPOINT ["java","-jar","app.jar"]