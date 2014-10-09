
describe 'Simple Select', ->

  it 'should inherit from SimpleModule', ->
    select = simple.select
      el: $("input")
    expect(select instanceof SimpleModule).toBe(true)
