(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-select', ["jquery","simple-module"], function (a0,b1) {
      return (root['select'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['select'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Select, select,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Select = (function(superClass) {
  extend(Select, superClass);

  function Select() {
    return Select.__super__.constructor.apply(this, arguments);
  }

  Select.prototype.opts = {
    el: null,
    url: null,
    remote: false,
    cls: "",
    onItemRender: $.noop,
    placeholder: "",
    allowInput: false,
    wordWrap: false,
    locales: null
  };

  Select.locales = {
    loading: 'Loading...',
    noResults: 'No results found'
  };

  Select._tpl = {
    wrapper: "<div class=\"simple-select\">\n  <span class=\"link-expand\">\n    <i class=\"icon-caret-down\"><span>&#9662;</span></i>\n  </span>\n  <span class=\"link-clear\">\n    <i class=\"icon-delete\"><span>&#10005;</span></i>\n  </span>\n  <div class=\"select-list\">\n  </div>\n</div>",
    item: "<div class=\"select-item\">\n  <a href=\"javascript:;\" class=\"label\"><span></span></a>\n  <span class=\"hint\"></span>\n</div>"
  };

  Select.prototype._init = function() {
    var ref;
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw "simple select: option el is required";
      return;
    }
    if ((ref = this.el.data("simpleSelect")) != null) {
      ref.destroy();
    }
    this.locales = $.extend({}, Select.locales, this.opts.locales);
    this._render();
    return this._bind();
  };

  Select.prototype._render = function() {
    this.el.hide().data("simpleSelect", this);
    this.wrapper = $(Select._tpl.wrapper).data("simpleSelect", this).addClass(this.opts.cls).insertBefore(this.el);
    if (this.opts.wordWrap) {
      this.wrapper.addClass('word-wrap');
      this.input = $('<textarea rows="1">');
    } else {
      this.input = $('<input type="text">');
    }
    this.input.addClass('select-result').attr('autocomplete', 'off').prependTo(this.wrapper);
    this.list = this.wrapper.find(".select-list");
    this._initItems();
    this.selectItem(this.el.val());
    if (this.opts.remote) {
      this.wrapper.addClass('allow-empty');
    }
    if (this.opts.wordWrap) {
      return this._autoresizeInput();
    } else {
      return this._positionList();
    }
  };

  Select.prototype._initItems = function() {
    var $groups, getItems;
    getItems = function($options) {
      var items;
      items = [];
      $options.each((function(_this) {
        return function(i, option) {
          var $option, attrs, newAttrs, value;
          $option = $(option);
          value = $option.val();
          if (!value) {
            return;
          }
          attrs = $option.data();
          if (!$.isEmptyObject(attrs)) {
            newAttrs = {};
            $.each(Object.keys(attrs), function(i, key) {
              return newAttrs["data-" + key] = attrs[key];
            });
            attrs = newAttrs;
          }
          return items.push([$option.text(), value, attrs]);
        };
      })(this));
      return items;
    };
    if (($groups = this.el.find('optgroup')).length > 0) {
      this.items = {};
      $groups.each((function(_this) {
        return function(i, group) {
          var $group;
          $group = $(group);
          return _this.items[$group.attr('label')] = getItems($group.find('option'));
        };
      })(this));
    } else {
      this.items = getItems(this.el.find('option'));
    }
    this._generateList(this.items);
    return this._checkBlankOption();
  };

  Select.prototype.setItems = function(items) {
    var renderOptions;
    renderOptions = function($container, items) {
      return $.each(items, (function(_this) {
        return function(i, item) {
          var $option;
          $option = $('<option>', $.extend({
            text: item[0],
            value: item[1]
          }, item.length > 2 ? item[2] : null));
          return $container.append($option);
        };
      })(this));
    };
    this.items = items;
    this.el.empty();
    if ($.isArray(items) && items.length > 0) {
      renderOptions(this.el, items);
    } else if ($.isPlainObject(items) && !$.isEmptyObject(items)) {
      $.each(items, (function(_this) {
        return function(groupName, groupItems) {
          var $group;
          $group = $("<optgroup>", {
            label: groupName
          });
          renderOptions($group, groupItems);
          return _this.el.append($group);
        };
      })(this));
    } else if (this.opts.remote) {
      this.el.append('<option>');
    }
    this._generateList(this.items);
    return this._checkBlankOption();
  };

  Select.prototype._checkBlankOption = function() {
    var $blankOption;
    $blankOption = this.el.find('option:not([value]), option[value=""]');
    this._allowEmpty = $blankOption.length > 0;
    this.wrapper.toggleClass('allow-empty', this._allowEmpty);
    return this._setPlaceholder($blankOption.text());
  };

  Select.prototype._setPlaceholder = function(placeholder) {
    placeholder || (placeholder = this.opts.placeholder);
    if (placeholder) {
      return this.input.attr("placeholder", placeholder);
    }
  };

  Select.prototype._generateList = function(items) {
    var $noResults, children, itemEl;
    itemEl = function(item) {
      var $itemEl, hint;
      $itemEl = $(Select._tpl.item).data('item', item);
      $itemEl.find(".label span").text(item[0]);
      $itemEl.attr('data-value', item[1]);
      if (item.length > 2 && (hint = item[2]['data-hint'])) {
        $itemEl.find(".hint").text(hint);
      }
      return $itemEl;
    };
    this.list.empty();
    children = [];
    if ($.isPlainObject(items) && !$.isEmptyObject(items)) {
      $.each(items, (function(_this) {
        return function(groupName, groupItems) {
          var $groupEl;
          $groupEl = $('<div class="select-group">');
          $groupEl.text(groupName);
          children.push($groupEl[0]);
          return $.each(groupItems, function(i, item) {
            var $itemEl;
            $itemEl = itemEl(item);
            children.push($itemEl[0]);
            if ($.isFunction(_this.opts.onItemRender)) {
              return _this.opts.onItemRender.call(_this, $itemEl, item);
            }
          });
        };
      })(this));
    } else if ($.isArray(items) && items.length > 0) {
      $.each(items, (function(_this) {
        return function(i, item) {
          var $itemEl;
          $itemEl = itemEl(item);
          if ($.isFunction(_this.opts.onItemRender)) {
            _this.opts.onItemRender.call(_this, $itemEl, item);
          }
          return children.push($itemEl[0]);
        };
      })(this));
    } else {
      $noResults = $('<div class="no-results"></div>').text(this.locales.noResults);
      children.push($noResults[0]);
    }
    return this.list.append(children);
  };

  Select.prototype.selectItem = function($item) {
    var item;
    if (!$item) {
      return;
    }
    if (typeof $item !== 'object') {
      $item = this.list.find(".select-item[data-value='" + $item + "']");
    }
    if (!($item.length > 0)) {
      return;
    }
    item = $item.data('item');
    this.input.val(item[0]);
    if (this.opts.remote) {
      this.list.empty();
    } else {
      this._generateList(this.items);
    }
    this.wrapper.addClass("selected");
    this._toggleList(false);
    this.el.val(item[1]);
    if (this.opts.allowInput) {
      $(this.opts.allowInput).val('');
    }
    this.triggerHandler("select", [item, $item]);
    this._autoresizeInput();
    return item;
  };

  Select.prototype.setValue = function(value) {
    this.input.val(value);
    return this._input();
  };

  Select.prototype._toggleList = function(expand) {
    if (expand == null) {
      expand = null;
    }
    if (expand === null) {
      expand = !this.wrapper.hasClass('expanded');
    }
    if (expand) {
      this.wrapper.addClass("expanded");
      return this._scrollToItem();
    } else {
      return this.wrapper.removeClass("expanded");
    }
  };

  Select.prototype._scrollToItem = function($item) {
    $item || ($item = this.list.find('.select-item.selected'));
    if ($item.length > 0) {
      return this.list.scrollTop($item.position().top);
    }
  };

  Select.prototype._bind = function() {
    this.wrapper.find(".link-clear").on("mousedown", (function(_this) {
      return function(e) {
        _this.clear();
        return false;
      };
    })(this));
    this.wrapper.find(".link-expand").on("mousedown", (function(_this) {
      return function(e) {
        _this._toggleList();
        if (!_this._focused) {
          _this.input.focus();
        }
        return false;
      };
    })(this));
    this.list.on("mousedown", ".select-item", (function(_this) {
      return function(e) {
        var $item;
        $item = $(e.currentTarget);
        _this.selectItem($item);
        _this.input.blur();
        return false;
      };
    })(this));
    return this.input.on("keydown.simple-select", (function(_this) {
      return function(e) {
        return _this._keydown(e);
      };
    })(this)).on("input.simple-select", (function(_this) {
      return function(e) {
        if (_this._inputTimer) {
          clearTimeout(_this._inputTimer);
          _this._inputTimer = null;
        }
        return _this._inputTimer = setTimeout(function() {
          return _this._input(e);
        }, 200);
      };
    })(this)).on("blur.simple-select", (function(_this) {
      return function(e) {
        return _this._blur(e);
      };
    })(this)).on("focus.simple-select", (function(_this) {
      return function(e) {
        return _this._focus(e);
      };
    })(this));
  };

  Select.prototype._validateInput = function() {
    var $item, value;
    if (this.wrapper.hasClass("selected")) {
      return;
    }
    if (value = $.trim(this.input.val())) {
      $item = this.list.find(".select-item:contains('" + value + "')");
      if (!($item.length > 0)) {
        $item = this.list.find('.select-item:first');
      }
      if ($item.length > 0) {
        return this.selectItem($item);
      } else if (this.opts.allowInput) {
        this.el.val('');
        return $(this.opts.allowInput).val(value);
      } else {
        return this.setValue('');
      }
    } else {
      this.el.val('');
      if (this.opts.allowInput) {
        return $(this.opts.allowInput).val('');
      }
    }
  };

  Select.prototype._keydown = function(e) {
    var $nextEl, $prevEl, $selectedEl;
    if (e.which === 40 || e.which === 38) {
      e.preventDefault();
      if (!this.wrapper.hasClass('expanded') || this.list.hasClass('empty')) {
        return;
      }
      $selectedEl = this.list.find(".select-item.selected");
      if (!($selectedEl.length > 0)) {
        this.list.find(".select-item:first").addClass("selected");
        return;
      }
      if (e.which === 38) {
        $prevEl = $selectedEl.prevAll(".select-item:first");
        if ($prevEl.length) {
          $selectedEl.removeClass("selected");
          $prevEl.addClass("selected");
        }
      } else if (e.which === 40) {
        $nextEl = $selectedEl.nextAll(".select-item:first");
        if ($nextEl.length) {
          $selectedEl.removeClass("selected");
          $nextEl.addClass("selected");
        }
      }
    } else if (e.which === 13) {
      e.preventDefault();
      if (this.wrapper.hasClass('expanded')) {
        $selectedEl = this.list.find(".select-item.selected");
        if ($selectedEl.length > 0) {
          return this.selectItem($selectedEl);
        } else {
          this._validateInput();
          return this._toggleList(false);
        }
      } else {
        return this.el.closest('form').submit();
      }
    } else if (e.which === 27) {
      e.preventDefault();
      return this.input.blur();
    } else if (e.which === 8 && this.wrapper.hasClass("selected")) {
      e.preventDefault();
      return this.setValue('');
    }
  };

  Select.prototype._input = function(e) {
    var filteredItems, obj, value;
    this._autoresizeInput();
    this.wrapper.removeClass("selected");
    this.el.val('');
    value = $.trim(this.input.val());
    if (this.opts.remote) {
      this.list.empty();
      this.el.empty().append('<option>');
      if (value) {
        $('<div class="loading"></div>').text(this.locales.loading).appendTo(this.list);
        return $.ajax({
          url: this.opts.remote.url,
          data: $.extend({}, this.opts.remote.params, (
            obj = {},
            obj["" + this.opts.remote.searchKey] = value,
            obj
          )),
          dataType: 'json'
        }).done((function(_this) {
          return function(items) {
            items || (items = []);
            if ($.isArray(items) && items.length > 50) {
              items = items.slice(0, 50);
            }
            _this.setItems(items);
            _this.list.find('.select-item:first').addClass('selected');
            return _this._toggleList(true);
          };
        })(this));
      } else {
        return this._toggleList(false);
      }
    } else {
      if (!this.wrapper.hasClass("expanded")) {
        this._toggleList(true);
      }
      if (value) {
        filteredItems = this._filterItems(value);
      } else {
        filteredItems = this.items;
      }
      this._generateList(filteredItems);
      return this.list.find('.select-item:first').addClass('selected');
    }
  };

  Select.prototype._filterItems = function(value) {
    var e, isMatched, items, re;
    try {
      re = new RegExp("(|\\s)" + value, "i");
    } catch (_error) {
      e = _error;
      re = new RegExp("", "i");
    }
    isMatched = function(item) {
      var filterKey;
      filterKey = (item.length > 2 && item[2]['data-key']) || item[0];
      return re.test(filterKey);
    };
    if ($.isPlainObject(this.items)) {
      items = {};
      $.each(this.items, (function(_this) {
        return function(groupName, groupItems) {
          return $.each(groupItems, function(i, item) {
            if (isMatched(item)) {
              items[groupName] || (items[groupName] = []);
              return items[groupName].push(item);
            }
          });
        };
      })(this));
    } else {
      items = [];
      $.each(this.items, (function(_this) {
        return function(i, item) {
          if (isMatched(item)) {
            return items.push(item);
          }
        };
      })(this));
    }
    return items;
  };

  Select.prototype._blur = function(e) {
    this._validateInput();
    this._toggleList(false);
    return this._focused = false;
  };

  Select.prototype._focus = function(e) {
    this._focused = true;
    if (this.opts.remote && (!this.input.val() || this.wrapper.hasClass('selected'))) {
      return;
    }
    this._toggleList(true);
    return setTimeout((function(_this) {
      return function() {
        return _this.input.select();
      };
    })(this));
  };

  Select.prototype.clear = function() {
    this.setValue('');
    this._toggleList(false);
    return this.triggerHandler("clear");
  };

  Select.prototype._autoresizeInput = function() {
    if (!this.opts.wordWrap) {
      return;
    }
    this.input.css("height", 0);
    this.input.css("height", parseInt(this.input[0].scrollHeight) + parseInt(this.input.css("border-top-width")) + parseInt(this.input.css("border-bottom-width")));
    return this._positionList();
  };

  Select.prototype._positionList = function() {
    return this.list.css('top', this.input.outerHeight() + 2);
  };

  Select.prototype.disable = function() {
    this.input.prop('disabled', true);
    this.el.prop('disabled', true);
    return this.wrapper.addClass('disabled');
  };

  Select.prototype.enable = function() {
    this.input.prop('disabled', false);
    this.el.prop('disabled', false);
    return this.wrapper.removeClass('disabled');
  };

  Select.prototype.destroy = function() {
    this.wrapper.remove();
    this.el.removeData('simpleSelect');
    return this.el.show();
  };

  return Select;

})(SimpleModule);

select = function(opts) {
  return new Select(opts);
};

select.locales = Select.locales;

return select;

}));
