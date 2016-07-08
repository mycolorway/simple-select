(function() {
  var selectEl;

  selectEl = null;

  beforeEach(function() {
    console.log(jasmine.Ajax.install);
    return selectEl = $("<select id=\"select-one\">\n  <option value=\"0\" data-key=\"George Washington\">George Washington</option>\n  <option value=\"1\" data-key=\"John Adams\">John Adams</option>\n  <option value=\"2\" data-key=\"Thomas Jefferson\">Thomas Jefferson</option>\n</select>");
  });

  afterEach(function() {
    $(".simple-select").each(function() {
      return $(this).data("simpleSelect").destroy();
    });
    return $("select").remove();
  });

  describe('Simple Select', function() {
    it('should inherit from SimpleModule', function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      return expect(select instanceof SimpleModule).toBe(true);
    });
    it("should have three items if everything is ok", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      return expect($("body .simple-select .select-item").length).toBe(3);
    });
    it("should see one item if type some content", function() {
      var $selectedItem, select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      select.setValue('John');
      $selectedItem = select.list.find('.select-item.selected');
      return expect($selectedItem.length).toBe(1);
    });
    it("should set original select form element value according to select item", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      select.selectItem('1');
      expect(select.el.val()).toBe('1');
      select.clear();
      return expect(select.el.val()).toBeNull();
    });
    it("should work if use setItems to set items", function() {
      var select;
      $("<select id=\"select-two\"></select>").appendTo("body");
      select = simple.select({
        el: $("#select-two")
      });
      select.setItems([
        [
          "张三", "1", {
            "data-key": "zhangsan zs 张三"
          }
        ], [
          "李四", "2", {
            "data-key": "lisi ls 李四"
          }
        ], [
          "王麻子", "3", {
            "data-key": "wangmazi wmz 王麻子"
          }
        ]
      ]);
      return expect($("body .simple-select .select-item").length).toBe(3);
    });
    it('should not show option without value', function() {
      var select;
      selectEl.append('<option value></option>');
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      $(".link-expand").trigger("mousedown");
      return expect($("body .simple-select .select-item").length).toBe(3);
    });
    it('should always select default value if all options have value', function() {
      var select;
      selectEl.appendTo("body");
      selectEl.find('option[value="2"]').prop('selected', true);
      select = simple.select({
        el: $("#select-one")
      });
      return expect(select.el.val()).toBe('2');
    });
    it('should always select default value if one option has no value', function() {
      var select;
      selectEl.append('<option value></option>');
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      select.clear();
      select.input.blur();
      expect(select._allowEmpty).toBe(true);
      return expect(select.el.val()).toBe('');
    });
    it("should keep reference in el", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      return expect(selectEl.data('simpleSelect')).toBe(select);
    });
    return it("should destroy reference in el after destroy", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      select.destroy();
      return expect(selectEl.data('simpleSelect')).toBeUndefined();
    });
  });

}).call(this);
