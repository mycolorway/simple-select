Item = require '../src/models/item'
Input = require '../src/input'
expect = chai.expect

describe 'Input', ->

  input = null

  beforeEach ->
    input = new Input
      el: '<div>'
      noWrap: false
      placeholder: 'please select'
      selected: new Item
        name: 'Dog'
        value: '3'

  afterEach ->
    input = null

  it 'will render after initialized', ->
    expect(input.el.find('.link-clear').length).to.be.equal 1
    expect(input.el.find('.link-expand').length).to.be.equal 1
    expect(input.textField.is('textarea')).to.be.true
    expect(input.textField.attr('placeholder')).to.be.equal 'please select'

    input = new Input
      el: '<div>'
      noWrap: true
    expect(input.textField.is('input:text')).to.be.true

  it 'will trigger expandClick event when mousedown on .link-expand', ->
    spy = sinon.spy()
    input.on 'expandClick', spy
    input.el.find('.link-expand').mousedown()
    expect(spy.calledOnce).to.be.true

  it 'will trigger clearClick event when mousedown on .link-clear', ->
    spy = sinon.spy()
    input.on 'clearClick', spy
    input.el.find('.link-clear').mousedown()
    expect(spy.calledOnce).to.be.true

  it 'will trigger arrowPress event when up/down is pressed', ->
    spy = sinon.spy()
    input.on 'arrowPress', spy
    input.textField.trigger $.Event('keydown', which: 40)
    expect(spy.calledWith(sinon.match.object, 'down')).to.be.true
    input.textField.trigger $.Event('keydown', which: 38)
    expect(spy.calledWith(sinon.match.object, 'up')).to.be.true
