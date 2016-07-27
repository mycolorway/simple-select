;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(<%= dependencies.cjs %>);
  } else {
    root.<%= name %> = factory(<%= dependencies.global %>);
    root.simple = root.simple || {};
    root.simple.select = function (opts) {
      return new root.<%= name %>(opts);
    }
    root.simple.select.locales = root.<%= name %>.locales;
  }
}(this, function (<%= dependencies.params %>) {
var define, module, exports;
var b = <%= contents %>
return b('<%= filename %>');
}));
