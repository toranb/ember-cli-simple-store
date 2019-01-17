ember-cli-simple-store Changelog
==============================

5.9.4
-----

* [DEPENDENCY]: fix for ember v3.4+ ([#91](https://github.com/toranb/ember-cli-simple-store/pull/91))

5.9.3
-----

* [DEPENDENCY]: upgrade to ember v3.1.1

5.9.2
-----

* [WORKAROUND]: ember v3.1 compatability with proxy

5.9.1
-----

* [DEPENDENCY]: update ember-runtime-enumerable-includes-polyfill to 2.1.0

5.9.0
-----

* [DEPENDENCY]: upgrade to 3.0 ([#83](https://github.com/toranb/ember-cli-simple-store/pull/83))

* [UPDATE]: removed ember-uuid dependency ([commit](https://github.com/toranb/ember-cli-simple-store/commit/5c0fff4411b0641953882d11cb815bd8a0f6a58f))

5.8.0
-----

* [UPDATE]: testing updates ([#82](https://github.com/toranb/ember-cli-simple-store/pull/82))

5.7.0
-----

* [DEPENDENCY]: upgrade to ember 2.15.0 ([#80](https://github.com/toranb/ember-cli-simple-store/pull/80))

* [CLEANUP]: ember-codemod based on #176 RFC ([#80](https://github.com/toranb/ember-cli-simple-store/pull/80))

5.6.0
-----

* [DEPENDENCY]: upgrade to ember-cli v2.13.2
  ([#78](https://github.com/toranb/ember-cli-simple-store/pull/78))

5.5.0
-----

* [BUILD]: update to ember-cli v2.10.1
  ([#76](https://github.com/toranb/ember-cli-simple-store/pull/76))

* [BUG]: Change how dependent keys are registered on isDirty computed property
  ([#75](https://github.com/toranb/ember-cli-simple-store/pull/75))

* [EMBER]: upgraded to ember 1.13.13
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/365c30a2cbc731e33d9ea9dcfd3f28892f0ab2ff))

* [DEPRECATION]: use factoryFor
  ([#73](https://github.com/toranb/ember-cli-simple-store/pull/73))

5.4.0
-----

* [DOCS]: updated README to reflect pushArray api
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/b560d78f34751c7a483a435827549275dca152d5))

* [FEATURE]: added pushArray api
  ([#71](https://github.com/toranb/ember-cli-simple-store/pull/71))

5.3.0
-----

* [DEPENDENCY]: updated ember-getowner-polyfill
  ([#70](https://github.com/toranb/ember-cli-simple-store/pull/70))

* [UPDATE]: equal function to work with jquery && jquery 3.0 and above
  ([#68](https://github.com/toranb/ember-cli-simple-store/pull/68))

5.2.0
-----

* [BUG]: On willDestroy event set object/array refs are null
  ([#65](https://github.com/toranb/ember-cli-simple-store/pull/65))

5.1.0
-----

* [DEP WARNINGS]: fix w/ enumerable contains polyfill
  ([#64](https://github.com/toranb/ember-cli-simple-store/pull/64))


5.0.0
-----

* [CLEANUP]: removed find with filter dep warning
  ([#62](https://github.com/toranb/ember-cli-simple-store/pull/62))

* [FEATURE]: remove and clear invoke destroy on the record
  ([#61](https://github.com/toranb/ember-cli-simple-store/pull/61))


4.3.0
-----

* [BUG]: Fix coerceId function and push record with coerced ids
  ([#59](https://github.com/toranb/ember-cli-simple-store/pull/59))


4.2.0
-----

* [BUG]: Switch the names of the properties on a record proxy to avoid collisions with defined values
  ([#57](https://github.com/toranb/ember-cli-simple-store/pull/57))


4.1.0
-----

* [FEATURE]: Add support for custom id properties
  ([#53](https://github.com/toranb/ember-cli-simple-store/pull/53))


4.0.1
-----

* [DOCS]: added ember 2.4 example app to the readme
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/71f1b02517291b88738deb5d92f6d891d595802e))

* [DOCS]: Removing obsolete installation documentation
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/38e4a82c680662d65cbe3e556e065b162adf9919))


4.0.0
-----

* [DOCS]: updated the readme to be v4.0.0 friendly
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/1c7bbebf83a0cebca9bc5389f89670a3be6cb4dd))

* [DEPRECATION]: added find with filter api dep warning for 3rd arg
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/f0ac6db144f3597876ab3fdb203e2909f47c5ddd))

* [REFACTOR]: removed the unsubscribe api (never released) in favor of destroy
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/d1eeeb62f628b70d7a396178df6beb293809087c))

* [REFACTOR]: Unsubscribe on destroy of record array
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/22908b22932e99772fc87ce66b5831c4dc48788c))

* [REFACTOR]: Consider better compatability with ember-data
  ([#45](https://github.com/toranb/ember-cli-simple-store/issues/45))

* [REFACTOR]: Expose Store as an Ember Service
  ([#44](https://github.com/toranb/ember-cli-simple-store/issues/44))

* [REFACTOR]: Adding record proxy type
  ([#43](https://github.com/toranb/ember-cli-simple-store/issues/43))

* [REFACTOR]: Fixing run loop scheduling
  ([#40](https://github.com/toranb/ember-cli-simple-store/issues/40))

* [REFACTOR]: Removing bind and jQuery dep from store
  ([#39](https://github.com/toranb/ember-cli-simple-store/issues/39))

* [REFACTOR]: Creating types for record array proxy
  ([#37](https://github.com/toranb/ember-cli-simple-store/issues/37))

* [FEATURE]: v4.0.0 to improve performance
  ([#38](https://github.com/toranb/ember-cli-simple-store/issues/38))


3.6.0
-----

* [DOCS]: Update README.md
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/d7bc3808325785cd61f80707fb4db1e41c7e1d68))

* [FEATURE]: Conditionally disable initializer
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/edf2d41b60ab2959224146dee4169e9805189a7a))

* [DEPENDENCY]: Lock jQuery to 1.11.3
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/16de403f8b2eb7e3f115a83f8ff8f6402d02243c))

* [DOCS]: Fix readme examples
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/2de430133dd9345de0034124880bf1c42fcef451))


3.5.0
-----

* [REFACTOR]: removed the duplicate ArrayProxy (filter w/ object)
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/454e4e4e2ad7cd3cd5faf2ea76d71685af5cc1dd))


3.4.0
-----

* [DEPENDENCY]: more getOwner cleanup
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/3f1b88b2492eaf81ecba8bd67ce465d18a37c9f6))


3.3.0
-----

* [DEPENDENCY]: using getOwner to support ember 2.3
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/dc6ac20e82ecb1750e5c23041075f7a2b2893512))

* [REFACTOR]: cleaning up the computed properties
  ([#27](https://github.com/toranb/ember-cli-simple-store/pull/27))

* [DEPENDENCY]: update ember-cli and all other dependencies
  ([#26](https://github.com/toranb/ember-cli-simple-store/pull/26))


3.2.0
-----

* [TEST]: added unit and acceptance tests for isPrimed (starting null)
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/1e1e6d0231c1a3a34974d06ffe352ffc5215a2d5))

* [FEATURE]: replaced === undefined operator with Ember.isNone
  ([#21](https://github.com/toranb/ember-cli-simple-store/pull/21))


3.1.0
-----

* [DEPENDENCY]: removing container from the initializer for ember 2.1
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/1f68d63e445a83b9298d03c9bbf95af7b93680d7))


3.0.0
-----

* [FEATURE]: array proxy push returns record
  ([#19](https://github.com/toranb/ember-cli-simple-store/pull/19))

* [FEATURE]: array proxy now supports remove
  ([#18](https://github.com/toranb/ember-cli-simple-store/pull/18))

* [TEST]: added another array proxy push test to prove type is respected
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/f4353f9933983622d825438c94d662e955d95b3c))

* [FEATURE]: find(all) now returns array proxy
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/f8e8fa725237804b0f2ca972c12a91d77a226c33))


2.4.0
-----

* [FEATURE]: bound array proxy now supports push
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/4a73bd9bb5147cc17aedfdc22cbdd36b6c7b9e2f))

* [DEPENDENCY]: added es5Shim to test phantomJS w/ bind
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/4f46a392b3be0ec93864342ba2edddbd3430e293))


2.3.0
-----

* [BUG]: array attrs are now compared accurately
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/fd4b7dd7a8210cc4eb4da324a4a61e162ccf2ab7))


2.2.0
-----

* [DEPENDENCY]: updated ember-cli to 0.2.7
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/a4642351a3a93a264ad24710d0bcef70f91243db))

* [DEPENDENCY]: bumping bower version of ember to 1.12.1
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/d8683cd20a14fe19ccbe32f0842bea5d0fab0e2d))


2.1.0
-----

* [FEATURE]: added isNotDirty to allow for easy inverse template usage
  ([commit](https://github.com/toranb/ember-cli-simple-store/commit/b28514a9f5504f3ebf2c28afd253846b7bbe527e))


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
