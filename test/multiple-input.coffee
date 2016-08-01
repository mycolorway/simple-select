DataProvider = require '../src/models/data-provider'
MultipleInput = require '../src/multiple-input'
expect = chai.expect

describe 'Multiple Input', ->

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
    input = new MultipleInput
      el: $el
      dataProvider: dataProvider
      placeholder: 'please select'
      selected: [dataProvider.getItem('3')]

  afterEach ->
    input.el.remove()
    input = null

  it 'should render after initialized', ->
    expect(input.textField.is('textarea')).to.be.true
    expect(input.el.hasClass('multiple')).to.be.true
    expect(input.el.find('.selected-item').length).to.be.equal 1

  it 'should trigger itemClick event when click on selected item', ->
    spy = sinon.spy()
    input.on 'itemClick', spy
    $item = input.el.find('.selected-item:first')
    item = input.selected[0]
    matchItem = sinon.match ($el) ->
      $el.length > 0 && $el[0] == $item[0]

    $item.mousedown()
    expect(spy.calledWith(sinon.match.object, matchItem, item)).to.be.true

  it 'should click on last selected item when backspace is pressed', ->
    spy = sinon.spy()
    input.on 'itemClick', spy

    input.addSelected '1'
    $item = input.el.find('.selected-item:last')
    item = input.selected[1]
    matchItem = sinon.match ($el) ->
      $el.length > 0 && $el[0] == $item[0]

    input.textField.trigger $.Event('keydown', which: 8)
    expect(spy.calledOnce).to.be.true
    expect(spy.calledWith(sinon.match.object, matchItem, item)).to.be.true

  it 'should trigger change event when input changed', (done) ->
    spy = sinon.spy()
    input.on 'change', spy
    expect(input.textField.val()).to.be.equal ''

    input.textField.val 'Ugly Dog'
    input.textField.trigger 'input'
    setTimeout ->
      expect(input.textField.val()).to.be.equal 'Ugly Dog'
      expect(spy.calledWith(sinon.match.object, 'Ugly Dog')).to.be.true
      done()
    , input._inputDelay

  it 'should set placeholder if on item is selected', ->
    expect(input.textField.attr('placeholder')).to.be.not.ok
    input.removeSelected '3'
    expect(input.textField.attr('placeholder'))
      .to.be.equal input.opts.placeholder

  it 'can add selected item', ->
    spy = sinon.spy()
    input.on 'change', spy
    input.textField.val 'cat'

    input.addSelected '1'
    expect(input.el.find('.selected-item').length).to.be.equal 2

    $item = input.el.find('.selected-item:last')
    expect($item.is(':contains(Cat)')).to.be.true
    expect($item.attr('data-value')).to.be.equal '1'
    expect($item.data('item')).to.be.equal input.selected[1]
    expect(input.textField.val()).to.be.equal ''
    expect(spy.calledWith(sinon.match.object, '')).to.be.true

  it 'can remove selected item', ->
    spy = sinon.spy()
    input.on 'change', spy
    input.textField.val 'cat'

    input.removeSelected '3'
    expect(input.el.find('.selected-item').length).to.be.equal 0
    expect(input.textField.val()).to.be.equal ''
    expect(spy.calledWith(sinon.match.object, '')).to.be.true

  it 'can clear all selected items', ->
    spy = sinon.spy()
    input.on 'change', spy
    input.textField.val 'cat'

    input.clear()
    expect(input.el.find('.selected-item').length).to.be.equal 0
    expect(input.textField.val()).to.be.equal ''
    expect(spy.calledWith(sinon.match.object, '')).to.be.true
