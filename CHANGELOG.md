# Changelog

## [1.1.1](https://github.com/jburns24/53one/compare/v1.1.0...v1.1.1) (2025-04-26)


### Bug Fixes

* removed docker hub from docker metadata since I am only pushing to ghcr ([1fa6853](https://github.com/jburns24/53one/commit/1fa68532d3b76d84f989e78b074504229a6dbb0a))

## [1.1.0](https://github.com/jburns24/53one/compare/v1.0.0...v1.1.0) (2025-04-26)


### Features

* add octo-sts to release please ([c199555](https://github.com/jburns24/53one/commit/c19955598798207143615db543d7e1b5df748bda))


### Bug Fixes

* adds missing id-token permission ([f9b3237](https://github.com/jburns24/53one/commit/f9b32374630af71d7d04dcb943fa4438e97c30aa))
* remove unneeded permissions since switching to octo-sts ([c07e743](https://github.com/jburns24/53one/commit/c07e74330f975cc4bc50bbfe67b07643830d2d8f))
* updated bad subject_pattern in trust policy ([8dd3f04](https://github.com/jburns24/53one/commit/8dd3f04f9052b1a5f535761f6b6a413e7caf2ae0))

## 1.0.0 (2025-04-26)


### Features

* add celebratory confetti ([0bf97f7](https://github.com/jburns24/53one/commit/0bf97f70369e1921dd5a34da1abd3ba23e9b19d5))
* add form to enter workout information ([ab1c05c](https://github.com/jburns24/53one/commit/ab1c05cbf4c4d5cd95cf62bc98cced1387625dae))
* add histroy tracking ([a6ee71b](https://github.com/jburns24/53one/commit/a6ee71b8c6d04b45c24dff322588039fa8126dd8))
* add landing page ([ba3e7b2](https://github.com/jburns24/53one/commit/ba3e7b281d53abc8206b9424119b55568fe03f62))
* add release-please and workflows to push images to ghcr ([8e771c4](https://github.com/jburns24/53one/commit/8e771c43211c0a4c7193b35b9b64b99cb05e3aaa))
* add some basic testing ([280aa22](https://github.com/jburns24/53one/commit/280aa22e65aef5cfcb8033b0e041c674f167df9c))
* add tracking for AMRAP ([c0d280c](https://github.com/jburns24/53one/commit/c0d280c5159c53e8d93ac62d53a7e2797598acf3))
* added some test for business logic ([0009591](https://github.com/jburns24/53one/commit/000959119a380b688e9c95baee34999b2413ec07))
* adds darkmode ([1b7ec69](https://github.com/jburns24/53one/commit/1b7ec6965763bbc4ff1958d44d33d4f14e2be974))
* adds some more testing and a simple dockerfile ([15bc8d4](https://github.com/jburns24/53one/commit/15bc8d4805a7469a8ca70cb041abcf71e74df624))
* progress tracking added for each main workout ([333764d](https://github.com/jburns24/53one/commit/333764d6ca354c5077627a6ec8825d1cdb971c06))
* updated cycle complete logic so that you can increase on exercises that you finish but not on ones you dont ([435ec79](https://github.com/jburns24/53one/commit/435ec79d81d6c6de46b1f562dfa509e26ae21042))
* updated UI of 1RM ([7ee92bb](https://github.com/jburns24/53one/commit/7ee92bb3b7c2a963ca77647ff5da0884de276c48))


### Bug Fixes

* adds missing permission for release-please ([7114944](https://github.com/jburns24/53one/commit/71149447ad06309f52ebc289e4165763da1e2f34))
* deload week to not track AMRAP ([0fa62ee](https://github.com/jburns24/53one/commit/0fa62eeccad3c7dbd35a6e8668bb99d43f76b965))
* fixed bug in rounding for exercises ([cb4c9a1](https://github.com/jburns24/53one/commit/cb4c9a1706f8aea845bf2f08b6115a9fef688c26))
* fixed issues in rep count ([adacc63](https://github.com/jburns24/53one/commit/adacc63ef5254b43b876036f7f61d2acb3b7e030))
* resolve TypeScript errors in API endpoint tests ([013b891](https://github.com/jburns24/53one/commit/013b8916affca49e5b98b5c4fe42800848b2034a))
* specify release-type for release please ([525a420](https://github.com/jburns24/53one/commit/525a420c04b54228c0b37ad1ce2ff1d783ea691c))
* update bad branch reference ([4293498](https://github.com/jburns24/53one/commit/42934989221baa0d073d8cbeb85eec36d3ece70f))
* updated auth and db connections to be consistent and work in docker ([a9fcbcf](https://github.com/jburns24/53one/commit/a9fcbcfe1e2c88c70de11c85db95fa0ac12973c1))
* worked through auth issues with google ([4df0e3d](https://github.com/jburns24/53one/commit/4df0e3de212d2b5210dd6130a490043653f2dcec))
* write workouts to the db ([6bdf85f](https://github.com/jburns24/53one/commit/6bdf85f44a856a92bd56bcb0affe9fb1578955d4))
