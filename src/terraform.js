'use strict'

// Description
//   A hubot script that interact with the Terraform API
//
// Configuration:
//  TERRAFORM_API__PROJECT is the terraform-api project used
//  TERRAFORM_API__WORKSPACE is the terraform-api workspace used
//  TERRAFORM_API__ENDPOINT_URL is terraform-api URL
//  TERRAFORM_API__APIKEY is terraform-api API Key used to connect
//
// Commands:
//   hubot terraform <command> executes a terraform command via Hubot
//   hubot terraform help shows the help for all terraform commands
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Gregory Guillou <gregory.guillou@resetlogs.com>

const request = require('request')
const PROJECT = process.env.TERRAFORM_API__PROJECT || 'demonstration'
const WORKSPACE = process.env.TERRAFORM_API__WORKSPACE || 'staging'
const ENDPOINT = process.env.TERRAFORM_API__ENDPOINT_URL || 'http://localhost:10010'
const APIKEY = process.env.TERRAFORM_API__APIKEY || 'notsosecretadminkey'

const reply = (message) => {
  const sentence = Math.floor(Math.random() * 15)
  const formula = [
    `Hi, so glad you need me...`,
    `Hey, where have you been?`,
    `Hello, sunshine! type one of`,
    `Howdy, partner!`,
    `Hey, howdy, hi! try`,
    `What’s kickin’, little chicken?`,
    `Peek-a-boo! Yoo-hu`,
    `Howdy-doody!`,
    `Hey there, freshman!`,
    `My name's Terraform-Bot, and I'm a bad guy.`,
    `Hi, mister! try`,
    `I come in peace!`,
    `Put that cookie down!`,
    `Ahoy, matey! the words you are looking for are`,
    `Hiya!`
  ]
  message.reply(formula[sentence])
}

const authenticate = (message, callback) => {
  const options = {
    url: `${ENDPOINT}/login`,
    headers: {Authorization: `Key ${APIKEY}`}
  }
  request.get(options, (err, data) => {
    if (err) {
      message.reply(`Error connecting to the API:\n${err.text}`)
      callback(err, null)
    } else {
      const token = JSON.parse(data.body).token
      callback(null, {token})
    }
  })
}

const get = (url, message, callback) => {
  authenticate(message, (err, data) => {
    if (err) { throw err }
    const options = {
      url: `${ENDPOINT}${url}`,
      headers: {Authorization: `Bearer ${data.token}`}
    }
    request.get(options, (err, data) => {
      if (err) {
        message.reply(`Error connecting to the API:\n${err.text}`)
        callback(err, null)
      } else {
        callback(null, JSON.parse(data.body))
      }
    })
  })
}

function queryWorkspace (i, token, message, callback) {
  setTimeout(function () {
    const options = {
      url: `${ENDPOINT}/projects/${PROJECT}/workspaces/${WORKSPACE}`,
      headers: {Authorization: `Bearer ${token}`}
    }
    const j = i + 1
    request.get(options, (err, data) => {
      const payload = JSON.parse(data.body)
      if (err) {
        message.reply(`Error connecting to the API:\n${err.text}`)
        callback(err, null)
        return
      }
      if (payload.request) {
        if (j < 100) {
          return queryWorkspace(j, token, message, callback)
        }
        message.reply(`The change is still not over. the state is **${JSON.stringify(payload)}**\n`)
        callback(err, null)
        return
      }
      message.reply(
        'The change has been done. the state is now:\n'
          .concat(`\`\`\`\n`)
          .concat(`project:   ${payload.project}\n`)
          .concat(`workspace: ${payload.workspace}\n`)
          .concat(`ref:       ${payload.ref}\n`)
          .concat(`state:     ${payload.state}\n`)
          .concat(`\`\`\``)
      )
      callback(null, JSON.parse(data.body))
    })
  }, 1000)
}

const post = (url, payload, message, callback) => {
  authenticate(message, (err, token) => {
    if (err) { throw err }
    const options = {
      url: `${ENDPOINT}${url}`,
      headers: {Authorization: `Bearer ${token.token}`},
      json: payload
    }
    request.post(options, (err, response, data) => {
      if (err) {
        message.reply(`Error connecting to the API:\n${err.text}`)
        callback(err, null)
        return
      }
      callback(null, response, data)
      queryWorkspace(0, token.token, message, () => {
      })
    })
  })
}

