Item = require './models/item.coffee'
Input = require './input.coffee'

class MultipleInput extends Input

  opts:
    el: null
    placeholder: ''
    selected: false

  @_itemTpl: '''
    <div class="selected-item">
      <span class="item-label"></span>
      <i class="icon-remove"><span>&#10005;</span></i>
    <div>
  '''

  _render: ->
    @el.append '''
      <textarea class="text-field" rows="1" autocomplete="off"></textarea>
    '''
    .addClass 'multiple'

    @textField = @el.find 'textarea'
    @textField.attr 'placeholder', @opts.placeholder
    if $.isArray @opts.selected
      $.each @opts.selected, (i, item) =>
        @addSelected item
    @el

  _bind: ->
    super()

    @el.on 'mousedown', (e) =>
      @textField.focus()
      false

    @el.on 'mousedown', '.selected-item', (e) =>
      $item = $ e.currentTarget
      @triggerHandler 'itemClick', [$item, $item.data('item')]
      false

  _onBackspacePress: (e) ->
    unless @getValue()
      e.preventDefault()
      @el.find('.selected-item:last').mousedown()

  _onInputChange: ->
    @triggerHandler 'change', [@getValue()]

  _autoresize: ->
    # do nothing

  _setPlaceholder: (show = true) ->
    if show
      @textField.attr 'placeholder', @opts.placeholder
    else
      @textField.removeAttr 'placeholder'

  setSelected: (item = false) ->
    if item
      @addSelected selected
    else
      @clear()

  addSelected: (item) ->
    unless item instanceof Item
      item = @dataProvider.getItem item
    return unless item

    @selected ||= []
    @selected.push item

    $item = $ MultipleInput._itemTpl
      .attr 'data-value', item.value
      .data 'item', item
    $item.find('.item-label').text(item.name)
    $item.insertBefore @textField
    @setValue ''
    @_setPlaceholder false
    item

  removeSelected: (item) ->
    unless item instanceof Item
      item = @dataProvider.getItem item
    return unless item

    if @selected
      $.each @selected, (i, _item) =>
        if _item.value == item.value
          @selected.splice(i, 1)
          false
      if @selected.length == 0
        @selected = false
        @_setPlaceholder true

    @el.find(".selected-item[data-value='#{item.value}']").remove()
    @setValue ''
    item

  clear: ->
    @setValue ''
    @selected = false
    @_setPlaceholder true
    @el.find('.selected-item').remove()

module.exports = MultipleInput
