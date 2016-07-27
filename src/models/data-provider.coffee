Group = require './group.coffee'

class DataProvider extends SimpleModule

  opts:
    remote: false
    groups: null
    selectEl: null

  _init: ->
    @remote = @opts.remote

    if @opts.groups
      @setGroupsFromJson @opts.groups
    else if @opts.selectEl
      @setGroupsFromHtml @opts.selectEl

  _fetch: (value, callback) ->
    return if !@remote || @triggerHandler('beforeFetch') == false

    onFetch = (groups) =>
      @setGroupsFromJson groups
      @triggerHandler 'fetch', [@groups]
      callback? @groups

    unless value
      onFetch []
      return

    $.ajax
      url: @remote.url
      data: $.extend {}, @remote.params,
        "#{@remote.searchKey}": value
      dataType: 'json'
    .done (groups) ->
      onFetch groups

  setGroupsFromJson: (groups) ->
    return unless groups

    @groups = []
    if $.isArray groups
      @groups.push new Group
        items: groups
    else if $.isPlainObject groups
      $.each groups, (groupName, groupItems) =>
        @groups.push new Group
          name: groupName
          items: groupItems

    @triggerHandler 'change', [@groups]
    @groups

  setGroupsFromHtml: (selectEl) ->
    $select = $ selectEl
    return unless $select && $select.length > 0

    @groups = []
    itemsFromOptions = ($options) ->
      items = []
      $options.each (i, option) ->
        $option = $ option
        value = $option.val()
        return unless value
        items.push [$option.text(), value, $option.data()]
      items

    if ($groups = $select.find('optgroup')).length > 0
      $groups.each (i, groupEl) =>
        $group = $ groupEl
        @groups.push new Group
          name: $group.attr('label')
          items: itemsFromOptions($group.find('option'))
    else
      @groups.push new Group
        items: itemsFromOptions($select.find('option'))

    @triggerHandler 'change', [@groups]
    @groups

  getGroups: ->
    @groups

  getItem: (value) ->
    result = null
    $.each @groups, (i, group) ->
      result = group.getItem value
      false if result
    result

  getItemByName: (name) ->
    result = null
    $.each @groups, (i, group) ->
      result = group.getItemByName name
      false if result
    result

  filter: (value, callback) ->
    if @remote
      @_fetch value, =>
        callback? @groups, value
        @triggerHandler 'filter', [@groups, value]
    else
      groups = []
      $.each @groups, (i, group) ->
        filteredGroup = group.filterItems(value)
        groups.push(filteredGroup) if filteredGroup.items.length > 0

      callback? groups, value
      @triggerHandler 'filter', [groups, value]
    null

  excludeItems: (items = [], groups = @groups) ->
    results = []
    $.each groups, (i, group) ->
      excludedGroup = group.excludeItems(items)
      results.push(excludedGroup) if excludedGroup.items.length > 0
    results

module.exports = DataProvider
