import Ember from "ember";
import { attr, Model } from "ember-cli-simple-store/model";

var onTimeout = function() {
    if(!this.isDestroyed) {
        var number = this.get("number");
        this.set("number", number + 1);
    }
    this.timer = Ember.run.later(onTimeout.bind(this), 100);
};

export default Model.extend({
    number: attr(),
    init() {
        this.timer = Ember.run.later(onTimeout.bind(this), 100);
        this._super();
    },
    observeNumber: Ember.observer("number", function() {
        var number = this.get("number");
        window.number = number + 1;
    }),
    willDestroy() {
        Ember.run.cancel(this.timer);
    }
});
