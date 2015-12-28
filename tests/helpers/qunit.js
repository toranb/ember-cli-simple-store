import Ember from "ember";
import {test} from "qunit";
import {module as qunitModule} from "qunit";

var module = function(name, settings){
    settings = settings || {};
    qunitModule(name, {
        beforeEach: function() {
            this.registry = new Ember.Registry();
            this.container = this.registry.container();
            if(typeof settings.beforeEach === "function") {
                return settings.beforeEach.apply(this, arguments);
            }
        },
        afterEach: function() {
            this.container = null;
            this.registry = null;
            if(typeof settings.afterEach === "function") {
                return settings.afterEach.apply(this, arguments);
            }
        }
    });
};

export { module, test };
