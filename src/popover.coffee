DataProvider = require './models/data-provider.coffee'
Group = require './models/group.coffee'
Item = require './models/item.coffee'

class Popover extends SimpleModule

  @_itemTpl: """
    <div class="select-item">
      <span class="label"></span>
      <span class="hint"></span>
    </div>
  """

  opts:
    el: null
    groups: []
    onItemRender: null
    localse: {}

  _init: ->
    @el = $ @opts.el
    @groups = @opts.groups

    @_render()
    @_bind()

  _renderItem: (item) ->
    $itemEl = $(Popover._itemTpl).data('item', item)
    $itemEl.find('.label').text(item.name)
    $itemEl.find('.hint').text(item.data.hint) if item.data.hint
    $itemEl.attr 'data-value', item.value
    @el.append $itemEl

    if $.isFunction @opts.onItemRender
      @opts.onItemRender.call(@, $itemEl, item)

    $itemEl

  _render: ->
    @el.empty()
    noGroup = @groups.length == 1 && @groups[0].name == Group.defaultName

    if @groups.length == 0 || (noGroup && @groups[0].items.length == 0)
      $('<div class="no-results"></div>')
        .text @opts.locales.noResults
        .appendTo @el
    else if noGroup
      $.each @groups[0].items, (i, item) =>
        @_renderItem item
    else
      $.each @groups, (i, group) =>
        $ '<div class="select-group">'
          .text(group.name)
          .appendTo @el
        $.each group.items, (i, item) =>
          @_renderItem item

    @highlightNextItem()
    @el

  _bind: ->
    @el.on 'mousedown', '.select-item', (e) =>
      $item = $ e.currentTarget
      @triggerHandler 'itemClick', [$item, $item.data('item')]
      false

  _scrollToHighlighted: ->
    $item = @el.find('.select-item.highlighted')
    if $item.length > 0
      @el.scrollTop $item.position().top

  setGroups: (groups) ->
    @groups = groups
    @highlighted = false
    @_render()
    groups

  setHighlighted: (highlighted = false) ->
    if highlighted
      unless highlighted instanceof Item
        highlighted = @dataProvider.getItem highlighted

      @el.find(".select-item[data-value='#{highlighted.value}']")
        .addClass 'highlighted'
        .siblings()
        .removeClass 'highlighted'
    else
      @el.find('.select-item.highlighted').removeClass 'highlighted'

    @highlighted = highlighted
    highlighted

  highlightNextItem: ->
    if @highlighted
      $item = @el.find(".select-item[data-value='#{@highlighted.value}']")
        .nextAll('.select-item:first')
    else
      $item = @el.find('.select-item:first')

    if $item.length > 0
      @setHighlighted $item.data('item')

  highlightPrevItem: ->
    if @highlighted
      $item = @el.find(".select-item[data-value='#{@highlighted.value}']")
        .prevAll('.select-item:first')
    else
      $item = @el.find('.select-item:first')

    if $item.length > 0
      @setHighlighted $item.data('item')

  setLoading: (loading = true) ->
    @loading = loading

    if loading
      unless @el.find('.loading').length > 0
        $('<div class="loading"></div>')
          .text @opts.locales.loading
          .appendTo @el
      @el.addClass 'loading'
    else
      @el.removeClass 'loading'
      @el.find('.loading').remove()

    @setActive loading
    loading

  setActive: (active = true) ->
    @active = active
    @el.toggleClass 'active', active
    if active
      @_scrollToHighlighted()
      @triggerHandler 'show'
    else
      @triggerHandler 'hide'
    active

  setPosition: (position) ->
    @el.css(position) if position
    @

module.exports = Popover
