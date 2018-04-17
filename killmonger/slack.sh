#!/usr/bin/env bash

cp ../src/terraform.js scripts/terraform.js
. .env

./bin/hubot --adapter slack
