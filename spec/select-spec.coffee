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
    $(@).data("select").destroy()
  $("select").remove()


describe 'Simple Select', ->

  it 'should inherit from SimpleModule', ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect(select instanceof SimpleModule).toBe(true)

  it "should see select if everything is ok", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect($("body .simple-select").length).toBe(1)

  it "should see throw error if no content", ->
    expect(simple.select).toThrow()

  it "should have three items if everything is ok", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect($("body .simple-select .select-item").length).toBe(3)

  it "should see one item if type some content", (done) ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    $(".select-result").val("John").trigger("keyup")
    setTimeout ->
      target = $("body .simple-select .select-item:visible")
      expect(target.length and target.hasClass("selected")).toBe(true)
      done()
    , 10

  it "should set original select form element value according to select item", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    select.selectItem(1)
    expect(select.el.val()).toBe('1')
    select.clearSelection()
    expect(select.el.val()).toBe(null)

  it "should see 'select-list' if click 'link-expand'", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    $(".link-expand").trigger("mousedown")
    expect($("body .simple-select .select-list:visible").length).toBe(1)

  it "should have value if select item", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    $(".select-item:first").trigger("mousedown")
    expect($(".select-result").val().length).toBeGreaterThan(0)

  it "should remove selected' if click 'link-clear'", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    $(".select-item:first").trigger("mousedown")
    $(".link-clear").trigger("mousedown")
    expect($(".select-result").val().length).toBe(0)

  it "should work if use setItems to set items", ->
    $("""
      <select id="select-two"></select>
    """).appendTo("body")
    select = simple.select
      el: $("#select-two")

    select.setItems [
      {
        label: "张三"
        key: "zhangsan zs 张三"
        id: "1"
      }
      {
        label: "李四"
        key: "lisi ls 李四"
        id: "2"
      }
      {
        label: "王麻子"
        key: "wangmazi wmz 王麻子"
        id: "3"
      }
    ]

    expect($("body .simple-select .select-item").length).toBe(3)

  it 'should not show option without value', ->
    selectEl.append('<option value></option>')
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    $(".link-expand").trigger("mousedown")
    expect($("body .simple-select .select-item:visible").length).toBe(3)

  it 'should always select default value if all options with value', ->
    selectEl.find('option[value=2]').prop('selected', true)
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect(select.el.val()).toBe('2')

    select.clearSelection()
    select.input.blur()

    expect(select.el.val()).toBe('0')

  it 'should always select default value if one option without value', ->
    selectEl.append('<option value></option>')
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    select.clearSelection()
    select.input.blur()

    expect(select.requireSelect).toBe(false)
    expect(select.el.val()).toBe('')

  it "keep reference in el", ->
    selectEl.appendTo("body")
    select = simple.select
      el: $("#select-one")

    expect(selectEl.data('select')).toBe(select)

    

