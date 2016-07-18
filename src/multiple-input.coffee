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
    @setSelected @opts.selected
    @el

  _bind: ->
    super()

    @el.on 'click', '.selected-item', (e) =>
      $item = $ e.currentTarget
      @triggerHandler 'itemClick', [$item, $item.data('item')]

  _onBackspacePress: (e) ->
    unless @getValue()
      e.preventDefault()
      @el.find('.selected-item:last').click()

  _onInputChange: ->
    # @_autoresize()
    @triggerHandler 'change', [@getValue()]

  _autoresize: ->
    # do nothing

  setSelected: (item = false) ->
    if item
      @addSelected selected
    else
      @clear()

  addSelected: (item) ->
    unless item instanceof Item
      item = @dataProvider.getItem item

    @selected ||= []
    @selected.push item

    $item = $ MultipleInput._itemTpl
      .attr 'data-value', item.value
      .data 'item', item
    $item.find('.item-label').text(item.name)
    $item.insertBefore @textField
    @setValue ''
    item

  removeSelected: (item) ->
    unless item instanceof Item
      item = @dataProvider.getItem item

    if @selected
      $.each @selected, (i, _item) =>
        if _item.value == item.value
          @selected.splice(i, 1)
          false
      @selected = false if @selected.length == 0

    @el.find(".selected-item[data-value='#{item.value}']").remove()
    @setValue ''
    item

  clear: ->
    @setValue ''
    @selected = false
    @el.find('.selected-item').remove()
    @triggerHandler 'clear'

module.exports = MultipleInput
