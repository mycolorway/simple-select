Group = require './models/group.coffee'

class HtmlSelect extends SimpleModule

  opts:
    el: null
    groups: null

  _init: ->
    @el = $ @opts.el
    @groups = @opts.groups
    @_render() if @groups

  _renderOption: (item, $parent = @el) ->
    $ '<option>',
      text: item.name
      value: item.value
      data: item.data
    .appendTo $parent

  _render: ->
    @el.empty()

    if @groups.length == 0
      @el.append '<option>'
    else if @groups.length == 1 && @groups[0].name == Group.defaultName
      if @groups[0].items.length == 0
        @el.append '<option>'
      else
        $.each @groups[0].items, (i, item) =>
          @_renderOption item
    else
      $.each @groups, (i, group) =>
        $group = $ "<optgroup>",
          label: group.name
        $.each group.items, (i, item) =>
          @_renderOption item, $group
        @el.append $group

    @el

  setGroups: (groups) ->
    @groups = groups
    @_render()

  getValue: ->
    @el.val()

  setValue: (value) ->
    @el.val value

  getBlankOption: ->
    $blankOption = @el.find('option:not([value]), option[value=""]')
    if $blankOption.length > 0 then $blankOption else false

module.exports = HtmlSelect
