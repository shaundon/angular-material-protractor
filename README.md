# Angular Material Protractor

[![npm version](https://badge.fury.io/js/angular-material-protractor.svg)](https://badge.fury.io/js/angular-material-protractor)

A collection of utility functions to make testing Angular Material based UIs easier to test.

## Installation

```
npm install --save angular-material-protractor
```

## Usage

In your code:

```
// Import it.
const AMPtor = require('angular-material-protractor');

// Use it.
AMPtor.clickElementByModel('ctrl.myField');

// ..and so on
```

## Deploying to NPM

1. Update the changelog
1. Bump the version in `package.json`
1. commit + push changes
1. `npm publish`
1. `git tag [the version]`
1. `git push --tags`

Credits:
* [@shaundon](https://github.com/shaundon)
* [@sadams](https://github.com/sadams)
