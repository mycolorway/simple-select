/**
 * simple-select v2.1.0
 * http://mycolorway.github.io/simple-select
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/simple-select/license.html
 *
 * Date: 2016-07-19
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('simple-module'));
  } else {
    root.SimpleSelect = factory(root.jQuery,root.SimpleModule);
    root.simple = root.simple || {};
    root.simple.select = function (opts) {
      return new root.SimpleSelect(opts);
    }
    root.simple.select.locales = root.SimpleSelect.locales;
  }
}(this, function ($,SimpleModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Group, HtmlSelect,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Group = require('./models/group.coffee');

HtmlSelect = (function(superClass) {
  extend(HtmlSelect, superClass);

  function HtmlSelect() {
    return HtmlSelect.__super__.constructor.apply(this, arguments);
  }

  HtmlSelect.prototype.opts = {
    el: null,
    groups: null
  };

  HtmlSelect.prototype._init = function() {
    this.el = $(this.opts.el);
    this.groups = this.opts.groups;
    if (this.groups) {
      return this._render();
    }
  };

  HtmlSelect.prototype._renderOption = function(item, $parent) {
    if ($parent == null) {
      $parent = this.el;
    }
    return $('<option>', {
      text: item.name,
      value: item.value,
      data: item.data
    }).appendTo($parent);
  };

  HtmlSelect.prototype._render = function() {
    this.el.empty();
    if (this.groups.length === 1 && this.groups[0].name === Group.defaultName) {
      $.each(this.groups[0].items, (function(_this) {
        return function(i, item) {
          return _this._renderOption(item);
        };
      })(this));
    } else {
      $.each(this.groups, (function(_this) {
        return function(i, group) {
          var $group;
          $group = $("<optgroup>", {
            label: group.name
          });
          $.each(group.items, function(i, item) {
            return _this._renderOption(item, $group);
          });
          return _this.el.append($group);
        };
      })(this));
    }
    return this.el;
  };

  HtmlSelect.prototype.setGroups = function(groups) {
    this.groups = groups;
    return this._render();
  };

  HtmlSelect.prototype.getValue = function() {
    return this.el.val();
  };

  HtmlSelect.prototype.setValue = function(value) {
    return this.el.val(value);
  };

  HtmlSelect.prototype.getBlankOption = function() {
    var $blankOption;
    $blankOption = this.el.find('option:not([value]), option[value=""]');
    if ($blankOption.length > 0) {
      return $blankOption;
    } else {
      return false;
    }
  };

  return HtmlSelect;

})(SimpleModule);

module.exports = HtmlSelect;

},{"./models/group.coffee":4}],2:[function(require,module,exports){
var DataProvider, Input, Item,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataProvider = require('./models/data-provider.coffee');

Item = require('./models/item.coffee');

Input = (function(superClass) {
  extend(Input, superClass);

  function Input() {
    return Input.__super__.constructor.apply(this, arguments);
  }

  Input.prototype.opts = {
    el: null,
    noWrap: false,
    placeholder: '',
    selected: false
  };

  Input.prototype._init = function() {
    this.el = $(this.opts.el);
    this.dataProvider = DataProvider.getInstance();
    this._render();
    return this._bind();
  };

  Input.prototype._render = function() {
    this.el.append('<textarea class="text-field" rows="1" autocomplete="off"></textarea>\n<input type="text" class="text-field" />\n<a class="link-expand" href="javascript:;" tabindex="-1">\n  <i class="icon-expand"><span>&#9662;</span></i>\n</a>\n<a class="link-clear" href="javascript:;" tabindex="-1">\n  <i class="icon-remove"><span>&#10005;</span></i>\n</a>');
    this.el.find(this.opts.noWrap ? 'textarea' : 'input:text').remove();
    this.textField = this.el.find('.text-field');
    this.textField.attr('placeholder', this.opts.placeholder);
    this.setSelected(this.opts.selected);
    return this.el;
  };

  Input.prototype._bind = function() {
    this.el.find(".link-expand").on("mousedown", (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if (!_this.focused) {
          _this.focus();
        }
        _this.trigger('expandClick');
        return false;
      };
    })(this));
    this.el.find(".link-clear").on("mousedown", (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        _this.trigger('clearClick');
        return false;
      };
    })(this));
    return this.textField.on("keydown.simple-select", (function(_this) {
      return function(e) {
        var direction;
        if (e.which === 40 || e.which === 38) {
          e.preventDefault();
          direction = e.which === 40 ? 'down' : 'up';
          return _this.triggerHandler('arrowPress', [direction]);
        } else if (e.which === 13) {
          e.preventDefault();
          return _this.triggerHandler('enterPress');
        } else if (e.which === 27) {
          e.preventDefault();
          return _this.blur();
        } else if (e.which === 8) {
          return _this._onBackspacePress(e);
        }
      };
    })(this)).on("input.simple-select", (function(_this) {
      return function(e) {
        if (_this._inputTimer) {
          clearTimeout(_this._inputTimer);
          _this._inputTimer = null;
        }
        return _this._inputTimer = setTimeout(function() {
          return _this._onInputChange();
        }, 200);
      };
    })(this)).on("blur.simple-select", (function(_this) {
      return function(e) {
        _this.focused = false;
        return _this.triggerHandler('blur');
      };
    })(this)).on("focus.simple-select", (function(_this) {
      return function(e) {
        _this.focused = true;
        return _this.triggerHandler('focus');
      };
    })(this));
  };

  Input.prototype._onBackspacePress = function(e) {
    if (this.selected) {
      e.preventDefault();
      return this.clear();
    }
  };

  Input.prototype._onInputChange = function() {
    this._autoresize();
    this.setSelected(false);
    return this.triggerHandler('change', [this.getValue()]);
  };

  Input.prototype._autoresize = function() {
    var borderBottom, borderTop, scrollHeight;
    if (this.opts.noWrap) {
      return;
    }
    this.textField.css("height", 0);
    scrollHeight = parseFloat(this.textField[0].scrollHeight);
    borderTop = parseFloat(this.textField.css("border-top-width"));
    borderBottom = parseFloat(this.textField.css("border-bottom-width"));
    return this.textField.css("height", scrollHeight + borderTop + borderBottom);
  };

  Input.prototype.setValue = function(value) {
    this.textField.val(value);
    return this._onInputChange();
  };

  Input.prototype.getValue = function() {
    return this.textField.val();
  };

  Input.prototype.setSelected = function(selected) {
    if (selected == null) {
      selected = false;
    }
    if (selected) {
      if (!(selected instanceof Item)) {
        selected = this.dataProvider.getItem(selected);
      }
      this.textField.val(selected.name);
      this.el.addClass('selected');
    } else {
      this.el.removeClass('selected');
    }
    this.selected = selected;
    return selected;
  };

  Input.prototype.setDisabled = function(disabled) {
    if (disabled == null) {
      disabled = false;
    }
    this.disabled = disabled;
    this.textField.prop('disabled', disabled);
    this.el.toggleClass('disabled', disabled);
    return disabled;
  };

  Input.prototype.focus = function() {
    return this.textField.focus();
  };

  Input.prototype.blur = function() {
    return this.textField.blur();
  };

  Input.prototype.clear = function() {
    return this.setValue('');
  };

  return Input;

})(SimpleModule);

module.exports = Input;

},{"./models/data-provider.coffee":3,"./models/item.coffee":5}],3:[function(require,module,exports){
var DataProvider, Group,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Group = require('./group.coffee');

DataProvider = (function(superClass) {
  extend(DataProvider, superClass);

  function DataProvider() {
    return DataProvider.__super__.constructor.apply(this, arguments);
  }

  DataProvider.getInstance = function() {
    return this.instance;
  };

  DataProvider.prototype.opts = {
    remote: false,
    groups: null,
    selectEl: null
  };

  DataProvider.prototype._init = function() {
    if (this.opts.remote) {
      this.remote = this.opts.remote;
    } else if (this.opts.groups) {
      this.setGroupsFromJson(this.opts.groups);
    } else if (this.opts.selectEl) {
      this.setGroupsFromHtml(this.opts.selectEl);
    }
    return DataProvider.instance = this;
  };

  DataProvider.prototype._fetch = function(value, callback) {
    var obj, onFetch;
    if (!this.remote || this.triggerHandler('beforeFetch') === false) {
      return;
    }
    onFetch = (function(_this) {
      return function(groups) {
        _this.setGroupsFromJson(groups);
        _this.triggerHandler('fetch', [_this.groups]);
        return typeof callback === "function" ? callback(_this.groups) : void 0;
      };
    })(this);
    if (!value) {
      onFetch([]);
      return;
    }
    return $.ajax({
      url: this.remote.url,
      data: $.extend({}, this.remote.params, (
        obj = {},
        obj["" + this.remote.searchKey] = value,
        obj
      )),
      dataType: 'json'
    }).done(function(groups) {
      return onFetch(groups);
    });
  };

  DataProvider.prototype.setGroupsFromJson = function(groups) {
    if (!groups) {
      return;
    }
    this.groups = [];
    if ($.isArray(groups)) {
      this.groups.push(new Group({
        items: groups
      }));
    } else if ($.isPlainObject(groups)) {
      $.each(groups, (function(_this) {
        return function(groupName, groupItems) {
          return _this.groups.push(new Group({
            name: groupName,
            items: groupItems
          }));
        };
      })(this));
    }
    this.triggerHandler('change', [this.groups]);
    return this.groups;
  };

  DataProvider.prototype.setGroupsFromHtml = function(selectEl) {
    var $groups, $select, itemsFromOptions;
    $select = $(selectEl);
    if (!($select && $select.length > 0)) {
      return;
    }
    this.groups = [];
    itemsFromOptions = function($options) {
      var items;
      items = [];
      $options.each(function(i, option) {
        var $option, value;
        $option = $(option);
        value = $option.val();
        if (!value) {
          return;
        }
        return items.push([$option.text(), value, $option.data()]);
      });
      return items;
    };
    if (($groups = $select.find('optgroup')).length > 0) {
      $groups.each((function(_this) {
        return function(i, groupEl) {
          var $group;
          $group = $(groupEl);
          return _this.groups.push(new Group({
            name: $group.attr('label'),
            items: itemsFromOptions($group.find('option'))
          }));
        };
      })(this));
    } else {
      this.groups.push(new Group({
        items: itemsFromOptions($select.find('option'))
      }));
    }
    this.triggerHandler('change', [this.groups]);
    return this.groups;
  };

  DataProvider.prototype.getGroups = function() {
    return this.groups;
  };

  DataProvider.prototype.getItem = function(value) {
    var result;
    result = null;
    $.each(this.groups, function(i, group) {
      result = group.getItem(value);
      if (result) {
        return false;
      }
    });
    return result;
  };

  DataProvider.prototype.getItemByName = function(name) {
    var result;
    result = null;
    $.each(this.groups, function(i, group) {
      result = group.getItemByName(name);
      if (result) {
        return false;
      }
    });
    return result;
  };

  DataProvider.prototype.filter = function(value, callback) {
    var groups;
    if (this.remote) {
      this._fetch(value, (function(_this) {
        return function() {
          if (typeof callback === "function") {
            callback(_this.groups, value);
          }
          return _this.triggerHandler('filter', [_this.groups, value]);
        };
      })(this));
    } else {
      groups = [];
      $.each(this.groups, function(i, group) {
        var filteredGroup;
        filteredGroup = group.filterItems(value);
        if (filteredGroup.items.length > 0) {
          return groups.push(filteredGroup);
        }
      });
      if (typeof callback === "function") {
        callback(groups, value);
      }
      this.triggerHandler('filter', [groups, value]);
    }
    return null;
  };

  DataProvider.prototype.excludeItems = function(items, groups) {
    var results;
    if (items == null) {
      items = [];
    }
    if (groups == null) {
      groups = this.groups;
    }
    results = [];
    $.each(groups, function(i, group) {
      var excludedGroup;
      excludedGroup = group.excludeItems(items);
      if (excludedGroup.items.length > 0) {
        return results.push(excludedGroup);
      }
    });
    return results;
  };

  return DataProvider;

})(SimpleModule);

module.exports = DataProvider;

},{"./group.coffee":4}],4:[function(require,module,exports){
var Group, Item;

Item = require('./item.coffee');

Group = (function() {
  Group.defaultName = '__default__';

  function Group(opts) {
    this.name = opts.name || Group.defaultName;
    this.items = [];
    if ($.isArray(opts.items) && opts.items.length > 0) {
      $.each(opts.items, (function(_this) {
        return function(i, item) {
          if ($.isArray(item)) {
            item = {
              name: item[0],
              value: item[1],
              data: item.length > 2 ? item[2] : null
            };
          }
          return _this.items.push(new Item(item));
        };
      })(this));
    }
  }

  Group.prototype.filterItems = function(value) {
    var group;
    group = new Group({
      name: this.name
    });
    $.each(this.items, function(i, item) {
      if (item.match(value)) {
        return group.items.push(item);
      }
    });
    return group;
  };

  Group.prototype.excludeItems = function(items) {
    var group;
    items = items.map(function(item) {
      return item.value;
    });
    group = new Group({
      name: this.name
    });
    $.each(this.items, function(i, item) {
      if (items.indexOf(item.value) === -1) {
        return group.items.push(item);
      }
    });
    return group;
  };

  Group.prototype.getItem = function(value) {
    var result;
    result = null;
    $.each(this.items, function(i, item) {
      if (item.value === value) {
        result = item;
      }
      if (result) {
        return false;
      }
    });
    return result;
  };

  Group.prototype.getItemByName = function(name) {
    var result;
    result = null;
    $.each(this.items, function(i, item) {
      if (item.name === name) {
        result = item;
      }
      if (result) {
        return false;
      }
    });
    return result;
  };

  return Group;

})();

module.exports = Group;

},{"./item.coffee":5}],5:[function(require,module,exports){
var Item,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Item = (function(superClass) {
  extend(Item, superClass);

  function Item(opts) {
    this.name = opts.name;
    this.value = opts.value.toString();
    this.data = {};
    if ($.isPlainObject(opts.data)) {
      $.each(opts.data, (function(_this) {
        return function(key, value) {
          key = key.replace(/^data-/, '').split('-');
          $.each(key, function(i, part) {
            if (i > 0) {
              return key[i] = part.charAt(0).toUpperCase() + part.slice(1);
            }
          });
          return _this.data[key.join()] = value;
        };
      })(this));
    }
  }

  Item.prototype.match = function(value) {
    var e, error, filterKey, re;
    try {
      re = new RegExp("(^|\\s)" + value, "i");
    } catch (error) {
      e = error;
      re = new RegExp("", "i");
    }
    filterKey = this.data.searchKey || this.name;
    return re.test(filterKey);
  };

  return Item;

})(SimpleModule);

module.exports = Item;

},{}],6:[function(require,module,exports){
var Input, Item, MultipleInput,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Item = require('./models/item.coffee');

Input = require('./input.coffee');

MultipleInput = (function(superClass) {
  extend(MultipleInput, superClass);

  function MultipleInput() {
    return MultipleInput.__super__.constructor.apply(this, arguments);
  }

  MultipleInput.prototype.opts = {
    el: null,
    placeholder: '',
    selected: false
  };

  MultipleInput._itemTpl = '<div class="selected-item">\n  <span class="item-label"></span>\n  <i class="icon-remove"><span>&#10005;</span></i>\n<div>';

  MultipleInput.prototype._render = function() {
    this.el.append('<textarea class="text-field" rows="1" autocomplete="off"></textarea>').addClass('multiple');
    this.textField = this.el.find('textarea');
    this.textField.attr('placeholder', this.opts.placeholder);
    if ($.isArray(this.opts.selected)) {
      $.each(this.opts.selected, (function(_this) {
        return function(i, item) {
          return _this.addSelected(item);
        };
      })(this));
    }
    return this.el;
  };

  MultipleInput.prototype._bind = function() {
    MultipleInput.__super__._bind.call(this);
    return this.el.on('mousedown', '.selected-item', (function(_this) {
      return function(e) {
        var $item;
        $item = $(e.currentTarget);
        _this.triggerHandler('itemClick', [$item, $item.data('item')]);
        return false;
      };
    })(this));
  };

  MultipleInput.prototype._onBackspacePress = function(e) {
    if (!this.getValue()) {
      e.preventDefault();
      return this.el.find('.selected-item:last').click();
    }
  };

  MultipleInput.prototype._onInputChange = function() {
    return this.triggerHandler('change', [this.getValue()]);
  };

  MultipleInput.prototype._autoresize = function() {};

  MultipleInput.prototype._setPlaceholder = function(show) {
    if (show == null) {
      show = true;
    }
    if (show) {
      return this.textField.attr('placeholder', this.opts.placeholder);
    } else {
      return this.textField.removeAttr('placeholder');
    }
  };

  MultipleInput.prototype.setSelected = function(item) {
    if (item == null) {
      item = false;
    }
    if (item) {
      return this.addSelected(selected);
    } else {
      return this.clear();
    }
  };

  MultipleInput.prototype.addSelected = function(item) {
    var $item;
    if (!(item instanceof Item)) {
      item = this.dataProvider.getItem(item);
    }
    this.selected || (this.selected = []);
    this.selected.push(item);
    $item = $(MultipleInput._itemTpl).attr('data-value', item.value).data('item', item);
    $item.find('.item-label').text(item.name);
    $item.insertBefore(this.textField);
    this.setValue('');
    this._setPlaceholder(false);
    return item;
  };

  MultipleInput.prototype.removeSelected = function(item) {
    if (!(item instanceof Item)) {
      item = this.dataProvider.getItem(item);
    }
    if (this.selected) {
      $.each(this.selected, (function(_this) {
        return function(i, _item) {
          if (_item.value === item.value) {
            _this.selected.splice(i, 1);
            return false;
          }
        };
      })(this));
      if (this.selected.length === 0) {
        this.selected = false;
        this._setPlaceholder(true);
      }
    }
    this.el.find(".selected-item[data-value='" + item.value + "']").remove();
    this.setValue('');
    return item;
  };

  MultipleInput.prototype.clear = function() {
    this.setValue('');
    this.selected = false;
    this._setPlaceholder(true);
    return this.el.find('.selected-item').remove();
  };

  return MultipleInput;

})(Input);

module.exports = MultipleInput;

},{"./input.coffee":2,"./models/item.coffee":5}],7:[function(require,module,exports){
var DataProvider, Group, Item, Popover,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataProvider = require('./models/data-provider.coffee');

Group = require('./models/group.coffee');

Item = require('./models/item.coffee');

Popover = (function(superClass) {
  extend(Popover, superClass);

  function Popover() {
    return Popover.__super__.constructor.apply(this, arguments);
  }

  Popover._itemTpl = "<div class=\"select-item\">\n  <span class=\"label\"></span>\n  <span class=\"hint\"></span>\n</div>";

  Popover.prototype.opts = {
    el: null,
    groups: [],
    onItemRender: null,
    localse: {}
  };

  Popover.prototype._init = function() {
    this.el = $(this.opts.el);
    this.groups = this.opts.groups;
    this._render();
    return this._bind();
  };

  Popover.prototype._renderItem = function(item) {
    var $itemEl;
    $itemEl = $(Popover._itemTpl).data('item', item);
    $itemEl.find('.label').text(item.name);
    if (item.data.hint) {
      $itemEl.find('.hint').text(item.data.hint);
    }
    $itemEl.attr('data-value', item.value);
    this.el.append($itemEl);
    if ($.isFunction(this.opts.onItemRender)) {
      this.opts.onItemRender.call(this, $itemEl, item);
    }
    return $itemEl;
  };

  Popover.prototype._render = function() {
    var noGroup;
    this.el.empty();
    noGroup = this.groups.length === 1 && this.groups[0].name === Group.defaultName;
    if (this.groups.length === 0 || (noGroup && this.groups[0].items.length === 0)) {
      $('<div class="no-results"></div>').text(this.opts.locales.noResults).appendTo(this.el);
    } else if (noGroup) {
      $.each(this.groups[0].items, (function(_this) {
        return function(i, item) {
          return _this._renderItem(item);
        };
      })(this));
    } else {
      $.each(this.groups, (function(_this) {
        return function(i, group) {
          $('<div class="select-group">').text(group.name).appendTo(_this.el);
          return $.each(group.items, function(i, item) {
            return _this._renderItem(item);
          });
        };
      })(this));
    }
    this.highlightNextItem();
    return this.el;
  };

  Popover.prototype._bind = function() {
    return this.el.on('mousedown', '.select-item', (function(_this) {
      return function(e) {
        var $item;
        $item = $(e.currentTarget);
        _this.triggerHandler('itemClick', [$item, $item.data('item')]);
        return false;
      };
    })(this));
  };

  Popover.prototype._scrollToHighlighted = function() {
    var $item;
    $item = this.el.find('.select-item.highlighted');
    if ($item.length > 0) {
      return this.el.scrollTop($item.position().top);
    }
  };

  Popover.prototype.setGroups = function(groups) {
    this.groups = groups;
    this.highlighted = false;
    this._render();
    return groups;
  };

  Popover.prototype.setHighlighted = function(highlighted) {
    if (highlighted == null) {
      highlighted = false;
    }
    if (highlighted) {
      if (!(highlighted instanceof Item)) {
        highlighted = this.dataProvider.getItem(highlighted);
      }
      this.el.find(".select-item[data-value='" + highlighted.value + "']").addClass('highlighted').siblings().removeClass('highlighted');
    } else {
      this.el.find('.select-item.highlighted').removeClass('highlighted');
    }
    this.highlighted = highlighted;
    return highlighted;
  };

  Popover.prototype.highlightNextItem = function() {
    var $item;
    if (this.highlighted) {
      $item = this.el.find(".select-item[data-value='" + this.highlighted.value + "']").nextAll('.select-item:first');
    } else {
      $item = this.el.find('.select-item:first');
    }
    if ($item.length > 0) {
      return this.setHighlighted($item.data('item'));
    }
  };

  Popover.prototype.highlightPrevItem = function() {
    var $item;
    if (this.highlighted) {
      $item = this.el.find(".select-item[data-value='" + this.highlighted.value + "']").prevAll('.select-item:first');
    } else {
      $item = this.el.find('.select-item:first');
    }
    if ($item.length > 0) {
      return this.setHighlighted($item.data('item'));
    }
  };

  Popover.prototype.setLoading = function(loading) {
    if (loading == null) {
      loading = true;
    }
    this.loading = loading;
    if (loading) {
      if (!(this.el.find('.loading').length > 0)) {
        $('<div class="loading"></div>').text(this.opts.locales.loading).appendTo(this.el);
      }
      this.el.addClass('loading');
    } else {
      this.el.removeClass('loading');
      this.el.find('.loading').remove();
    }
    this.setActive(loading);
    return loading;
  };

  Popover.prototype.setActive = function(active) {
    if (active == null) {
      active = true;
    }
    this.active = active;
    this.el.toggleClass('active', active);
    if (active) {
      this._scrollToHighlighted();
      this.triggerHandler('show');
    } else {
      this.triggerHandler('hide');
    }
    return active;
  };

  Popover.prototype.setPosition = function(position) {
    if (position) {
      this.el.css(position);
    }
    return this;
  };

  return Popover;

})(SimpleModule);

module.exports = Popover;

},{"./models/data-provider.coffee":3,"./models/group.coffee":4,"./models/item.coffee":5}],"simple-select":[function(require,module,exports){
var DataProvider, Group, HtmlSelect, Input, Item, MultipleInput, Popover, SimpleSelect,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DataProvider = require('./models/data-provider.coffee');

Group = require('./models/group.coffee');

Item = require('./models/item.coffee');

HtmlSelect = require('./html-select.coffee');

Input = require('./input.coffee');

MultipleInput = require('./multiple-input.coffee');

Popover = require('./popover.coffee');

SimpleSelect = (function(superClass) {
  extend(SimpleSelect, superClass);

  function SimpleSelect() {
    return SimpleSelect.__super__.constructor.apply(this, arguments);
  }

  SimpleSelect.prototype.opts = {
    el: null,
    remote: false,
    cls: "",
    onItemRender: null,
    placeholder: "",
    allowInput: false,
    noWrap: false,
    locales: null
  };

  SimpleSelect.locales = {
    loading: 'Loading...',
    noResults: 'No results found'
  };

  SimpleSelect._tpl = "<div class=\"simple-select\">\n  <div class=\"input\"></div>\n  <div class=\"popover\"></div>\n</div>";

  SimpleSelect.prototype._init = function() {
    var $blankOption, groups, placeholder, ref;
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error("simple select: option el is required");
      return;
    }
    if ((ref = this.el.data("simpleSelect")) != null) {
      ref.destroy();
    }
    this.locales = $.extend({}, SimpleSelect.locales, this.opts.locales);
    this.multiple = this.el.is('[multiple]');
    this._render();
    this.dataProvider = new DataProvider({
      remote: this.opts.remote,
      selectEl: this.el
    });
    this.htmlSelect = new HtmlSelect({
      el: this.el
    });
    placeholder = this.opts.placeholder ? this.opts.placeholder : ($blankOption = this.htmlSelect.getBlankOption()) ? $blankOption.text() : false;
    if (this.multiple) {
      this.input = new MultipleInput({
        el: this.wrapper.find('.input'),
        placeholder: placeholder,
        selected: this.htmlSelect.getValue()
      });
      groups = this.dataProvider.excludeItems(this.input.selected);
    } else {
      this.input = new Input({
        el: this.wrapper.find('.input'),
        placeholder: placeholder,
        noWrap: this.opts.noWrap,
        selected: this.htmlSelect.getValue()
      });
      groups = this.dataProvider.groups;
    }
    this.popover = new Popover({
      el: this.wrapper.find('.popover'),
      groups: groups,
      onItemRender: this.opts.onItemRender,
      locales: this.locales
    });
    this._bind();
    if (this.el.prop('disabled')) {
      return this.disable();
    }
  };

  SimpleSelect.prototype._render = function() {
    this.el.hide().data("simpleSelect", this);
    return this.wrapper = $(SimpleSelect._tpl).data("simpleSelect", this).addClass(this.opts.cls).insertBefore(this.el);
  };

  SimpleSelect.prototype._bind = function() {
    this.dataProvider.on('filter', (function(_this) {
      return function(e, groups, value) {
        if (_this.multiple && _this.input.selected) {
          groups = _this.dataProvider.excludeItems(_this.input.selected, groups);
        }
        _this.popover.setGroups(groups);
        return _this.popover.setActive(!!(!_this.dataProvider.remote || value));
      };
    })(this));
    this.dataProvider.on('beforeFetch', (function(_this) {
      return function(e) {
        return _this.popover.setLoading(true);
      };
    })(this)).on('fetch', (function(_this) {
      return function(e) {
        return _this.popover.setLoading(false);
      };
    })(this));
    this.popover.on('itemClick', (function(_this) {
      return function(e, $item, item) {
        return _this.selectItem(item);
      };
    })(this));
    this.popover.on('show', (function(_this) {
      return function(e) {
        return _this._setPopoverPosition();
      };
    })(this));
    this.input.on('itemClick', (function(_this) {
      return function(e, $item, item) {
        return _this.unselectItem(item);
      };
    })(this));
    this.input.on('clearClick', (function(_this) {
      return function(e) {
        return _this.clear();
      };
    })(this));
    this.input.on('expandClick', (function(_this) {
      return function(e) {
        return _this.popover.setActive(true);
      };
    })(this));
    this.input.on('arrowPress', (function(_this) {
      return function(e, direction) {
        if (!_this.popover.active) {
          return;
        }
        if (direction === 'up') {
          return _this.popover.highlightPrevItem();
        } else {
          return _this.popover.highlightNextItem();
        }
      };
    })(this));
    this.input.on('enterPress', (function(_this) {
      return function(e) {
        if (_this.popover.active) {
          if (_this.popover.highlighted) {
            _this.selectItem(_this.popover.highlighted);
          } else if (!_this.multiple) {
            _this._setUserInput();
          }
          return _this.popover.setActive(false);
        } else {
          return _this.el.closest('form').submit();
        }
      };
    })(this));
    this.input.on('change', (function(_this) {
      return function(e, value) {
        if (!_this.multiple) {
          _this._syncValue();
        }
        _this.dataProvider.filter(value);
        return _this._setPopoverPosition();
      };
    })(this));
    this.input.on('focus', (function(_this) {
      return function(e) {
        if (!(_this.dataProvider.remote && (!_this.input.getValue() || _this.input.selected))) {
          return _this.popover.setActive(true);
        }
      };
    })(this));
    return this.input.on('blur', (function(_this) {
      return function(e) {
        var item, value;
        if (!_this.multiple && !_this.input.selected) {
          value = _this.input.getValue();
          if (item = _this.dataProvider.getItemByName(value)) {
            _this.selectItem(item);
          } else {
            _this._setUserInput(value);
          }
        }
        return _this.popover.setActive(false);
      };
    })(this));
  };

  SimpleSelect.prototype._setUserInput = function(value) {
    if (value == null) {
      value = this.input.getValue();
    }
    if (this.opts.allowInput && !this.multiple) {
      return $(this.opts.allowInput).val(value);
    }
  };

  SimpleSelect.prototype._setPopoverPosition = function() {
    return this.popover.setPosition({
      top: this.input.el.outerHeight() + 2,
      left: 0
    });
  };

  SimpleSelect.prototype._syncValue = function() {
    var group, items;
    if (this.multiple) {
      items = this.input.selected || [];
    } else {
      items = this.input.selected ? [this.input.selected] : [];
    }
    if (this.dataProvider.remote) {
      group = new Group({
        items: items
      });
      this.htmlSelect.setGroups([group]);
    }
    return this.htmlSelect.setValue(items.map(function(item) {
      return item.value;
    }));
  };

  SimpleSelect.prototype.selectItem = function(item) {
    if (!(item instanceof Item)) {
      item = this.dataProvider.getItem(item);
    }
    if (!item) {
      return;
    }
    if (this.multiple) {
      this.input.addSelected(item);
    } else {
      this.input.setSelected(item);
    }
    this.popover.setActive(false);
    if (this.opts.remote) {
      this.popover.setGroups([]);
    } else if (!this.multiple) {
      this.popover.setGroups(this.dataProvider.getGroups());
      this.popover.setHighlighted(item);
    }
    this._setUserInput('');
    this._syncValue();
    this.triggerHandler('change', [this.input.selected]);
    return item;
  };

  SimpleSelect.prototype.unselectItem = function(item) {
    if (!this.multiple) {
      return;
    }
    if (!(item instanceof Item)) {
      item = this.dataProvider.getItem(item);
    }
    if (!item) {
      return;
    }
    this.input.removeSelected(item);
    this._syncValue();
    this.triggerHandler('change', [this.input.selected]);
    return item;
  };

  SimpleSelect.prototype.clear = function() {
    this.input.clear();
    this.popover.setActive(false);
    this._setUserInput('');
    this.triggerHandler('change', [this.input.selected]);
    return this;
  };

  SimpleSelect.prototype.focus = function() {
    return this.input.focus();
  };

  SimpleSelect.prototype.blur = function() {
    return this.input.blur();
  };

  SimpleSelect.prototype.disable = function() {
    this.input.setDisabled(true);
    this.htmlSelect.setDisabled(true);
    this.wrapper.addClass('disabled');
    return this;
  };

  SimpleSelect.prototype.enable = function() {
    this.input.setDisabled(false);
    this.htmlSelect.setDisabled(false);
    this.wrapper.removeClass('disabled');
    return this;
  };

  SimpleSelect.prototype.destroy = function() {
    this.el.removeData('simpleSelect').insertAfter(this.wrapper).show();
    this.wrapper.remove();
    return this;
  };

  return SimpleSelect;

})(SimpleModule);

module.exports = SimpleSelect;

},{"./html-select.coffee":1,"./input.coffee":2,"./models/data-provider.coffee":3,"./models/group.coffee":4,"./models/item.coffee":5,"./multiple-input.coffee":6,"./popover.coffee":7}]},{},[]);

return b('simple-select');
}));
