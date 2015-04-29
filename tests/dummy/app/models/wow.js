import Ember from "ember";
import { attr, Model } from "ember-cli-simple-store/model";

export default Model.extend({
    name: attr(""),
    funny: attr()
});
