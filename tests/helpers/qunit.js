import Ember from "ember";
import {test as qunitTest} from "qunit";

var test = function() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
    args[_key] = arguments[_key];
  }
  var callback;
  function wrapper() {
      let argz = arguments;
      Ember.run(function() {
          callback.apply(null, argz);
      });
  }
  callback = args.splice(1, 1, wrapper)[0];
  qunitTest.apply(null, args);
};

export { test };
