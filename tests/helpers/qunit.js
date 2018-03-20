import { warn } from '@ember/debug';

let qunit = function deprecatedQunitHelper() {
    warn(
      "The ember-cli-simple-store `qunit` test helper has been moved. Please update your imports to `import { test } from 'ember-cli-simple-store/test-support/qunit';`",
      false,
      { id: 'ember-cli-simple-store.qunit-import' }
    );
}

export { qunit };
