SimpleSelect = require '../src/simple-select'
expect = chai.expect

describe 'Simple Select', ->
  selectEl = null

  beforeEach ->
    selectEl = $("""
      <select id="select-one">
        <option value="0" data-key="George Washington">George Washington</option>
        <option value="1" data-key="John Adams">John Adams</option>
        <option value="2" data-key="Thomas Jefferson">Thomas Jefferson</option>
      </select>
      """)

  afterEach ->
    $(".simple-select").each () ->
      $(@).data("simpleSelect").destroy()
    $("select").remove()

  it 'should inherit from SimpleModule', ->
    selectEl.appendTo("body")
    select = new SimpleSelect
      el: $("#select-one")

    expect(select instanceof SimpleModule).to.be.equal(true)
