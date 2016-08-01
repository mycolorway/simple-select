Group = require '../src/models/group'
DataProvider = require '../src/models/data-provider'
Popover = require '../src/popover'
expect = chai.expect

describe 'Popover', ->

  popover = null

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
    popover = new Popover
      el: $el
      dataProvider: dataProvider
      groups: dataProvider.getGroups()
      onItemRender: ($item, item) ->
        $prefix = $ '<span class="prefix"></span>'
          .text item.value
        $item.prepend $prefix
      locales:
        loading: 'Loading...'
        noResults: 'No results found'

  afterEach ->
    popover.el.remove()
    popover = null

  it 'will render according to groups', ->
    expect(popover.el.find('.select-group').length).to.be.equal 2
    expect(popover.el.find('.select-item').length).to.be.equal 4
    expect(popover.el.find('.select-item .prefix').length).to.be.equal 4

    popover.setGroups []
    expect(popover.el.find('.select-group').length).to.be.equal 0
    expect(popover.el.find('.select-item').length).to.be.equal 0
    expect(popover.el.find('.no-results').length).to.be.equal 1

    group = new Group
      items: [
        ['Dog', '3']
        ['Wolf', '4']
      ]
    popover.setGroups [group]
    expect(popover.el.find('.select-group').length).to.be.equal 0
    expect(popover.el.find('.select-item').length).to.be.equal 2

  it 'should trigger itemClick event when click on item element', ->
    spy = sinon.spy()
    popover.on 'itemClick', spy

    $item = popover.el.find '.select-item:first'
    itemMatch = sinon.match ($el) ->
      $el.length > 0 && $el[0] == $item[0]

    $item.mousedown()
    expect(spy.calledWith(sinon.match.object, itemMatch, $item.data('item')))
      .to.be.true

  it 'can set highlighted item', ->
    popover.setHighlighted '2'
    $item = popover.el.find('.select-item[data-value=2]')
    expect($item.hasClass('highlighted')).to.be.true
    expect($item.siblings('.select-item.highlighted').length).to.be.equal 0
    expect(popover.highlighted).to.be.equal $item.data('item')

    popover.setHighlighted false
    expect(popover.el.find('.select-item.highlighted').length).to.be.equal 0
    expect(popover.highlighted).to.be.false

  it 'can set next item highlighted', ->
    popover.highlightNextItem()
    expect(popover.highlighted).to.be.ok
    expect(popover.highlighted.name).to.be.equal 'Cat'
    $item = popover.el.find(".select-item[data-value=1]")
    expect($item.hasClass 'highlighted').to.be.true
    expect($item.siblings('.select-item.highlighted').length).to.be.equal 0

    popover.highlightNextItem()
    expect(popover.highlighted).to.be.ok
    expect(popover.highlighted.name).to.be.equal 'Tiger'
    $item = popover.el.find(".select-item[data-value=2]")
    expect($item.hasClass 'highlighted').to.be.true
    expect($item.siblings('.select-item.highlighted').length).to.be.equal 0

  it 'can set prev item highlighted', ->
    popover.highlightPrevItem()
    expect(popover.highlighted).to.be.ok
    expect(popover.highlighted.name).to.be.equal 'Cat'
    $item = popover.el.find(".select-item[data-value=1]")
    expect($item.hasClass 'highlighted').to.be.true
    expect($item.siblings('.select-item.highlighted').length).to.be.equal 0

    popover.setHighlighted '4'
    popover.highlightPrevItem()
    expect(popover.highlighted).to.be.ok
    expect(popover.highlighted.name).to.be.equal 'Dog'
    $item = popover.el.find(".select-item[data-value=3]")
    expect($item.hasClass 'highlighted').to.be.true
    expect($item.siblings('.select-item.highlighted').length).to.be.equal 0

  it 'can set loading status', ->
    popover.setLoading true
    expect(popover.loading).to.be.true
    expect(popover.active).to.be.true
    expect(popover.el.hasClass('loading')).to.be.true
    expect(popover.el.find('.loading').length).to.be.equal 1

    popover.setLoading false
    expect(popover.loading).to.be.false
    expect(popover.active).to.be.false
    expect(popover.el.hasClass('loading')).to.be.false
    expect(popover.el.find('.loading').length).to.be.equal 0

  it 'can set active status', ->
    showSpy = sinon.spy()
    hideSpy = sinon.spy()
    popover.on 'show', showSpy
    popover.on 'hide', hideSpy

    popover.setActive true
    expect(popover.active).to.be.true
    expect(popover.el.hasClass('active')).to.be.true
    expect(showSpy.calledOnce).to.be.true

    popover.setActive false
    expect(popover.active).to.be.false
    expect(popover.el.hasClass('active')).to.be.false
    expect(hideSpy.calledOnce).to.be.true
