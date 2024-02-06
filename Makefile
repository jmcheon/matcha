PS_LIST := $(shell docker ps -a -q)
IMAGE_LIST := $(shell docker image ls)
NETWORK_LIST := $(shell docker volume ls)
VOLUME_LIST := $(shell docker network ls)


$COMPOSE_DOWN=down
$COMPOSE_STOP=stop
$COMPOSE_RESTART=restart

all :
	docker-compose up --build

fclean :
	docker-compose down
	docker container prune --force 
	docker image prune --force --all
	docker network prune --force 
	docker volume prune --force 

re : fclean all

SERVICES := back front db

define run-command
    @if [ "$$(echo $(MAKECMDGOALS) | wc -w)" -eq 1 ]; then \
        echo $(MAKECMDGOALS); \
        docker-compose $(1); \
    else \
        for service in $(SERVICES); do \
            if echo "$(MAKECMDGOALS)" | grep -q $$service ; then \
                docker-compose $(1) $$service; \
            fi; \
        done; \
    fi
endef

down stop restart:
	$(call run-command,$@)

.PHONY: all fclean re front back db down stop restart 
