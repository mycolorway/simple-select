(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-select', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['select'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Select, select,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Select = (function(_super) {
  __extends(Select, _super);

  function Select() {
    return Select.__super__.constructor.apply(this, arguments);
  }

  Select.prototype.opts = {
    el: null,
    items: null,
    cls: "",
    onItemRender: $.noop,
    placeholder: ""
  };

  Select.i18n = {
    "zh-CN": {
      all_options: "所有选项",
      clear_selection: "清除选择",
      loading: "正在加载数据"
    },
    "en": {
      all_options: "All options",
      clear_selection: "Clear Selection",
      loading: "loading"
    }
  };

  Select._tpl = {
    select: "<div class=\"simple-select\">\n  <span class=\"link-expand\" title=\"" + (Select.prototype._t('all_options')) + "\">\n    <i class=\"fa fa-caret-down\"></i>\n  </span>\n  <span class=\"link-clear\" title=\"" + (Select.prototype._t('clear_selection')) + "\">\n    <i class=\"fa fa-times\"></i>\n  </span>\n  <div class=\"select-list\">\n    <div class=\"loading\">" + (Select.prototype._t('loading')) + "...</div>\n  </div>\n</div>",
    input: "<input type=\"text\" class=\"select-result\" autocomplete=\"off\">",
    item: "<div class=\"select-item\">\n  <a href=\"javascript:;\" class=\"label\"><span></span></a>\n</div>"
  };

  Select.prototype._init = function() {
    var _ref;
    if (!this.opts.el) {
      throw "simple select: option el is required";
      return;
    }
    if ((_ref = this.opts.el.data("select")) != null) {
      _ref.destroy();
    }
    this._render();
    return this._bind();
  };

  Select.prototype._render = function() {
    var items;
    this.el = $(this.opts.el).hide();
    this.select = $(Select._tpl.select).data("select", this).addClass(this.opts.cls).insertAfter(this.el);
    this.input = $(Select._tpl.input).attr("placeholder", this.el.data("placeholder") || this.opts.placeholder).prependTo(this.select);
    this.list = this.select.find(".select-list");
    if (this.opts.items) {
      items = this.opts.items;
    } else {
      items = this.el.find("option").map(function() {
        return $.extend({
          label: $(this).text().trim()
        }, $(this).data());
      }).get();
    }
    return this.setItems(items);
  };

  Select.prototype._expand = function(expand) {
    if (expand === false) {
      this.input.removeClass("expanded");
      return this.list.hide();
    } else {
      this.input.addClass("expanded");
      this.list.show();
      if (this._selectedIndex > -1) {
        return this._scrollToSelected();
      }
    }
  };

  Select.prototype._scrollToSelected = function() {
    var $selectedEl;
    if (this._selectedIndex < 0) {
      return;
    }
    $selectedEl = this.list.find(".select-item").eq(this._selectedIndex);
    return this.list.scrollTop($selectedEl.position().top);
  };

  Select.prototype._bind = function() {
    this.select.find(".link-clear").on("mousedown", (function(_this) {
      return function(e) {
        if (_this.input.is("[disabled]")) {
          return false;
        }
        _this.clearSelection();
        return false;
      };
    })(this));
    this.select.find(".link-expand").on("mousedown", (function(_this) {
      return function(e) {
        if (_this.input.is("[disabled]")) {
          return false;
        }
        _this._expand(!_this.input.hasClass("expanded"));
        if (!_this._focused) {
          _this.input.focus();
        }
        return false;
      };
    })(this));
    this.list.on("mousedown", (function(_this) {
      return function(e) {
        if (simple.util.browser.msie) {
          _this._scrollMousedown = true;
          setTimeout(function() {
            return _this.input.focus();
          }, 0);
        }
        return false;
      };
    })(this)).on("mousewheel", function(e, delta) {
      $(this).scrollTop($(this).scrollTop() - 25 * delta);
      return false;
    }).on("mousedown", ".select-item", (function(_this) {
      return function(e) {
        var index;
        index = _this.list.find(".select-item").index($(e.currentTarget));
        _this.selectItem(index);
        _this.input.blur();
        return false;
      };
    })(this));
    return this.input.on("keydown.select", (function(_this) {
      return function(e) {
        return _this._keydown(e);
      };
    })(this)).on("keyup.select", (function(_this) {
      return function(e) {
        return _this._keyup(e);
      };
    })(this)).on("blur.select", (function(_this) {
      return function(e) {
        return _this._blur(e);
      };
    })(this)).on("focus.select", (function(_this) {
      return function(e) {
        return _this._focus(e);
      };
    })(this));
  };

  Select.prototype._keydown = function(e) {
    var $itemEls, $nextEl, $prevEl, $selectedEl, index;
    if (!(this.items && this.items.length)) {
      return;
    }
    if (this.triggerHandler(e) === false) {
      return;
    }
    if (e.which === 40 || e.which === 38) {
      if (!this.input.hasClass("expanded")) {
        this._expand();
        $itemEls = this.list.find(".select-item").show();
        if (this._selectedIndex < 0) {
          return $itemEls.first().addClass("selected");
        }
      } else {
        $selectedEl = this.list.find(".select-item.selected");
        if (!$selectedEl.length) {
          this.list.find(".select-item:first").addClass("selected");
          return;
        }
        if (e.which === 38) {
          $prevEl = $selectedEl.prevAll(".select-item:visible:first");
          if ($prevEl.length) {
            $selectedEl.removeClass("selected");
            return $prevEl.addClass("selected");
          }
        } else if (e.which === 40) {
          $nextEl = $selectedEl.nextAll(".select-item:visible:first");
          if ($nextEl.length) {
            $selectedEl.removeClass("selected");
            return $nextEl.addClass("selected");
          }
        }
      }
    } else if (e.which === 13) {
      e.preventDefault();
      if (this.input.hasClass("expanded")) {
        $selectedEl = this.list.find(".select-item.selected");
        if ($selectedEl.length) {
          index = this.list.find(".select-item").index($selectedEl);
          return this.selectItem(index);
        } else {
          return this.clearSelection();
        }
      } else if (this._selectedIndex > -1) {
        return this.selectItem(this._selectedIndex);
      } else {
        return this.clearSelection();
      }
    } else if (e.which === 27) {
      e.preventDefault();
      return this.input.blur();
    } else if (e.which === 27) {
      if (this.select.hasClass("selected")) {
        this.clearSelection();
      }
      if (!this.input.hasClass("expanded")) {
        return this._expand();
      }
    }
  };

  Select.prototype._keyup = function(e) {
    var $itemEls;
    if ($.inArray(e.which, [13, 40, 38, 9, 27]) > -1) {
      return false;
    }
    if (this._keydownTimer) {
      clearTimeout(this._keydownTimer);
      this._keydownTimer = null;
    }
    $itemEls = this.list.find(".select-item");
    return this._keydownTimer = setTimeout((function(_this) {
      return function() {
        var re, results, value;
        if (!_this.input.hasClass("expanded")) {
          _this._expand();
        }
        if (_this.select.hasClass("selected")) {
          _this.select.removeClass("selected");
        }
        value = $.trim(_this.input.val());
        if (!value) {
          _this.list.show();
          $itemEls.show().removeClass("selected");
          return;
        }
        try {
          re = new RegExp("(^|\\s)" + value, "i");
        } catch (_error) {
          e = _error;
          re = new RegExp("", "i");
        }
        results = $itemEls.hide().filter(function() {
          return re.test($(this).data("key"));
        });
        if (results.length) {
          _this.list.show();
          return results.show().first().addClass("selected");
        } else {
          return _this.list.hide();
        }
      };
    })(this), 0);
  };

  Select.prototype._blur = function(e) {
    var matchIdx, value;
    if (this._scrollMousedown) {
      this._scrollMousedown = false;
      return false;
    }
    this.input.removeClass("expanded error");
    this.list.hide().find(".select-item").show().removeClass("selected");
    value = $.trim(this.input.val());
    if (!this.select.hasClass("selected") && value) {
      matchIdx = -1;
      $.each(this.items, function(i, item) {
        if (item.label === value) {
          matchIdx = i;
          return false;
        }
      });
      if (matchIdx >= 0) {
        this.selectItem(matchIdx);
      } else {
        this.input.addClass("error");
      }
    }
    return this._focused = false;
  };

  Select.prototype._focus = function(e) {
    this._expand();
    if (this._selectedIndex > -1) {
      this.list.find(".select-item").eq(this._selectedIndex).addClass("selected");
    }
    setTimeout((function(_this) {
      return function() {
        return _this.input.select();
      };
    })(this), 0);
    return this._focused = true;
  };

  Select.prototype.setItems = function(items) {
    var $itemEl, item, _i, _len, _results;
    if (!($.isArray(items) && items.length)) {
      return;
    }
    this.items = items;
    this.list.find(".loading, .select-item").remove();
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      $itemEl = $(Select._tpl.item).data(item);
      $itemEl.find(".label span").text(item.label);
      this.list.append($itemEl);
      if ($.isFunction(this.opts.onItemRender)) {
        _results.push(this.opts.onItemRender.call(this, $itemEl, item));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Select.prototype.selectItem = function(index) {
    var item;
    if (!this.items) {
      return;
    }
    if ($.isNumeric(index)) {
      if (index < 0) {
        return;
      }
      item = this.items[index];
      this.select.addClass("selected");
      this.input.val(item.label).removeClass("expanded error");
      this.list.hide().find(".select-item").eq(index).addClass("selected");
      this._selectedIndex = index;
      this.trigger("select", [item]);
    }
    if (this._selectedIndex > -1) {
      return this.items[this._selectedIndex];
    }
  };

  Select.prototype.clearSelection = function() {
    this.input.val("").removeClass("expanded error");
    this.select.removeClass("selected");
    this.list.hide().find(".select-item").show().removeClass("selected");
    this._selectedIndex = -1;
    return this.trigger("clear");
  };

  Select.prototype.destroy = function() {
    this.select.remove();
    return this.el.show();
  };

  return Select;

})(SimpleModule);

select = function(opts) {
  return new Select(opts);
};


return select;


}));

