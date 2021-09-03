# import config.
export APP_VERSION=demo
export APP_NAME=datamachines/ace-ui:${APP_VERSION}
export PORT=5000
# You can change the default config with `make cnf="config_special.env" build`


# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help


# PYTHON TASKS

dev: ## install requirements.txt
	pip install -r requirements.txt

# DOCKER TASKS
build: ## Build ace containers
	docker build -t $(APP_NAME) .
	docker build -t video_server:${APP_VERSION} -f contrib/video_server/Dockerfile contrib/video_server
	cd web-app && docker build -t  $(APP_NAME)react .
start: ## start ace stack using docker-compose
	docker-compose --file ./docker-compose.yml up
stop: ## stop ace stack using docker-compose
	docker-compose --file ./docker-compose.yml down




