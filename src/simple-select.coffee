DataProvider = require './models/data-provider.coffee'
Group = require './models/group.coffee'
Item = require './models/item.coffee'
HtmlSelect = require './html-select.coffee'
Input = require './input.coffee'
MultipleInput = require './multiple-input.coffee'
Popover = require './popover.coffee'

class SimpleSelect extends SimpleModule

  opts:
    el: null
    remote: false
    cls: ""
    onItemRender: null
    placeholder: ""
    allowInput: false
    noWrap: false
    locales: null

  @locales:
    loading: 'Loading...'
    noResults: 'No results found'

  @_tpl: """
    <div class="simple-select">
      <div class="input"></div>
      <div class="popover"></div>
    </div>
  """

  _init: ->
    @el = $(@opts.el)
    unless @el.length > 0
      throw new Error "simple select: option el is required"
      return

    @el.data("simpleSelect")?.destroy()
    @locales = $.extend {}, SimpleSelect.locales, @opts.locales
    @multiple = @el.is '[multiple]'

    @_render()

    @dataProvider = new DataProvider
      remote: @opts.remote
      selectEl: @el

    @htmlSelect = new HtmlSelect
      el: @el

    placeholder = if @opts.placeholder
      @opts.placeholder
    else if ($blankOption = @htmlSelect.getBlankOption())
      $blankOption.text()
    else
      ''

    if @multiple
      @input = new MultipleInput
        el: @wrapper.find('.input')
        placeholder: placeholder
        selected: @htmlSelect.getValue()
      groups = @dataProvider.excludeItems @input.selected
    else
      @input = new Input
        el: @wrapper.find('.input')
        placeholder: placeholder
        noWrap: @opts.noWrap
        selected: @htmlSelect.getValue()
      groups = @dataProvider.groups

    @popover = new Popover
      el: @wrapper.find('.popover')
      groups: groups
      onItemRender: @opts.onItemRender
      locales: @locales

    @_bind()
    @disable() if @el.prop('disabled')

  _render: ->
    @el.hide()
      .data("simpleSelect", @)
    @wrapper = $(SimpleSelect._tpl)
      .data("simpleSelect", @)
      .addClass(@opts.cls)
      .insertBefore @el

  _bind: ->
    # data provider events
    @dataProvider.on 'filter', (e, groups, value) =>
      if @multiple && @input.selected
        groups = @dataProvider.excludeItems @input.selected, groups
      @popover.setGroups groups
      @popover.setActive !!(!@dataProvider.remote || value)

    @dataProvider.on 'beforeFetch', (e) =>
      @popover.setLoading true
    .on 'fetch', (e) =>
      @popover.setLoading false

    # popover events
    @popover.on 'itemClick', (e, $item, item) =>
      @selectItem item

    @popover.on 'show', (e) =>
      @_setPopoverPosition()

    # input events
    @input.on 'itemClick', (e, $item, item) =>
      @unselectItem item

    @input.on 'clearClick', (e) =>
      @clear()

    @input.on 'expandClick', (e) =>
      @popover.setActive true

    @input.on 'arrowPress', (e, direction) =>
      return unless @popover.active
      if direction == 'up'
        @popover.highlightPrevItem()
      else
        @popover.highlightNextItem()

    @input.on 'enterPress', (e) =>
      if @popover.active
        if @popover.highlighted
          @selectItem @popover.highlighted
        else if !@multiple
          @_setUserInput()
        @popover.setActive false
      else
        @el.closest('form').submit()

    @input.on 'change', (e, value) =>
      @_syncValue() unless @multiple
      @dataProvider.filter value
      @_setPopoverPosition()

    @input.on 'focus', (e) =>
      unless @dataProvider.remote && (!@input.getValue() || @input.selected)
        @popover.setActive true

    @input.on 'blur', (e) =>
      if !@multiple && !@input.selected
        value = @input.getValue()
        if item = @dataProvider.getItemByName(value)
          @selectItem item
        else
          @_setUserInput value
      @popover.setActive false

  _setUserInput: (value = @input.getValue()) ->
    if @opts.allowInput && !@multiple
      $(@opts.allowInput).val value

  _setPopoverPosition: ->
    @popover.setPosition
      top: @input.el.outerHeight() + 2
      left: 0

  _syncValue: ->
    if @multiple
      items = @input.selected || []
    else
      items = if @input.selected then [@input.selected] else []

    if @dataProvider.remote
      group = new Group
        items: items
      @htmlSelect.setGroups [group]

    if items.length > 0
      @htmlSelect.setValue items.map (item) -> item.value
    else
      @htmlSelect.setValue ''

  selectItem: (item) ->
    unless item instanceof Item
      item = @dataProvider.getItem item

    return unless item

    if @multiple
      @input.addSelected item
    else
      @input.setSelected item

    @popover.setActive false
    if @opts.remote
      @popover.setGroups []
    else if !@multiple
      @popover.setGroups @dataProvider.getGroups()
      @popover.setHighlighted item

    @_setUserInput ''
    @_syncValue()
    @triggerHandler 'change', [@input.selected]
    item

  unselectItem: (item) ->
    return unless @multiple
    unless item instanceof Item
      item = @dataProvider.getItem item
    return unless item

    @input.removeSelected item
    @_syncValue()
    @triggerHandler 'change', [@input.selected]
    item

  clear: ->
    @input.clear()
    @popover.setActive false
    @_setUserInput ''
    @triggerHandler 'change', [@input.selected]
    @

  focus: ->
    @input.focus()

  blur: ->
    @input.blur()

  disable: ->
    @input.setDisabled true
    @htmlSelect.setDisabled true
    @wrapper.addClass 'disabled'
    @

  enable: ->
    @input.setDisabled false
    @htmlSelect.setDisabled false
    @wrapper.removeClass 'disabled'
    @

  destroy: ->
    @el.removeData 'simpleSelect'
      .insertAfter @wrapper
      .show()
    @wrapper.remove()
    @

module.exports = SimpleSelect
