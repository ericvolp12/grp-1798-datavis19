# Builder stage to compile the executable
FROM golang:alpine as builder

RUN mkdir /build 

ADD . /build/
WORKDIR /build 

# Fetch the dependencies
RUN go get github.com/zmb3/spotify

# Build the binary
RUN go build -o main .

# Execution stage
FROM alpine

# Create a non-root user for the application
RUN adduser -S -D -H -h /app appuser

USER appuser

# Copy the executable into the execution container
COPY --from=builder /build/main /app/

WORKDIR /app

# Run the executable
CMD ["./main"]