const apply = (message) => {
  post(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, {action: 'apply'}, message, (err, response, data) => {
    if (err) { throw err }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message.reply(`I've submitted your request and I got: ${respMessage}\n`)
  })
}

const destroy = (message) => {
  post(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, {action: 'destroy'}, message, (err, response, data) => {
    if (err) { throw err }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message.reply(`I've submitted your request and I got: ${respMessage}\n`)
  })
}

const clean = (message) => {
  post(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, {action: 'clean'}, message, (err, response, data) => {
    if (err) { throw err }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message.reply(`I've submitted your request and I got: ${respMessage}\n`)
  })
}

const check = (message) => {
  post(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, {action: 'check'}, message, (err, response, data) => {
    if (err) { throw err }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message.reply(`I've submitted your request and I got: ${respMessage}\n`)
  })
}

const show = (message) => {
  get(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, message, (err, data) => {
    if (err) {
      message.reply(`Error detected:\n${err.text}`)
      return
    }
    message.reply(
      'You are working on:\n'
        .concat(`\`\`\`\n`)
        .concat(`project:   ${data.project}\n`)
        .concat(`workspace: ${data.workspace}\n`)
        .concat(`ref:       ${data.ref}\n`)
        .concat(`state:     ${data.state}\n`)
        .concat(`\`\`\``)
    )
  })
}

const helpList = [
  { key: 'apply',
    description: 'creates or updates the current project/workspace' },
  { key: 'appversion',
    description: 'Performs a check of the workspace deployment and returns the application version' },
  { key: 'branch',
    description: 'Set the <branch> given as a parameter on the current project/workspace' },
  { key: 'branches',
    description: 'lists the branches associated with the current project' },
  { key: 'check',
    description: 'checks the full status of the current project/workspace' },
  { key: 'clean',
    description: 'cleans the status of the when needed project/workspace' },
  { key: 'destroy',
    description: 'destroys the current project/workspace' },
  { key: 'help',
    description: 'lists the available commands; use *help command* to get help for a specific command' },
  { key: 'hi',
    description: 'says hi to your bot' },
  { key: 'logs',
    description: 'displays logs from the last terraform command' },
  { key: 'quickcheck',
    description: 'Performs a quickcheck of the workspace deployment and returns its status' },
  { key: 'show',
    description: 'provides some details about the workspace currently managed' },
  { key: 'tag',
    description: 'Set the <tag> given as a parameter on the current project/workspace' },
  { key: 'tags',
    description: 'lists the tags associated with the current project' }]

const help = (message) => {
  var helpString = ''
  for (var i = 0, size = helpList.length; i < size; i++) {
    if (i === 0) {
      helpString = `*${helpList[i].key}*`
    } else if (i < size - 1) {
      helpString = `${helpString}, *${helpList[i].key}*`
    } else {
      helpString = `${helpString} or *${helpList[i].key}*`
    }
  }
  message.reply(`The list of command you can use is ${helpString}`)
}

const helpdetail = (detail, message) => {
  if (detail) {
    message.reply(`*${detail.key}*: ${detail.description}`)
    return
  }
  help(message)
}

const ref = (message, type, name) => {
  post(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, {action: 'apply', ref: `${type}:${name}`}, message, (err, response, data) => {
    if (err) { throw err }
    let respMessage = `request succeeded, ${type} is now: ${name} :heart_eyes:`
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message.reply(`I've submitted your request and I got: ${respMessage}\n`)
  })
}

const tag = (message, name) => {
  ref(message, 'tag', name)
}

const branch = (message, name) => {
  ref(message, 'branch', name)
}

const tags = (message) => {
  get(`/projects/${PROJECT}/tags`, message, (err, data) => {
    if (err) {
      message.reply(`Error detected:\n${err.text}`)
      return
    }
    let tagList = ''
    data.tags.forEach(element => {
      tagList = `${tagList}- ${element.name}\n`
    })
    message.reply(
      `*tags* for project *${PROJECT}* are:\n`
        .concat(`\`\`\`\n`)
        .concat(`${tagList}`)
        .concat(`\`\`\``)
    )
  })
}

const branches = (message) => {
  get(`/projects/${PROJECT}/branches`, message, (err, data) => {
    if (err) {
      message.reply(`Error detected:\n${err.text}`)
      return
    }
    let branchesList = ''
    data.branches.forEach(element => {
      branchesList = `${branchesList}- ${element.name}\n`
    })
    message.reply(
      `*branches* for project *${PROJECT}* are:\n`
        .concat(`\`\`\`\n`)
        .concat(`${branchesList}`)
        .concat(`\`\`\``)
    )
  })
}

