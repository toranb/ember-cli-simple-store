import Store from "ember-cli-simple-store/store";

export default function(container, registry, keys) {
    var factory = window.require("ember/resolver")["default"];
    var resolver = factory.create({namespace: {modulePrefix: "dummy"}});
    registry.register("store:main", Store);
    keys.forEach(function(key) {
        var factory = resolver.resolve("dummy@" + key);
        registry.register(key, factory);
    });
    return container.lookup("store:main");
}
