(function() {
  describe('Simple Select', function() {
    return it('should inherit from SimpleModule', function() {
      var select;
      select = simple.select({
        el: $("input")
      });
      return expect(select instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
