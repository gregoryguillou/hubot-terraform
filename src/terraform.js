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

function queryWorkspace (i, props, message, callback) {
  setTimeout(function () {
    const options = {
      url: `${props.apiurl}/projects/${props.project}/workspaces/${props.workspace}`,
      headers: {Authorization: `Bearer ${props.token}`}
    }
    const j = i + 1
    request.get(options, (err, data) => {
      const payload = JSON.parse(data.body)
      if (err) {
        message(props, `Error connecting to the API:\n${err.text}`)
        if (callback) { return callback(err, null) }
        return
      }
      if (payload.request) {
        if (j < 100) {
          return queryWorkspace(j, props, callback)
        }
        message(props, `The change is still not over. the state is **${JSON.stringify(payload)}**\n`)
        if (callback) { return callback(err, null) }
        return
      }
      message(
        props,
        'The change has been done. the state is now:\n'
          .concat(`\`\`\``)
          .concat(`project:   ${payload.project}\n`)
          .concat(`workspace: ${payload.workspace}\n`)
          .concat(`ref:       ${payload.ref}\n`)
          .concat(`state:     ${payload.state}\n`)
          .concat(`\`\`\``)
      )
      if (callback) { return callback(err, null) }
    })
  }, 1000)
}

const post = (props, url, payload, message, callback) => {
  authenticate(props, (err, data) => {
    if (err) { throw err }
    const options = {
      url: `${props.apiurl}${url}`,
      headers: {Authorization: `Bearer ${data.token}`},
      json: payload
    }
    let identifiedProps = props
    identifiedProps.token = data.token
    request.post(options, (err, response, data) => {
      if (err) {
        message(props, `Error connecting to the API:\n${err.text}`)
        if (callback) { callback(err, null, null) }
      } else {
        queryWorkspace(0, props, () => {
          quickcheck(props, () => {
          })
        })
        if (callback) { callback(null, response, null) }
      }
    })
  })
}

const tags = (props, message, callback) => {
  get(props, `/projects/${props.project}/tags`, (err, data) => {
    if (err) {
      message(
        props,
        'Error detected:\n'
          .concat(err.text)
      )
      return
    }
    let tagList = ''
    data.tags.forEach(element => {
      tagList = `${tagList}- ${element.name}\n`
    })
    message(
      props,
      `*tags* for project *${props.project}* are:\n`
        .concat(`\`\`\``)
        .concat(`${tagList}`)
        .concat(`\`\`\``)
    )
  })
}

const branches = (props, message, callback) => {
  get(props, `/projects/${props.project}/branches`, (err, data) => {
    if (err) {
      message(
        props,
        'Error detected:\n'
          .concat(err.text)
      )
      return
    }
    let branchesList = ''
    data.branches.forEach(element => {
      branchesList = `${branchesList}- ${element.name}\n`
    })
    message(
      props,
      `*tags* for project *${props.project}* are:\n`
        .concat(`\`\`\``)
        .concat(`${branchesList}`)
        .concat(`\`\`\``)
    )
  })
}

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

const apply = (props, message, callback) => {
  post(props, `/projects/${props.project}/workspaces/${props.workspace}`, {action: 'apply'}, (err, response, data) => {
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

const response = (props, message, msg) => {
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

  const verb = msg[0]
  let parameter = msg[1]

  if (verb === 'show') {
    return show(props, null)
  }
  if (verb === 'tags') {
    return tags(props, null)
  }

  if (verb === 'quickcheck') {
    return quickcheck(props, null)
  }

  if (verb === 'branches') {
    return branches(props, null)
  }

  if (verb === 'help') {
    if (parameter) {
      const help = helpList.find(p => p.key === parameter)
      if (help) {
        return message(props, `*${help.key}* ${help.description}`)
      }
      return message(props, `Command ${parameter} not found, type ${helpString}`)
    }
    return message(props, `The list of command you can use is ${helpString}`)
  }

  if (verb === 'apply') {
    return apply(props, null)
  }

  if (verb === 'check') {
    return check(props, null)
  }

  if (verb === 'clean') {
    return clean(props, null)
  }

  if (verb === 'destroy') {
    return destroy(props, null)
  }

  const sentence = Math.floor(Math.random() * 15)
  const formula = [
    `Hi, so glad you need me...`,
    `Hey, where have you been?`,
    `Hello, sunshine! type one of ${helpString}`,
    `Howdy, partner!`,
    `Hey, howdy, hi! try ${helpString}`,
    `What’s kickin’, little chicken?`,
    `Peek-a-boo! Yoo-hu`,
    `Howdy-doody!`,
    `Hey there, freshman!`,
    `My name's Terraform-Bot, and I'm a bad guy.`,
    `Hi, mister! try ${helpString}`,
    `I come in peace!`,
    `Put that cookie down!`,
    `Ahoy, matey! the words you are looking for are ${helpString}`,
    `Hiya!`
  ]
  message(formula[sentence])
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

module.exports = {
  response: response
}

module.exports = (robot) => {
  robot.respond(/terraform\shelp/, (message) => {
    message.reply('Hello! Terraform API scripts are not implemented yet, be patient...')
  })

  robot.respond(/terraform\shi/, (message) => {
    reply(message)
  })

  robot.respond(/terraform\sshow/, (message) => {
    show(message)
  })
}
