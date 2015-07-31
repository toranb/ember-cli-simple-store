/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var funnel = require('broccoli-funnel');

var es5Shim = funnel('node_modules/es5-shim', {
    files: ['es5-shim.js'],
    destDir: '/assets'
});

/*
  This Brocfile specifes the options for the dummy test app of this
  addon, located in `/tests/dummy`

  This Brocfile does *not* influence how the addon or the app using it
  behave. You most likely want to be modifying `./index.js` or app's Brocfile
*/

var app = new EmberAddon();

module.exports = app.toTree([es5Shim]);
