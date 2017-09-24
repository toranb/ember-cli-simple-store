import { run } from '@ember/runloop';
import { test as qunitTest } from "qunit";

let test = function() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
    args[_key] = arguments[_key];
  }
  let callback;
  function wrapper() {
      let argz = arguments;
      run(function() {
          callback.apply(null, argz);
      });
  }
  callback = args.splice(1, 1, wrapper)[0];
  qunitTest.apply(null, args);
};

export { test };
