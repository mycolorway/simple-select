class Item extends SimpleModule

  constructor: (opts) ->
    @name = opts.name
    @value = opts.value.toString()
    @data = {}
    if $.isPlainObject opts.data
      $.each opts.data, (key, value) =>
        key = key.replace(/^data-/, '').split('-')
        # camel case format
        $.each key, (i, part) ->
          # capitalize
          key[i] = part.charAt(0).toUpperCase() + part.slice(1) if i > 0
        @data[key.join()] = value

  match: (value) ->
    try
      re = new RegExp("(^|\\s)" + value, "i")
    catch e
      re = new RegExp("", "i")

    filterKey = @data.searchKey || @name
    re.test filterKey

module.exports = Item
