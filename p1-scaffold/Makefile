NS = grp-1798
VERSION = latest

IMAGE_NAME = datavis-p1
CONTAINER_NAME = datavis-p1

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

MOUNTS = -v $(ROOT_DIR)/app:/usr/src/app/app -v $(ROOT_DIR)/src:/usr/src/app/src

PORTS = -p 9966:9966

.PHONY: build run stop delete again test

build: Dockerfile
	docker build -t $(NS)/$(IMAGE_NAME):$(VERSION) -f Dockerfile .

run:
	docker stop $(CONTAINER_NAME) || true && docker rm $(CONTAINER_NAME) || true
	docker run -d --name $(CONTAINER_NAME) $(MOUNTS) $(PORTS) $(NS)/$(IMAGE_NAME):$(VERSION)

stop:
	docker stop $(CONTAINER_NAME)

delete:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

test:
	docker stop $(CONTAINER_NAME)-test || true && docker rm $(CONTAINER_NAME)-test || true
	docker build -t $(NS)/$(IMAGE_NAME)-test:$(VERSION) -f test.Dockerfile .
	docker run --name $(CONTAINER_NAME)-test $(NS)/$(IMAGE_NAME)-test:$(VERSION)

again: Dockerfile
	docker build -t $(NS)/$(IMAGE_NAME):$(VERSION) -f Dockerfile .
	docker stop $(CONTAINER_NAME) || true && docker rm $(CONTAINER_NAME) || true
	docker run -d --name $(CONTAINER_NAME) $(MOUNTS) $(PORTS) $(NS)/$(IMAGE_NAME):$(VERSION)

default: build

