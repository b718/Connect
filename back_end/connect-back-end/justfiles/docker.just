set-up-postgres:
    @cd "../docker/postgres/" && docker-compose down -v && docker-compose up -d