import Ember from "ember";

function clone(obj) {
    var copy = {};
    var factory = obj.get("constructor.ClassMixin.ownerConstructor");
    factory.eachComputedProperty(function (key, meta) {
        if (meta.isAttribute) {
            copy[key] = obj.get(key);
        }
    });
    return copy;
}

var attr = function() {
    var meta = {isAttribute: true};
    return function(key, value) {
        var data = this.get("$data") || {};
        if (arguments.length === 2) {
            if (!this.get("isDirty")) {
                var oldState = clone(this);
                this.set("_oldState", oldState);
            }
            this.set("isDirty", true);
            data[key] = value;
        }
        return data[key];
    }.property('$data').meta(meta);
};

var Model = Ember.Object.extend({
    init: function() {
        this.set('$data', {});
        this.set("isDirty", false);
    },
    rollback: function() {
        var oldState = this.get("_oldState");
        for(var key in oldState){
            this.set(key, oldState[key]);
        }
        this.set("isDirty", false);
    },
    save: function() {
        var oldState = clone(this);
        this.set("_oldState", oldState);
        this.set("isDirty", false);
    }
});

export { attr, Model };
