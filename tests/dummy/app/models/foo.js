import { attr, Model } from "ember-cli-simple-store/model";

export default Model.extend({
    init() {
      this._super(...arguments);
      this.bar = [];
    },
    name: attr(),
    funny: attr(false)
});
