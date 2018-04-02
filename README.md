# hubot-terraform

[![Hubot Terraform](https://api.travis-ci.org/gregoryguillou/hubot-terraform.svg?branch=master)](https://travis-ci.org/gregoryguillou/hubot-terraform/branches)
[![Package quality](http://packagequality.com/badge/hubot-terraform.png)](http://packagequality.com/#?package=hubot-terraform)

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
[
  "hubot-terraform"
]
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
hubot> The list of command you can use is *apply*, *check*, *clean*,
       *destroy*, *branches*, *help*, *quickcheck*, *show* or *tags*
```

## Repositories:

You can access `hubot-terraform` from:

- [NPM](https://www.npmjs.com/package/hubot-terraform)
- [Github](https://github.com/gregoryguillou/hubot-terraform)
