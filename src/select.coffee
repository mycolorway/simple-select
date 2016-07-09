class Select extends SimpleModule

  opts:
    el: null
    url: null
    remote: false
    cls: ""
    onItemRender: $.noop
    placeholder: ""
    allowInput: false
    wordWrap: false
    locales: null

  @locales:
    loading: 'Loading...'
    noResults: 'No results found'

  @_tpl:
    wrapper: """
      <div class="simple-select">
        <span class="link-expand">
          <i class="icon-caret-down"><span>&#9662;</span></i>
        </span>
        <span class="link-clear">
          <i class="icon-delete"><span>&#10005;</span></i>
        </span>
        <div class="select-list">
        </div>
      </div>
    """

    item: """
      <div class="select-item">
        <a href="javascript:;" class="label"><span></span></a>
        <span class="hint"></span>
      </div>
    """

  _init: ->
    @el = $(@opts.el)
    unless @el.length > 0
      throw "simple select: option el is required"
      return

    @el.data("simpleSelect")?.destroy()
    @locales = $.extend {}, Select.locales, @opts.locales

    @_render()
    @_bind()

  _render: ->
    @el.hide()
      .data("simpleSelect", @)
    @wrapper = $(Select._tpl.wrapper)
      .data("simpleSelect", @)
      .addClass(@opts.cls)
      .insertBefore @el

    if @opts.wordWrap
      @wrapper.addClass('word-wrap')
      @input = $ '<textarea rows="1">'
    else
      @input = $ '<input type="text">'

    @input.addClass 'select-result'
      .attr 'autocomplete', 'off'
      .prependTo @wrapper
    @list = @wrapper.find ".select-list"

    @_initItems()
    @selectItem @el.val()
    @wrapper.addClass('allow-empty') if @opts.remote

    if @opts.wordWrap
      @_autoresizeInput()
    else
      @_positionList()

  _initItems: ->
    getItems = ($options) ->
      items = []
      $options.each (i, option) =>
        $option = $ option
        value = $option.val()
        return unless value
        attrs = $option.data()
        unless $.isEmptyObject(attrs)
          newAttrs = {}
          $.each Object.keys(attrs), (i, key) =>
            newAttrs["data-#{key}"] = attrs[key]
          attrs = newAttrs
        items.push [$option.text(), value, attrs]
      items

    if ($groups = @el.find('optgroup')).length > 0
      @items = {}
      $groups.each (i, group) =>
        $group = $ group
        @items[$group.attr('label')] = getItems $group.find('option')
    else
      @items = getItems @el.find('option')

    @_generateList @items
    @_checkBlankOption()

  setItems: (items) ->
    renderOptions = ($container, items) ->
      $.each items, (i, item) =>
        $option = $ '<option>', $.extend
          text: item[0]
          value: item[1]
        , if item.length > 2 then item[2] else null
        $container.append $option

    @items = items
    @el.empty()

    if $.isArray(items) && items.length > 0
      renderOptions @el, items
    else if $.isPlainObject(items) && !$.isEmptyObject(items)
      $.each items, (groupName, groupItems) =>
        $group = $ "<optgroup>",
          label: groupName
        renderOptions $group, groupItems
        @el.append $group
    else if @opts.remote
      @el.append '<option>'

    @_generateList @items
    @_checkBlankOption()

  _checkBlankOption: ->
    $blankOption = @el.find('option:not([value]), option[value=""]')
    @_allowEmpty = $blankOption.length > 0
    @wrapper.toggleClass 'allow-empty', @_allowEmpty
    @_setPlaceholder $blankOption.text()

  _setPlaceholder: (placeholder) ->
    placeholder ||= @opts.placeholder
    @input.attr("placeholder", placeholder) if placeholder

  _generateList: (items) ->
    itemEl = (item) ->
      $itemEl = $(Select._tpl.item).data('item', item)
      $itemEl.find(".label span").text(item[0])
      $itemEl.attr 'data-value', item[1]
      if item.length > 2 && (hint = item[2]['data-hint'])
        $itemEl.find(".hint").text(hint)
      $itemEl

    @list.empty()
    children = []
    if $.isPlainObject(items) && !$.isEmptyObject(items)
      $.each items, (groupName, groupItems) =>
        $groupEl = $ '<div class="select-group">'
        $groupEl.text(groupName)
        children.push $groupEl[0]
        $.each groupItems, (i, item) =>
          $itemEl = itemEl item
          children.push $itemEl[0]
          @opts.onItemRender.call(@, $itemEl, item) if $.isFunction @opts.onItemRender
    else if $.isArray(items) && items.length > 0
      $.each items, (i, item) =>
        $itemEl = itemEl item
        @opts.onItemRender.call(@, $itemEl, item) if $.isFunction @opts.onItemRender
        children.push $itemEl[0]
    else
      $noResults = $('<div class="no-results"></div>')
        .text @locales.noResults
      children.push $noResults[0]

    @list.append children

  selectItem: ($item) ->
    return unless $item
    unless typeof $item == 'object'
      $item = @list.find(".select-item[data-value='#{$item}']")
    return unless $item.length > 0
    item = $item.data 'item'

    @input.val item[0]
    if @opts.remote
      @list.empty()
    else
      @_generateList @items

    @wrapper.addClass "selected"
    @_toggleList false
    @el.val item[1]
    $(@opts.allowInput).val('') if @opts.allowInput
    @triggerHandler "select", [item, $item]
    @_autoresizeInput()
    item

  setValue: (value) ->
    @input.val value
    @_input()

  _toggleList: (expand = null) ->
    if expand == null
      expand = !@wrapper.hasClass('expanded')

    if expand
      @wrapper.addClass "expanded"
      @_scrollToItem()
    else
      @wrapper.removeClass "expanded"

  _scrollToItem: ($item) ->
    $item ||= @list.find('.select-item.selected')
    if $item.length > 0
      @list.scrollTop $item.position().top

  _bind: ->
    @wrapper.find(".link-clear").on "mousedown", (e) =>
      @clear()
      false

    @wrapper.find(".link-expand").on "mousedown", (e) =>
      @_toggleList()
      @input.focus() unless @_focused
      false

    @list.on "mousedown", ".select-item", (e) =>
      $item = $ e.currentTarget
      @selectItem $item
      @input.blur()
      false

    @input.on "keydown.simple-select", (e) =>
      @_keydown(e)
    .on "input.simple-select", (e) =>
      if @_inputTimer
        clearTimeout @_inputTimer
        @_inputTimer = null
      @_inputTimer = setTimeout =>
        @_input(e)
      , 200
    .on "blur.simple-select", (e) =>
      @_blur(e)
    .on "focus.simple-select", (e) =>
      @_focus(e)

  _validateInput: ->
    return if @wrapper.hasClass("selected")

    if value = $.trim @input.val()
      $item = @list.find(".select-item:contains('#{value}')")
      $item = @list.find('.select-item:first') unless $item.length > 0

      if $item.length > 0
        @selectItem $item
      else if @opts.allowInput
        @el.val ''
        $(@opts.allowInput).val value
      else
        @setValue ''
    else
      @el.val ''
      $(@opts.allowInput).val('') if @opts.allowInput

  _keydown: (e) ->
    if e.which == 40 or e.which == 38  # up and down
      e.preventDefault()
      return if !@wrapper.hasClass('expanded') || @list.hasClass('empty')

      $selectedEl = @list.find ".select-item.selected"
      unless $selectedEl.length > 0
        @list.find(".select-item:first").addClass "selected"
        return

      if e.which == 38
        $prevEl = $selectedEl.prevAll(".select-item:first")
        if $prevEl.length
          $selectedEl.removeClass "selected"
          $prevEl.addClass "selected"
      else if e.which == 40
        $nextEl = $selectedEl.nextAll(".select-item:first")
        if $nextEl.length
          $selectedEl.removeClass "selected"
          $nextEl.addClass "selected"

      return

    else if e.which == 13  # enter
      e.preventDefault()
      if @wrapper.hasClass('expanded')
        $selectedEl = @list.find ".select-item.selected"
        if $selectedEl.length > 0
          @selectItem $selectedEl
        else
          @_validateInput()
          @_toggleList false
      else
        @el.closest('form').submit()

    else if e.which == 27  # esc
      e.preventDefault()
      @input.blur()

    else if e.which == 8 && @wrapper.hasClass "selected"  # backspace
      e.preventDefault()
      @setValue ''

  _input: (e) ->
    @_autoresizeInput()

    @wrapper.removeClass "selected"
    @el.val ''

    value = $.trim @input.val()
    if @opts.remote
      @list.empty()
      @el.empty().append('<option>')
      if value
        $('<div class="loading"></div>')
          .text @locales.loading
          .appendTo @list

        $.ajax
          url: @opts.remote.url
          data: $.extend {}, @opts.remote.params,
            "#{@opts.remote.searchKey}": value
          dataType: 'json'
        .done (items) =>
          items ||= []
          items = items.slice(0, 50) if $.isArray(items) && items.length > 50
          @setItems items
          @list.find('.select-item:first').addClass 'selected'
          @_toggleList true
      else
        @_toggleList false
    else
      @_toggleList(true) unless @wrapper.hasClass "expanded"

      if value
        filteredItems = @_filterItems value
      else
        filteredItems = @items

      @_generateList filteredItems
      @list.find('.select-item:first').addClass 'selected'

  _filterItems: (value) ->
    try
      re = new RegExp("(|\\s)" + value, "i")
    catch e
      re = new RegExp("", "i")

    isMatched = (item) ->
      filterKey = (item.length > 2 && item[2]['data-key']) || item[0]
      re.test filterKey

    if $.isPlainObject(@items)
      items = {}
      $.each @items, (groupName, groupItems) =>
        $.each groupItems, (i, item) =>
          if isMatched item
            items[groupName] ||= []
            items[groupName].push item
    else
      items = []
      $.each @items, (i, item) =>
        items.push(item) if isMatched item

    items

  _blur: (e) ->
    @_validateInput()
    @_toggleList false
    @_focused = false

  _focus: (e) ->
    @_focused = true
    return if @opts.remote && (!@input.val() || @wrapper.hasClass('selected'))
    @_toggleList true
    setTimeout =>
      @input.select()

  clear: ->
    @setValue ''
    @_toggleList false

    @triggerHandler "clear"

  _autoresizeInput: ->
    return unless @opts.wordWrap
    @input.css("height", 0)
    @input.css("height", parseInt(@input[0].scrollHeight) + parseInt(@input.css("border-top-width")) + parseInt(@input.css("border-bottom-width")))
    @_positionList()

  _positionList: ->
    @list.css 'top', @input.outerHeight() + 2

  disable: ->
    @input.prop 'disabled', true
    @el.prop 'disabled', true
    @wrapper.addClass 'disabled'

  enable: ->
    @input.prop 'disabled', false
    @el.prop 'disabled', false
    @wrapper.removeClass 'disabled'

  destroy: ->
    @wrapper.remove()
    @el.removeData 'simpleSelect'
    @el.show()

select = (opts) ->
  new Select(opts)

select.locales = Select.locales
