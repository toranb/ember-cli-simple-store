import SimpleStore from "ember-cli-simple-store/store";

export default function(owner, keys) {
    let factory = window.require("ember-resolver")["default"];
    let resolver = factory.create({ namespace: { modulePrefix: "dummy" }});

    owner.register("service:simple-store", SimpleStore);

    keys.forEach((key) => {
        owner.register(key, resolver.resolve("dummy@" + key));
    });

    return owner.lookup("service:simple-store");
}
