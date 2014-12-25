(function() {
  var selectEl;

  selectEl = $("<select id=\"select-one\">\n  <option value=\"0\" data-key=\"George Washington\">George Washington</option>\n  <option value=\"1\" data-key=\"John Adams\">John Adams</option>\n  <option value=\"2\" data-key=\"Thomas Jefferson\">Thomas Jefferson</option>\n</select>");

  afterEach(function() {
    $(".simple-select").each(function() {
      return $(this).data("select").destroy();
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
    it("should see select if everything is ok", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      return expect($("body .simple-select").length).toBe(1);
    });
    it("should see throw error if no content", function() {
      return expect(simple.select).toThrow();
    });
    it("should have three items if everything is ok", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      return expect($("body .simple-select .select-item").length).toBe(3);
    });
    it("should see one item if type some content", function(done) {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      $(".select-result").val("John").trigger("keyup");
      return setTimeout(function() {
        var target;
        target = $("body .simple-select .select-item:visible");
        expect(target.length && target.hasClass("selected")).toBe(true);
        return done();
      }, 10);
    });
    it("should set original select form element value according to select item", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      select.selectItem(1);
      expect(select.el.val()).toBe('1');
      select.clearSelection();
      return expect(select.el.val()).toBe(null);
    });
    it("should see 'select-list' if click 'link-expand'", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      $(".link-expand").trigger("mousedown");
      return expect($("body .simple-select .select-list:visible").length).toBe(1);
    });
    it("should have value if select item", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      $(".select-item:first").trigger("mousedown");
      return expect($(".select-result").val().length).toBeGreaterThan(0);
    });
    it("should remove selected' if click 'link-clear'", function() {
      var select;
      selectEl.appendTo("body");
      select = simple.select({
        el: $("#select-one")
      });
      $(".select-item:first").trigger("mousedown");
      $(".link-clear").trigger("mousedown");
      return expect($(".select-result").val().length).toBe(0);
    });
    return it("should work if use setItems to set items", function() {
      var select;
      $("<select id=\"select-two\"></select>").appendTo("body");
      select = simple.select({
        el: $("#select-two")
      });
      select.setItems([
        {
          label: "张三",
          key: "zhangsan zs 张三",
          id: "1"
        }, {
          label: "李四",
          key: "lisi ls 李四",
          id: "2"
        }, {
          label: "王麻子",
          key: "wangmazi wmz 王麻子",
          id: "3"
        }
      ]);
      return expect($("body .simple-select .select-item").length).toBe(3);
    });
  });

}).call(this);
