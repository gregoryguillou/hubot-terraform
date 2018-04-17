# hubot-terraform

[![Hubot Terraform](https://api.travis-ci.org/gregoryguillou/hubot-terraform.svg?branch=master)](https://travis-ci.org/gregoryguillou/hubot-terraform/branches)
[![Package Quality](http://npm.packagequality.com/shield/hubot-terraform.svg)](http://packagequality.com/#?package=hubot-terraform)

A hubot script to interact with the Terraform API and allows to run terraform
projects/workspace from hubot. Refer to
[`terraform-api`](https://github.com/gregoryguillou/terraform-api) if you want
to know more about the API.

See [`src/terraform.js`](src/terraform.js) for full documentation.

## Installation

In hubot project repository, run:

`npm install hubot-terraform --save`

Then add **hubot-terraform** to your `external-scripts.json`:

```json
[ "hubot-terraform" ]
```

## Configuring

`hubot-terraform` is configured with 4 environment variables:

- `TERRAFORM_API__PROJECT` is the `terraform-api` project used
- `TERRAFORM_API__WORKSPACE` is the `terraform-api` workspace used
- `TERRAFORM_API__ENDPOINT_URL` is `terraform-api` URL
- `TERRAFORM_API__APIKEY` is `terraform-api` API Key used to connect

## How to use the script

In order to trigger the script, you shoud run `terraform <VERB>` like
below:

```
hubot> terraform help
hubot> The list of commands you can use is *apply*, *appversion*,
  *branch*, *branches*, *check*, *clean*, *destroy*, *help*, *hi*,
  *logs*, *quickcheck*, *show*, *tag*, *tags* or *version*
```

## Repositories:

You can access `hubot-terraform` from:

- [NPM](https://www.npmjs.com/package/hubot-terraform)
- [Github](https://github.com/gregoryguillou/hubot-terraform)


## A simple way to test `Hubot-Terraform` from the Shell

If you have cloned the git repository, you can easily test hubot in
shell/interactive mode. In order to do it, run the `docker-compose.yml`
to start a sample terraform API and run the `killmonger` script:

```shell
cd terraform-api
docker-compose up -d

cd ../killmonger
bin/killmonger
```

You should be able to interact with a simple command like below:

```text
killmonger> killmonger terraform help
killmonger> Shell: The list of command you can use is *apply*, 
  *appversion*, *branch*, *branches*, *check*, *clean*, *destroy*,
  *help*, *hi*, *logs*, *quickcheck*, *show*, *tag*, *tags* or 
  *version*

killmonger> 
```

## A simple way to test `Hubot-Terraform` from Slack

If you have cloned the git repository, you can easily test hubot with
Slack. In order to do it, make sure you've created a Hubot application
from [Hubot Slack](https://resetlogs.slack.com/apps/A0F7XDU93-hubot),
note the Hubot Slack Token that starts by `xoxb-`; add it to the .env
file in the killmonger directory and run the `docker-compose.yml`
to start a sample terraform API. To start your bot, run the `slack.sh`
script:

```shell
cd terraform-api
docker-compose up -d

cd ../killmonger

# Change the token to match your
echo "export HUBOT_SLACK_TOKEN=xoxb-000000000000-xxxxxxxxxxxxxxxxxxxxxxxxx" >.env

./slack.sh
```

You should be able to interact with you bot in Slack.
