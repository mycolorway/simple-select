DataProvider = require '../src/models/data-provider'
Input = require '../src/input'
expect = chai.expect

describe 'Input', ->

  input = null

  beforeEach ->
    dataProvider = new DataProvider
      groups: {
        'Cat Animals': [
          ['Cat', '1']
          ['Tiger', '2']
        ],
        'Dog Animals': [
          ['Dog', '3']
          ['Wolf', '4']
        ]
      }

    $el = $('<div>').appendTo('body')
    input = new Input
      el: $el
      dataProvider: dataProvider
      noWrap: false
      placeholder: 'please select'
      selected: dataProvider.getItem('3')

  afterEach ->
    input.el.remove()
    input = null

  it 'should render after initialized', ->
    expect(input.el.find('.link-clear').length).to.be.equal 1
    expect(input.el.find('.link-expand').length).to.be.equal 1
    expect(input.textField.is('textarea')).to.be.true
    expect(input.textField.attr('placeholder')).to.be.equal 'please select'

    input = new Input
      el: '<div>'
      noWrap: true
    expect(input.textField.is('input:text')).to.be.true

  it 'should trigger expandClick event when mousedown on .link-expand', ->
    spy = sinon.spy()
    input.on 'expandClick', spy
    input.el.find('.link-expand').mousedown()
    expect(spy.calledOnce).to.be.true

  it 'should trigger clearClick event when mousedown on .link-clear', ->
    spy = sinon.spy()
    input.on 'clearClick', spy
    input.el.find('.link-clear').mousedown()
    expect(spy.calledOnce).to.be.true

  it 'should trigger arrowPress event when up/down is pressed', ->
    spy = sinon.spy()
    input.on 'arrowPress', spy
    input.textField.trigger $.Event('keydown', which: 40)
    expect(spy.calledWith(sinon.match.object, 'down')).to.be.true
    input.textField.trigger $.Event('keydown', which: 38)
    expect(spy.calledWith(sinon.match.object, 'up')).to.be.true

  it 'should trigger enterPress event when enter is pressed', ->
    spy = sinon.spy()
    input.on 'enterPress', spy
    input.textField.trigger $.Event('keydown', which: 13)
    expect(spy.calledOnce).to.be.true

  it 'should clear selection when backspace is pressed', ->
    expect(!!input.selected).to.be.true
    input.textField.trigger $.Event('keydown', which: 8)
    expect(!!input.selected).to.be.false
    expect(input.textField.val()).to.be.equal ''

  it 'should blur when esc is pressed', ->
    input.focus()
    expect(input.focused).to.be.true
    input.textField.trigger $.Event('keydown', which: 27)
    expect(input.focused).to.be.false

  it 'should trigger change event when input changed', (done) ->
    spy = sinon.spy()
    input.on 'change', spy
    expect(!!input.selected).to.be.true
    expect(input.textField.val()).to.be.equal 'Dog'

    input.textField.val 'Ugly Dog'
    input.textField.trigger 'input'

    setTimeout ->
      expect(input.selected).to.be.false
      expect(input.textField.val()).to.be.equal 'Ugly Dog'
      expect(spy.calledWith(sinon.match.object, 'Ugly Dog')).to.be.true
      done()
    , input._inputDelay

  it 'should trigger blur event when text field blurs', ->
    spy = sinon.spy()
    input.on 'blur', spy

    input.textField.focus()
    expect(input.focused).to.be.true
    input.textField.blur()
    expect(input.focused).to.be.false
    expect(spy.calledOnce).to.be.true

  it 'should trigger focus event when text field focus', ->
    spy = sinon.spy()
    input.on 'focus', spy

    expect(input.focused).to.be.false
    input.textField.focus()
    expect(input.focused).to.be.true
    expect(spy.calledOnce).to.be.true

  it 'can set value of text field', ->
    spy = sinon.spy()
    input.on 'change', spy

    expect(input.textField.val()).to.be.equal 'Dog'
    expect(!!input.selected).to.be.true
    input.setValue 'Ugly Dog'
    expect(input.textField.val()).to.be.equal 'Ugly Dog'
    expect(!!input.selected).to.be.false
    expect(spy.calledWith(sinon.match.object, 'Ugly Dog')).to.be.true

  it 'can get value of text field', ->
    expect(input.getValue()).to.be.equal 'Dog'

  it 'can set selected item', ->
    input.setSelected false
    expect(input.selected).to.be.false
    expect(input.el.hasClass('selected')).to.be.false

    input.setSelected '4'
    expect(!!input.selected).to.be.true
    expect(input.selected.name).to.be.equal 'Wolf'

  it 'can set disabled', ->
    input.setDisabled true
    expect(input.disabled).to.be.true
    expect(input.el.hasClass('disabled')).to.be.true
    expect(input.textField.prop('disabled')).to.be.true

    input.setDisabled false
    expect(input.disabled).to.be.false
    expect(input.el.hasClass('disabled')).to.be.false
    expect(input.textField.prop('disabled')).to.be.false
