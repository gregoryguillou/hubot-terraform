# hubot-terraform

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

- `TERRAFORM_API__PROJECT` is the project to interact with when calling `terraform-api`
- `TERRAFORM_API__WORKSPACE` is the workspace to interact with when calling `terraform-api`
- `TERRAFORM_API__ENDPOINT_URL` is `terraform-api` URL
- `TERRAFORM_API__APIKEY` is `terraform-api` API Key used to connect

## Sample Interaction

```
hubot> terraform help
hubot> The list of command you can use is *apply*, *check*, *clean*, *destroy*, *branches*, *help*, *quickcheck*, *show* or *tags*
```

## Urls:

You can access 

- the [NPM Module here](https://www.npmjs.com/package/hubot-terraform)
- the [Github repository here](https://github.com/gregoryguillou/hubot-terraform)
