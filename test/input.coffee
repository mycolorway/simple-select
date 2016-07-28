Item = require '../src/models/item'
Input = require '../src/input'
expect = chai.expect

describe 'Input', ->

  input = null

  beforeEach ->
    $el = $('<div>').appendTo('body')
    input = new Input
      el: $el
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

  it 'will trigger enterPress event when enter is pressed', ->
    spy = sinon.spy()
    input.on 'enterPress', spy
    input.textField.trigger $.Event('keydown', which: 13)
    expect(spy.calledOnce).to.be.true

  it 'will clear selection when backspace is pressed', ->
    expect(!!input.selected).to.be.true
    input.textField.trigger $.Event('keydown', which: 8)
    expect(!!input.selected).to.be.false
    expect(input.getValue()).to.be.equal ''

  it 'will blur when esc is pressed', ->
    input.focus()
    expect(input.focused).to.be.true
    input.textField.trigger $.Event('keydown', which: 27)
    expect(input.focused).to.be.false
