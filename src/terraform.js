'use strict'

module.exports = (robot) => {
  robot.respond(/terraform\shelp/i, (message) => {
    message.reply('Welcome to Hubot scripts for Terraform. It is not working yet!')
  })
}
