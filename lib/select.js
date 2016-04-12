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
    cls: "",
    onItemRender: $.noop,
    placeholder: "",
    allowInput: false
  };

  Select.i18n = {
    "zh-CN": {
      all_options: "所有选项",
      clear_selection: "清除选择",
      loading: "加载中..."
    },
    "en": {
      all_options: "All options",
      clear_selection: "Clear Selection",
      loading: "Loading..."
    }
  };

  Select._tpl = {
    input: "<textarea rows=1 type=\"text\" class=\"select-result\" autocomplete=\"off\"></textarea>",
    item: "<div class=\"select-item\">\n  <a href=\"javascript:;\" class=\"label\"><span></span></a>\n  <span class=\"hint\"></span>\n</div>"
  };

  Select.prototype._init = function() {
    var ref;
    if (!this.opts.el) {
      throw "simple select: option el is required";
      return;
    }
    if ((ref = this.opts.el.data("select")) != null) {
      ref.destroy();
    }
    this._render();
    this._bind();
    return this.autoresizeInput();
  };

  Select.prototype._render = function() {
    var items;
    Select._tpl.select = "<div class=\"simple-select\">\n  <span class=\"link-expand\" title=\"" + (this._t('all_options')) + "\">\n    <i class=\"icon-caret-down\"><span>&#9662;</span></i>\n  </span>\n  <span class=\"link-clear\" title=\"" + (this._t('clear_selection')) + "\">\n    <i class=\"icon-delete\"><span>&#10005;</span></i>\n  </span>\n  <div class=\"select-list\">\n    <div class=\"loading\">" + (this._t('loading')) + "</div>\n  </div>\n</div>";
    this.el = $(this.opts.el).hide();
    this.el.data("select", this);
    this.select = $(Select._tpl.select).data("select", this).addClass(this.opts.cls).insertBefore(this.el);
    this.input = $(Select._tpl.input).attr("placeholder", this.opts.placeholder || this.el.data('placeholder') || "").prependTo(this.select);
    this.list = this.select.find(".select-list");
    this.requireSelect = true;
    items = this.el.find("option").map((function(_this) {
      return function(i, option) {
        var $option, label, value;
        $option = $(option);
        value = $option.attr('value');
        label = $option.text().trim();
        if (!value) {
          _this.requireSelect = false;
          return;
        }
        return $.extend({
          label: label,
          _value: value
        }, $option.data());
      };
    })(this)).get();
    if (this.requireSelect) {
      this.select.addClass('require-select');
    }
    return this.setItems(items);
  };

  Select.prototype._expand = function(expand) {
    if (expand === false) {
      this.input.removeClass("expanded");
      return this.list.hide();
    } else {
      this.input.addClass("expanded");
      if (this.items.length > 0) {
        this.list.show();
      }
      this.list.css("top", this.input.outerHeight() + 4);
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
        _this.clearSelection();
        return false;
      };
    })(this));
    this.select.find(".link-expand").on("mousedown", (function(_this) {
      return function(e) {
        _this._expand(!_this.input.hasClass("expanded"));
        if (!_this._focused) {
          _this.input.focus();
        }
        return false;
      };
    })(this));
    this.list.on("mousedown", (function(_this) {
      return function(e) {
        if (window.navigator.userAgent.toLowerCase().indexOf('msie') > -1) {
          _this._scrollMousedown = true;
          setTimeout(function() {
            return _this.input.focus();
          }, 0);
        }
        return false;
      };
    })(this)).on("mousedown", ".select-item", (function(_this) {
      return function(e) {
        var index;
        index = _this.list.find(".select-item").index($(e.currentTarget));
        _this.selectItem(index);
        _this.input.blur();
        return false;
      };
    })(this));
    this.input.on("keydown.select", (function(_this) {
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
    return this.select.on("mousedown", (function(_this) {
      return function(e) {
        return _this.input.focus();
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
          $itemEls.first().addClass("selected");
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
            $prevEl.addClass("selected");
          }
        } else if (e.which === 40) {
          $nextEl = $selectedEl.nextAll(".select-item:visible:first");
          if ($nextEl.length) {
            $selectedEl.removeClass("selected");
            $nextEl.addClass("selected");
          }
        }
      }
    } else if (e.which === 13) {
      e.preventDefault();
      if (this.input.hasClass("expanded")) {
        $selectedEl = this.list.find(".select-item.selected");
        if ($selectedEl.length) {
          index = this.list.find(".select-item").index($selectedEl);
          this.selectItem(index);
          return false;
        }
      } else if (this._selectedIndex > -1) {
        this.selectItem(this._selectedIndex);
      }
      if (this.opts.allowInput) {
        this.input.blur();
        return false;
      }
      this.clearSelection();
      return false;
    } else if (e.which === 27) {
      e.preventDefault();
      this.input.blur();
    } else if (e.which === 8) {
      if (this.select.hasClass("selected")) {
        this.clearSelection();
      }
      if (!this.input.hasClass("expanded")) {
        this._expand();
      }
    }
    return this.autoresizeInput();
  };

  Select.prototype._keyup = function(e) {
    var $itemEls;
    if ($.inArray(e.which, [13, 40, 38, 9, 27]) > -1) {
      return false;
    }
    this.autoresizeInput();
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
          if (_this.items.length > 0) {
            _this.list.show();
          }
          $itemEls.show().removeClass("selected");
          return;
        }
        try {
          re = new RegExp("(|\\s)" + value, "i");
        } catch (_error) {
          e = _error;
          re = new RegExp("", "i");
        }
        results = $itemEls.hide().removeClass("selected").filter(function() {
          return re.test($(this).data("key"));
        });
        if (results.length) {
          if (_this.items.length > 0) {
            _this.list.show();
          }
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
    if (!this.select.hasClass("selected")) {
      if (this.opts.allowInput) {
        this.el.val('');
        this.trigger('select', [
          {
            label: value,
            _value: -1
          }
        ]);
      } else if (value) {
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
          this.selectItem(Math.max(this._selectedIndex || -1, 0));
        }
      } else if (this.requireSelect && this.items.length > 0) {
        this.selectItem(0);
      } else {
        this.el.val('');
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
    var $itemEl, idx, it, item, j, k, len, len1, results1;
    if (!$.isArray(items)) {
      return;
    }
    this.items = items;
    if (!(items.length > 0)) {
      return;
    }
    this.list.find(".loading, .select-item").remove();
    for (j = 0, len = items.length; j < len; j++) {
      item = items[j];
      $itemEl = $(Select._tpl.item).data(item);
      $itemEl.find(".label span").text(item.label);
      $itemEl.find(".hint").text(item.hint);
      this.list.append($itemEl);
      if ($.isFunction(this.opts.onItemRender)) {
        this.opts.onItemRender.call(this, $itemEl, item);
      }
    }
    results1 = [];
    for (idx = k = 0, len1 = items.length; k < len1; idx = ++k) {
      it = items[idx];
      if (it._value === this.el.val()) {
        this.selectItem(idx);
        break;
      } else {
        results1.push(void 0);
      }
    }
    return results1;
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
      this.el.val(item._value);
      this.trigger("select", [item]);
      this.autoresizeInput();
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
    this.el.val('');
    this.trigger("clear");
    return this.autoresizeInput();
  };

  Select.prototype.autoresizeInput = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.input.css("height", 0);
        return _this.input.css("height", parseInt(_this.input.get(0).scrollHeight) + parseInt(_this.input.css("border-top-width")) + parseInt(_this.input.css("border-bottom-width")));
      };
    })(this), 0);
  };

  Select.prototype.disable = function() {
    this.input.prop("disabled", true);
    return this.select.find(".link-expand, .link-clear").hide();
  };

  Select.prototype.enable = function() {
    this.input.prop("disabled", false);
    return this.select.find(".link-expand, .link-clear").attr("style", "");
  };

  Select.prototype.destroy = function() {
    this.select.remove();
    this.el.removeData('select');
    return this.el.show();
  };

  return Select;

})(SimpleModule);

select = function(opts) {
  return new Select(opts);
};

return select;

}));
