# syntax = docker/dockerfile:1.2
FROM node:14.16.1-alpine3.11 AS build-app

WORKDIR /build
COPY . .

RUN --mount=type=cache,target=/build/node_modules yarn install --frozen-lockfile --prefer-offline && yarn build

FROM golang:1.16.4-alpine3.13 AS build-fileserver

WORKDIR /build
COPY fileserver .
RUN CGO_ENABLED=0 go build -ldflags '-w -s' -o fileserver .

FROM scratch

COPY --from=build-app /build/dist .
COPY --from=build-fileserver /build/fileserver /fileserver

CMD ["/fileserver", "-listen", "0.0.0.0:80"]
