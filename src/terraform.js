'use strict'

// Description
//   A hubot script that interact with the Terraform API
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//
// Commands:
//   hubot hello - <what the respond trigger does>
//   orly - <what the hear trigger does>
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Gregory Guillou <gregory.guillou@resetlogs.com>

module.exports = (robot) => {
  robot.respond(/terraform\shelp/, (message) => {
    message.reply('Hello! Terraform API scripts are not implemented yet, be patient...')
  })
}
