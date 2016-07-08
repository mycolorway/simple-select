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

describe 'Simple Select', ->

  it 'should inherit from SimpleModule', ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect(select instanceof SimpleModule).toBe(true)

  it "should have three items if everything is ok", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect($("body .simple-select .select-item").length).toBe(3)

  it "should see one item if type some content", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    select.setValue 'John'
    $selectedItem = select.list.find('.select-item.selected')
    expect($selectedItem.length).toBe(1)

  it "should set original select form element value according to select item", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    select.selectItem('1')
    expect(select.el.val()).toBe('1')
    select.clear()
    expect(select.el.val()).toBeNull()


  it "should work if use setItems to set items", ->
    $("""
      <select id="select-two"></select>
    """).appendTo("body")
    select = simple.select
      el: $("#select-two")

    select.setItems [
      ["张三", "1", {"data-key": "zhangsan zs 张三"}],
      ["李四", "2", {"data-key": "lisi ls 李四"}],
      ["王麻子", "3", {"data-key": "wangmazi wmz 王麻子"}]
    ]

    expect($("body .simple-select .select-item").length).toBe(3)

  it 'should not show option without value', ->
    selectEl.append('<option value></option>')
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    $(".link-expand").trigger("mousedown")
    expect($("body .simple-select .select-item").length).toBe(3)

  it 'should always select default value if all options have value', ->
    selectEl.appendTo("body")
    selectEl.find('option[value="2"]').prop('selected', true)
    select = simple.select
      el: $("#select-one")
    expect(select.el.val()).toBe('2')

  it 'should always select default value if one option has no value', ->
    selectEl.append('<option value></option>')
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    select.clear()
    select.input.blur()

    expect(select._allowEmpty).toBe(true)
    expect(select.el.val()).toBe('')

  it "should keep reference in el", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")
    expect(selectEl.data('simpleSelect')).toBe(select)

  it "should destroy reference in el after destroy", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")
    select.destroy()
    expect(selectEl.data('simpleSelect')).toBeUndefined()
