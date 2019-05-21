# Fluz Docker Compose

## Instructions
- Make sure you've `Docker` and `Docker-compose` installed
- Clone repo `$ git clone https://github.com/vutsalsinghal/fluz-compose.git .`
- Open terminal in the root dir and run `$ docker compose up`

Now to run the app
- Open terminal in root dir with `docker-compose.yml` present.
- Do `docker-compose up` to start the containers.
- Wait till the containers are up and then navigate to `localhost:3000` on the browser to access the React front-end
- User `user1` as username and password to login. 
- To access `pgmyadmin`, navigate to `localhost:5555`. Enter `pgdb_container` for `hostname` of the database. 


## Notes
- Passwords are stored as paintext in the postgres database (NEVER do that in production).
- Very basic auth module is implemented using JWT token stored in `localStorage` of browser. 