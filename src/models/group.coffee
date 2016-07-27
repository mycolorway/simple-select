Item = require './item.coffee'

class Group

  @defaultName: '__default__'

  constructor: (opts) ->
    @name = opts.name || Group.defaultName
    @items = []

    if $.isArray(opts.items) && opts.items.length > 0
      $.each opts.items, (i, item) =>
        if $.isArray item
          item =
            name: item[0]
            value: item[1]
            data: if item.length > 2 then item[2] else null
        @items.push new Item item

  filterItems: (value) ->
    group = new Group
      name: @name
    $.each @items, (i, item) ->
      group.items.push(item) if item.match(value)
    group

  excludeItems: (items) ->
    items = items.map (item) -> item.value
    group = new Group
      name: @name
    $.each @items, (i, item) ->
      group.items.push(item) if items.indexOf(item.value) == -1
    group

  getItem: (value) ->
    result = null
    $.each @items, (i, item) ->
      result = item if item.value == value
      false if result
    result

  getItemByName: (name) ->
    result = null
    $.each @items, (i, item) ->
      result = item if item.name == name
      false if result
    result

module.exports = Group
