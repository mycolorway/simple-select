Item = require './models/item.coffee'

class Input extends SimpleModule

  opts:
    el: null
    dataProvider: null
    noWrap: false
    placeholder: ''
    selected: false

  _init: ->
    @el = $ @opts.el
    @dataProvider = @opts.dataProvider
    @focused = false
    @_inputDelay = 200
    @_render()
    @_bind()

  _render: ->
    @el.append '''
      <textarea class="text-field" rows="1" autocomplete="off"></textarea>
      <input type="text" class="text-field" />
      <a class="link-expand" href="javascript:;" tabindex="-1">
        <i class="icon-expand"><span>&#9662;</span></i>
      </a>
      <a class="link-clear" href="javascript:;" tabindex="-1">
        <i class="icon-remove"><span>&#10005;</span></i>
      </a>
    '''

    @el.find(if @opts.noWrap then 'textarea' else 'input:text').remove()
    @textField = @el.find '.text-field'
    @textField.attr 'placeholder', @opts.placeholder
    @setSelected @opts.selected
    @el

  _bind: ->
    # click event is for touch screen device
    @el.on 'mousedown click', (e) =>
      e.preventDefault()
      @textField.trigger('focus')
      false

    # click event is for touch screen device
    @el.find(".link-expand").on 'mousedown click', (e) =>
      e.preventDefault()
      return false if @disabled
      @focus() unless @focused
      @trigger 'expandClick'
      false

    # click event is for touch screen device
    @el.find(".link-clear").on 'mousedown click', (e) =>
      e.preventDefault()
      return false if @disabled
      @trigger 'clearClick'
      false

    @textField.on "keydown.simple-select", (e) =>
      if e.which == 40 or e.which == 38  # up and down
        e.preventDefault()
        direction = if e.which == 40 then 'down' else 'up'
        @triggerHandler 'arrowPress', [direction]

      else if e.which == 13  # enter
        e.preventDefault()
        @triggerHandler 'enterPress'

      else if e.which == 27  # esc
        e.preventDefault()
        @blur()

      else if e.which == 8
        @_onBackspacePress e

    .on "input.simple-select", (e) =>
      if @_inputTimer
        clearTimeout @_inputTimer
        @_inputTimer = null
      @_inputTimer = setTimeout =>
        @_onInputChange()
      , @_inputDelay
    .on "blur.simple-select", (e) =>
      @focused = false
      @triggerHandler 'blur'
      null
    .on "focus.simple-select", (e) =>
      @focused = true
      @triggerHandler 'focus'
      null

  _onBackspacePress: (e) ->
    if @selected
      e.preventDefault()
      @clear()

  _onInputChange: ->
    @_autoresize()
    @setSelected false
    @triggerHandler 'change', [@getValue()]

  _autoresize: ->
    return if @opts.noWrap
    @textField.css("height", 0)
    scrollHeight = parseFloat(@textField[0].scrollHeight)
    borderTop = parseFloat(@textField.css("border-top-width"))
    borderBottom = parseFloat(@textField.css("border-bottom-width"))
    @textField.css("height", scrollHeight + borderTop + borderBottom)

  setValue: (value) ->
    @textField.val value
    @_onInputChange()

  getValue: ->
    @textField.val()

  setSelected: (selected = false) ->
    if selected
      unless selected instanceof Item
        selected = @dataProvider.getItem selected
      @textField.val selected.name
      @_autoresize()
      @el.addClass 'selected'
    else
      @el.removeClass 'selected'

    @selected = selected
    selected

  setDisabled: (disabled = false) ->
    @disabled = disabled
    @textField.prop 'disabled', disabled
    @el.toggleClass 'disabled', disabled
    disabled

  focus: ->
    @textField.trigger('focus')

  blur: ->
    @textField.trigger('blur')

  clear: ->
    @setValue ''


module.exports = Input
