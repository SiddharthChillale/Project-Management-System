#!/bin/bash

docker compose -f compose.yml -f compose.dev.yml -f compose.nginx.yml up --watch