const quickcheck = (message) => {
  get(`/projects/${PROJECT}/workspaces/${WORKSPACE}/status`, message, (err, data) => {
    if (err) {
      message.reply(`Error detected:\n${err.text}`)
      return
    }
    const statusMessage = (data.quickCheck === 'failure' ? '*failed* :skull_and_crossbones:' : '*passed* :heart_eyes:')
    message.reply(
      `I've checked *${PROJECT}*/*${WORKSPACE}* and quickcheck has returned ${statusMessage}\n`
    )
  })
}

const logs = (robot, message) => {
  get(`/projects/${PROJECT}/workspaces/${WORKSPACE}`, message, (err, data) => {
    if (err) {
      return message.reply(`Error detected:\n${err.text}`)
    }
    get(`/events/${data.lastEvents[0]}/logs`, message, (err, logs) => {
      if (err) {
        return message.reply(`Error detected: ${err.text}`)
      }
      if (robot.adapter.client && robot.adapter.client.web && robot.adapter.client.web.files) {
        console.log('Send file to the logs')
        console.log(JSON.stringify(logs.logs))
        return robot.adapter.client.web.chat.postMessage(
          message.message.room,
          'This is a message!',
          {
            as_user: true,
            unfurl_links: false,
            attachments: [{
              fallback: 'Required plain-text summary of the attachment.',
              color: '#36a64f',
              author_name: 'Bobby Tables',
              author_link: 'http://flickr.com/bobby/',
              author_icon: 'http://flickr.com/icons/bobby.jpg',
              title: 'Slack API Documentation',
              title_link: 'https://api.slack.com/',
              text: 'Optional text that appears within the attachment',
              fields: [{
                title: 'Priority',
                value: 'High',
                short: false
              }],
              image_url: 'http://my-website.com/path/to/image.jpg',
              thumb_url: 'http://example.com/path/to/thumb.png',
              footer: 'Slack API',
              footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
              ts: 123456789
            }]
          }
        )
      }
      message.reply(logs.logs[0].text)
    })
  })
}

const appversion = (message) => {
  get(`/projects/${PROJECT}/workspaces/${WORKSPACE}/version`, message, (err, data) => {
    if (err) {
      message.reply(`Error detected:\n${err.text}`)
      return
    }
    const statusMessage = (data.appVersion === 'undefined' ? '*failed* :skull_and_crossbones:' : `*${data.appVersion}* :heart_eyes:`)
    message.reply(
      `I've checked *${PROJECT}*/*${WORKSPACE}* and the application version is ${statusMessage}\n`
    )
  })
}

module.exports = (robot) => {
  robot.respond(/terraform apply/i, (message) => {
    apply(message)
  })

  robot.respond(/terraform appversion/i, (message) => {
    appversion(message)
  })

  robot.respond(/terraform branch (.*)/i, (message) => {
    const command = message.match[1].replace(/\s+$/g, '').replace(/^\s+/g, '')
    branch(message, command)
  })

  robot.respond(/terraform branches/i, (message) => {
    branches(message)
  })

  robot.respond(/terraform check/i, (message) => {
    check(message)
  })

  robot.respond(/terraform clean/i, (message) => {
    clean(message)
  })

  robot.respond(/terraform destroy/i, (message) => {
    destroy(message)
  })

  robot.respond(/terraform help(.*)/i, (message) => {
    const command = message.match[1]
    if (command) {
      const detail = helpList.find(p => p.key === command.toLowerCase().replace(/\s+$/g, '').replace(/^\s+/g, ''))
      return helpdetail(detail, message)
    }
    help(message)
  })

  robot.respond(/terraform hi/i, (message) => {
    reply(message)
  })

  robot.respond(/terraform log/i, (message) => {
    logs(robot, message)
  })

  robot.respond(/terraform quickcheck/i, (message) => {
    quickcheck(message)
  })

  robot.respond(/terraform show/i, (message) => {
    show(message)
  })

  robot.respond(/terraform tag (.*)/i, (message) => {
    const command = message.match[1].replace(/\s+$/g, '').replace(/^\s+/g, '')
    tag(message, command)
  })

  robot.respond(/terraform tags/i, (message) => {
    tags(message)
  })
}
