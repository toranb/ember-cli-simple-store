/* eslint-env node */
module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "browser_args": {
    "Chrome": {
      "mode": "ci",
      "args": [ '--headless', '--disable-gpu', '--remote-debugging-port=9222' ]
    }
  },
  "launch_in_ci": [
    "Chrome"
  ],
  "launch_in_dev": [
    "Chrome",
    "Firefox"
  ]
};
