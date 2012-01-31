/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

"use strict";

var recur = require('../core').recur

exports['test stack overflow'] = function(assert) {
  var sum = recur(function(x, y) {
    return y > 0 ? sum(x + 1, y - 1) :
           y < 0 ? sum(x - 1, y + 1) :
           x
  })

  assert.equal(sum(-100, 1000000), 999900, 'finishes calculation')
}

if (module == require.main)
  require("test").run(exports);

})
