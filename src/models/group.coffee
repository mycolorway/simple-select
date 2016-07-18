Item = require './item.coffee'

class Group

  @defaultName: '__default__'

  constructor: (opts) ->
    @name = opts.name || Group.defaultName
    @items = []

    if $.isArray(opts.items) && opts.items.length > 0
      $.each opts.items, (i, item) =>
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

module.exports = Group
