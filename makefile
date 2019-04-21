run-compose-ui:
	docker run --rm \
		--name docker-compose-ui \
    	-w `pwd` \
		-p 1111:5000 \
		-v `pwd`:`pwd` \
		-v /var/run/docker.sock:/var/run/docker.sock \
		francescou/docker-compose-ui:1.13.0

run-pgdb:
	docker run --rm -p 5433:5432 \
	--name pgcontainer \
	-v pgdata:/var/lib/postgresql/data \
	-e POSTGRES_USER=user \
	-e POSTGRES_PASSWORD=password \
	-e POSTGRES_DB=mydb \
	postgres:9.6-alpine

run-pgadmin:
	docker run --rm \
	-p 5555:80 \
	--name pgadmin \
	-e PGADMIN_DEFAULT_EMAIL="email" \
	-e PGADMIN_DEFAULT_PASSWORD="password" \
	dpage/pgadmin4

run-backend:
	docker run --rm -it \
	-v `pwd`/fluz-project/backend:/home \
	-p 3000:3000 \
	fluz-backend

run-compose:
	docker-compose up --build