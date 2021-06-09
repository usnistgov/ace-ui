# import config.
export APP_NAME=datamachines/ace-ui:demo
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
python-start: ## start local python server
	python run.py
pip-install: ## install requirements.txt
	pip install -r requirements.txt

# DOCKER TASKS
# Build the container
docker-build: ## Build the container
	docker build -t $(APP_NAME) .

docker-build-nc: ## Build the container without any cache
	docker build --no-cache -t $(APP_NAME) .

docker-run: ## Run container
	docker run -i -t --rm -p=$(PORT):$(PORT) --name="$(APP_NAME)" $(APP_NAME)

docker-up: build run ## Build and run this project in a container

docker-stop: ## Stop and remove container running this project
	docker stop $(APP_NAME); docker rm $(APP_NAME)

start-ace: ## start ace stack using docker-compose
	docker-compose up -f ./docker-compose.yml



