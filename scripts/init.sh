#!/usr/bin/env bash
echo -n "Initializing database..."
psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB?sslmode=disable" <<-EOSQL

CREATE USER bac with password 'password';
GRANT CONNECT ON DATABASE bac TO bac;
GRANT pg_read_all_data TO bac;
GRANT pg_write_all_data TO bac;

CREATE TABLE profiles (
  "id" SERIAL PRIMARY KEY,
  "description" varchar(255),
  "api_key" varchar(200)
);

CREATE TABLE users (
  "id" SERIAL PRIMARY KEY,
  "username" varchar(255) NOT NULL UNIQUE,
  "created_at" timestamp not null default CURRENT_TIMESTAMP,
  "profile_id" int NOT NULL,
  "password" varchar(128) NOT NULL,
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE
);

EOSQL