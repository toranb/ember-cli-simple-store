import { run } from '@ember/runloop';
import { test as qunitTest } from 'qunit';

let test = function(...args) {

  function wrapper(assert) {
    // this is needed for maintaining scope in a test
    let env = assert.test.testEnvironment;
    run(() => {
      callback.apply(env, arguments);
    });
  }

  // callback is original function 
  let callback = args.splice(1, 1, wrapper)[0];

  // args is fixed with new wrapper function
  qunitTest.apply(null, args);

};

export { test };
