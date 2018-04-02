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

const request = require('request')
const PROJECT = process.env.TERRAFORM_API__PROJECT || 'demonstration'
const WORKSPACE = process.env.TERRAFORM_API__WORKSPACE || 'staging'
const ENDPOINT = process.env.TERRAFORM_API__ENDPOINT_URL || 'http://localhost:10010'
const APIKEY = process.env.TERRAFORM_API__APIKEY || 'welcome'

const quickcheck = (props, message, callback) => {
  get(props, `/projects/${props.project}/workspaces/${props.workspace}/status`, (err, data) => {
    if (err) {
      message(
        props,
        'Error detected:\n'
          .concat(err.text)
      )
      return
    }
    const statusMessage = (data.quickCheck === 'failure' ? '*failed* :skull_and_crossbones:' : '*passed* :heart_eyes:')
    message(
      props,
      `I've checked *${props.project}*/*${props.workspace}* and quickcheck has returned ${statusMessage}\n`)
  })
}

const check = (props, message, callback) => {
  post(props, `/projects/${props.project}/workspaces/${props.workspace}`, {action: 'check'}, (err, response, data) => {
    if (err) {
      message(
        props,
        'Error detected:\n'
          .concat(err.text)
      )
      return
    }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message(
      props,
      `I've submitted your request and I got: ${respMessage}\n`)
  })
}

const clean = (props, message, callback) => {
  post(props, `/projects/${props.project}/workspaces/${props.workspace}`, {action: 'clean'}, (err, response, data) => {
    if (err) {
      message(
        props,
        'Error detected:\n'
          .concat(err.text)
      )
      return
    }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message(
      props,
      `I've submitted your request and I got: ${respMessage}\n`)
  })
}

const destroy = (props, message, callback) => {
  post(props, `/projects/${props.project}/workspaces/${props.workspace}`, {action: 'destroy'}, (err, response, data) => {
    if (err) {
      message(
        props,
        'Error detected:\n'
          .concat(err.text)
      )
      return
    }
    let respMessage = 'request succeeded :heart_eyes:'
    if (response.statusCode === 209) {
      respMessage = 'change pending, please wait :sweat_smile:'
    } else if (response.statusCode !== 201) {
      respMessage = 'ough, it has failed :skull_and_crossbones:'
    }
    message(
      props,
      `I've submitted your request and I got: ${respMessage}\n`)
  })
}

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
      queryWorkspace(0, token.token, message, () => {
        callback(null, response, data)
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
  { key: 'check',
    description: 'checks the full status of the current project/workspace' },
  { key: 'clean',
    description: 'cleans the status of the when needed project/workspace' },
  { key: 'destroy',
    description: 'destroys the current project/workspace' },
  { key: 'branches',
    description: 'lists the branches associated with the current project' },
  { key: 'help',
    description: 'lists the available commands; use *help command* to get help for a specific command' },
  { key: 'quickcheck',
    description: 'Performs a quickcheck of the workspace deployment and returns its status' },
  { key: 'show',
    description: 'provides some details about the workspace currently managed' },
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

module.exports = (robot) => {
  robot.respond(/terraform\shelp/, (message) => {
    help(message)
  })

  robot.respond(/terraform\sapply/, (message) => {
    apply(message)
  })

  robot.respond(/terraform\shi/, (message) => {
    reply(message)
  })

  robot.respond(/terraform\sshow/, (message) => {
    show(message)
  })

  robot.respond(/terraform\stags/, (message) => {
    tags(message)
  })

  robot.respond(/terraform\sbranches/, (message) => {
    branches(message)
  })
}
