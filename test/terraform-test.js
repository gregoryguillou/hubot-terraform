'use strict'

/* global describe, beforeEach, afterEach, it */

const path = require('path')

const chai = require('chai')
const Hubot = require('hubot')

const expect = chai.expect
const Robot = Hubot.Robot
const TextMessage = Hubot.TextMessage

chai.use(require('sinon-chai'))

describe('require("terraform")', () => {
  it('exports a function', () => {
    expect(require('../index')).to.be.a('Function')
  })
})

describe('terraform', function () {
  this.timeout(30000)
  let robot, user

  beforeEach(() => {
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'terraform.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'john',
        real_name: 'John Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('john')
  })

  afterEach(() => {
    robot.shutdown()
  })

  it('responds to hello', (done) => {
    robot.adapter.on('reply', function (envelope, strings) {
      const answer = strings[0]
      expect(answer).to.have.string('*apply*')
      expect(answer).to.have.string('*check*')
      expect(answer).to.have.string('*clean*')
      expect(answer).to.have.string('*destroy*')
      expect(answer).to.have.string('*branches*')
      expect(answer).to.have.string('*help*')
      expect(answer).to.have.string('*quickcheck*')
      expect(answer).to.have.string('*show*')
      expect(answer).to.have.string('*tags*')
      done()
    })
    robot.adapter.receive(new TextMessage(user, 'hubot terraform help'))
  })

  it('responds to hi', (done) => {
    robot.adapter.on('reply', function (envelope, strings) {
      done()
    })
    robot.adapter.receive(new TextMessage(user, 'hubot terraform hi'))
  })

  it('responds to show', (done) => {
    robot.adapter.on('reply', function (envelope, strings) {
      const answer = strings[0]
      expect(answer).to.have.string('demonstration')
      expect(answer).to.have.string('staging')
      expect(answer).to.have.string('branch:master')
      done()
    })
    robot.adapter.receive(new TextMessage(user, 'hubot terraform show'))
  })

  it('responds to tags', (done) => {
    robot.adapter.on('reply', function (envelope, strings) {
      const answer = strings[0]
      expect(answer).to.have.string('v0.0.1')
      expect(answer).to.have.string('v0.0.2')
      expect(answer).to.have.string('v0.0.3')
      expect(answer).to.have.string('v0.1.0')
      expect(answer).to.have.string('v0.1.1')
      done()
    })
    robot.adapter.receive(new TextMessage(user, 'hubot terraform tags'))
  })

  it('responds to branches', (done) => {
    robot.adapter.on('reply', function (envelope, strings) {
      const answer = strings[0]
      expect(answer).to.have.string('master')
      done()
    })
    robot.adapter.receive(new TextMessage(user, 'hubot terraform branches'))
  })

  it('responds to apply', (done) => {
    let i = 0
    robot.adapter.on('reply', function (envelope, strings) {
      const answer = strings[0]
      i++
      if (i === 1) {
        expect(answer).to.have.string('applied')
      }
      if (i === 2) {
        expect(answer).to.have.string(':heart_eyes:')
        done()
      }
    })
    robot.adapter.receive(new TextMessage(user, 'hubot terraform apply'))
  })
})
