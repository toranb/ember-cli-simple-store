ember-cli-simple-store Changelog
==============================

2.0.0
-----

* [FEATURE]: attr now supports default value for dirty tracking
  ([#13](https://github.com/toranb/ember-cli-simple-store/pull/13))


1.0.4
-----

* [REFACTOR] removing prototype extensions
  ([#14](https://github.com/toranb/ember-cli-simple-store/pull/14))

* [DEPENDENCY] getting new dependencies and bumping versions
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/9f2e9b867edf99a4b0b49e087bf4f8408768e4a1))


1.0.3
-----

* [BUG] when setting field to empty string, model is not dirty
  ([#12](https://github.com/toranb/ember-cli-simple-store/pull/12))


1.0.2
-----

* [TEST]: adding test for save then immediate rollback
  ([#10](https://github.com/toranb/ember-cli-simple-store/pull/10))

* [BUG]: rollback is now idempotent
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/2d0cc9417b1bee7f674923906953045e8dc61a97))

* [PERIPHERAL]: updating to ember 1.11.3
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/aa572e44b1a9c057726ea9d5a5782e59cb7e5727))


1.0.1
-----

* [BUG]: isDirty should remain when undefined attr set to empty str
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/944f9c56d4282c6d9d887128ca9a8f45d81998fe))


1.0.0
-----

* [DOCS]: added changelog
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/d93349710094cd9fdc7cfb5775582f1cb36a4cfe))

* [DOCS]: updated the readme to show more example apps
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/0522f17209aed395de42e15175c8f7293f3944dd))

* [FEATURE]: findOne is now computed (w/ proxy'd methods)
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/b89b1808e45986e2bf9f29fea09f4df8cf5e6c12))

* [FEATURE]: findById is now computed (w/ proxy'd methods)
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/ab9c7dabe6da3efaa62480b96ccaecd1069f1e8b))


0.9.3
-----

* [DOCS]: updated readme with more modern examples
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/daa1b037fe550604a80bc92ab775ea563960157f))

* [TEST]: adding tests to show behavior when object with no "id" is pushed into store
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/212ba12cedda8721859d78e011405c6a6c049990))

0.9.2
-----

* [DOCS]: simplified the store how-to in the readme
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/39b75b67fa68e7f8e7c42058c8c00d28fa9d2fd5))

0.9.1
-----

* [FEATURE]: Dirty tracking
  ([#7](https://github.com/toranb/ember-cli-simple-store/pull/7))

* [REFACTOR]: fixing individual attrIsDirty check
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/558db91b818e22133f72d617821c1a402ea41d0b))

* [ENHANCEMENT]: updated model to store isPrimed separate from isDirty
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/5a861b997c257fceceff01ad078330c428c60086))

* [REFACTOR]: simplifying the isDirty computed property
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/cfdcdf9c3b1f30d1ed470db6a9dfe62b4b756123))

* [TEST]: adding test to show working with ints
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/e8277b130fdb390c9fa0f6c06753fd82679f8627))

* [ENHANCEMENT]: extracting isDirty property to computed property to be managed by model
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/52399c757053d97a26a24e712ccb0d483bbe8e9f))

* [DOCS]: added downloads and emberobserver score to the readme
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/aff3a5680962f23498afb0fece8277cac166370b))

0.7.1
-----

* [PERIPHERAL]: updating unit tests to avoid container dep warning
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/1fcc7001635f30907d14cf9ded7e60b8178774f7))

0.7.0
-----

* [FEATURE]: added the ability to pass a custom filter func to find
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/20822288fbf0c37879659f6ef9f7149bd1eb3e70))

* [BUILD]: setting up travis to run 0.12 and 0.10 versions of node
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/ab74ad171d0b8bd4531c8908e4c98e3feba1e973))

0.6.2
-----

* [DEPENDENCY]: upgrading ember to 1.11 beta 5
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/9e5ea860c89588ae5e5f5437ffa8315ca02174d9))

* [DEPENDENCY]: upgrading ember-cli to 0.2.0
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/27bee82aad7b1b52161e695564ece7461df120a6))

* [PERIPHERAL]: Updating package.json and bumping the version of ember-cli
  ([#2](https://github.com/toranb/ember-cli-simple-store/pull/2))

* [DOC]: updating the documentation for the new clear API
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/e0b976601041eba69eaa99afaa405482b4e3b7c9))

0.6.1
-----

* [DEPENDENCY]: upgrading ember-cli to 0.1.15
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/2d9944bb91b2770f3d175742947fabe0655c2273))

* [PERIPHERAL]: updating package.json
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/cae91b9d9a0e62751c55237e22a60219cc7912a5))

* [FEATURE]: Adding the ability to clear all types from store
  ([#1](https://github.com/toranb/ember-cli-simple-store/pull/1))

* [REFACTOR]: changes based on PR comments
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/9be10f8bdea08450a42eaec44250bb9ddc9dc484))

0.6.0
-----

* [ENHANCEMENT]: added the ability to remove all objects
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/25a6ae0d308e011b7f385de3aebd0ffc32153c19))

0.5.0
-----

* [FEATURE]: priming a model attr will not flip the dirty bit
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/c537a5858c2ad518e44f7a05c2500603e237df63))


0.4.1
-----

* [CLEANUP]: removed unnecessary return statement
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/c0e16247b2917e5ba81f9243b5d21a4ffdd17e47))

0.4.0
-----

* [FEATURE]: updated the isDirty api for property based access
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/9c198d764567678665b1d63ebee2383ba48008e0))

0.3.0
-----

* [DOCS]: added dirty tracking example app to the readme
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/081cd6a3450a987ae13c1ba21b6513aeb5fc80ae))

* [FEATURE]: added dirty tracking at the property level
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/5b0801263e73ee8ecc684200a0c93c000ffa3763))

0.2.1
-----

* [BUG]: fixed the global state leak found in the attr
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/b812ccacadae665226a3db7b9b88652754661772))

0.2.0
-----

* [FEATURE]: added dirty tracking attr and model
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/0f61e0a0cc5be916107b88b5ac918aa630130496))

0.1.1
-----

* [BUG]: updated initializer name to be store/removed ember-data
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/d16e84e97303223dace0add7235a76f3d09ea4f9))

* [DOCS]: updated the example app url
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/737eb7267fee5a3c4d17a1ad627537f4d4ae492f))

0.1.0
-----

* [FEATURE]: added findOne api
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/f7d35b9ce02ce65a633af2e1ec4092e0af6c5b96))

* [DOCS]: updated the readme to fix a formatting issue
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/df7eb0f4f40cc1c9fa1c35da0258bff20dd276e0))

* [DOCS]: updated the readme to further define the api documentation
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/36a5aa5e3179eaa777b569766ae8c1c1c38b3172))

* [DOCS]: updated the readme to fix travis-ci build status image
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/08c65db8be2b9e9c08192c48a96d9c66e1458c3f))

* [DOCS]: updated the readme to show the api is 4 methods
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/3ca803e6c5e43a776343e70d2951f922b849c5cd))

* [DOCS]: updated the readme to call out that you must remove ember-data
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/4f0d6951c321c021fbe3f60cf072e4a4cebdae8b))

* [INIT]: init addon commit
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/1d56e42710f20d1ea06d5d2c8cb891329d8d9d55))
