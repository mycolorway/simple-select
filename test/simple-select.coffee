SimpleSelect = require '../src/simple-select'
expect = chai.expect

describe 'Simple Select', ->
  select = null
  multipleSelect = null

  beforeEach ->
    $select = $("""
      <select id="select-one">
        <optgroup label="Swedish Cars">
          <option value="volvo" data-hint="car 1">Volvo</option>
          <option value="saab" data-hint="car 2">Saab</option>
        </optgroup>
        <optgroup label="German Cars">
          <option value="mercedes" data-hint="car 3">Mercedes</option>
          <option value="audi" data-hint="car 4" selected>Audi</option>
        </optgroup>
      </select>
    """).appendTo 'body'

    $multipleSelect = $("""
      <select id="select-two" multiple="true">
        <option value="">select something</option>
        <option value="0" data-key="George Washington" selected>George Washington</option>
        <option value="1" data-key="John Adams">John Adams</option>
        <option value="2" data-key="Thomas Jefferson">Thomas Jefferson</option>
      </select>
    """).appendTo 'body'

    select = new SimpleSelect
      el: $('#select-one')

    multipleSelect = new SimpleSelect
      el: $('#select-two')

  afterEach ->
    select?.destroy()
    multipleSelect?.destroy()
    select = null
    multipleSelect = null

  it 'should render after initialized', ->
    expect(select.el.is(':visible')).to.be.false
    expect(select.wrapper.is('.simple-select')).to.be.true
    expect(select.wrapper.find('.input').length).to.be.equal 1
    expect(select.wrapper.find('.popover').length).to.be.equal 1
    expect(select.el.data('simpleSelect')).to.be.equal select
    expect(select.wrapper.data('simpleSelect')).to.be.equal select

  it 'should set popover groups/active after data provider filters', ->
    excludeItemsSpy = sinon.spy multipleSelect.dataProvider, 'excludeItems'
    setGroupsSpy = sinon.spy multipleSelect.popover, 'setGroups'
    setActiveSpy = sinon.spy multipleSelect.popover, 'setActive'

    multipleSelect.dataProvider.filter 'john'
    expect(excludeItemsSpy.calledWith multipleSelect.input.selected, sinon.match.array)
      .to.be.true
    expect(setGroupsSpy.calledWith excludeItemsSpy.returnValues[0]).to.be.true
    expect(setActiveSpy.calledWith true)

  it 'should set popover loading status before/after data provider fetch remote data', ->
    setLoadingSpy = sinon.spy select.popover, 'setLoading'

    select.dataProvider.trigger 'beforeFetch'
    expect(setLoadingSpy.calledWith true).to.be.true

    setLoadingSpy.reset()
    select.dataProvider.trigger 'fetch'
    expect(setLoadingSpy.calledWith false).to.be.true

  it 'should select item when popover itemClick event triggered', ->
    spy = sinon.spy select, 'selectItem'
    $item = select.popover.el.find '.select-item[data-value=audi]'
    item = $item.data 'item'
    $item.mousedown()
    expect(spy.calledWithMatch item).to.be.true

  it 'should set highlighted item when popover shows', ->
    spy = sinon.spy select.popover, 'setHighlighted'
    multipleSpy = sinon.spy multipleSelect.popover, 'highlightNextItem'

    select.popover.setActive true
    expect(spy.calledWith select.input.selected).to.be.true

    multipleSelect.popover.setActive true
    expect(multipleSpy.calledOnce).to.be.true

  it 'should unselect item when input itemClick event triggered', ->
    spy = sinon.spy multipleSelect, 'unselectItem'
    $item = multipleSelect.input.el.find '.selected-item:first'
    item = $item.data 'item'
    $item.mousedown()
    expect(spy.calledWithMatch item).to.be.true

  it 'should clear component when input clearClick event triggered', ->
    spy = sinon.spy select, 'clear'
    select.input.el.find('.link-clear').mousedown()
    expect(spy.calledOnce).to.be.true

  it 'should set popover active when input expandClick event triggered', ->
    spy = sinon.spy select.popover, 'setActive'
    select.input.el.find('.link-expand').mousedown()
    expect(spy.lastCall.args[0]).to.be.true
