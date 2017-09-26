import { attr, Model } from "ember-cli-simple-store/model";

let CustomKeyModel = Model.extend({
    name: attr()
});

CustomKeyModel.reopenClass({
    primaryKey: 'arbitraryKey'
});

export default CustomKeyModel;
