Simple Select
=============

[![Latest Version](https://img.shields.io/npm/v/simple-select.svg)](https://www.npmjs.com/package/simple-select)
[![Build Status](https://img.shields.io/travis/mycolorway/simple-select.svg)](https://travis-ci.org/mycolorway/simple-select)
[![Coveralls](https://img.shields.io/coveralls/mycolorway/simple-select.svg)](https://coveralls.io/github/mycolorway/simple-select)
[![David](https://img.shields.io/david/mycolorway/simple-select.svg)](https://david-dm.org/mycolorway/simple-select)
[![David](https://img.shields.io/david/dev/mycolorway/simple-select.svg)](https://david-dm.org/mycolorway/simple-select#info=devDependencies)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/mycolorway/simple-select)


Autocomplete select component, supports multiple select mode and ajax remote data source.

## Installation

Install via npm:

```bash
npm install --save simple-select
```

Install via bower:

```bash
bower install --save simple-select
```

## Usage

```html
<link rel="stylesheet" type="text/css" href="[style path]/select.css" />

<script type="text/javascript" src="[script path]/jquery.js"></script>
<script type="text/javascript" src="[script path]/simple-module.js"></script>
<script type="text/javascript" src="[script path]/simple-select.js"></script>

<select class="name-list" multiple="true">
    <option data-key="George Washington">George Washington</option>
    <option data-key="John Adams">John Adams</option>
    <option data-key="Thomas Jefferson">Thomas Jefferson</option>
</select>
```

```js
simple.select({
  el: '.name-list'
});
```

Note: if element is a `[multiple]` select, the multiple mode will be activated automatically.

## Options

__el__

Selector/Element/jQuery Object, Required, specify the select element to be initialized with.

__remote__

false/Hash, set a hash to enable remote data source mode. The hash may contain three key/value pairs:

```js
{
  url: 'xxx', // ajax api url, required
  searchKey: 'name', // param key for the user input search value, required
  params: {} // extra params passing to the server, optional
}
```

 This option is required unless `el` option is present.

__cls__

String, extra html class to be added to wrapper element for style customization.

__onItemRender__

Function, callback function to be called when item renders in dropdown list with two params: item element and item data.

__placeholder__

String, set placeholder for input element. The default placeholder is the text of blank option if it exists.

__allowInput__

false/Selector/Element/jQuery Object, false by default, set an `input:text` element to allow submit custom value outside select options. If you pass a selector, the `allowInput` element need be sibling of select element.

__noWrap__

Boolean, false by default, set true to allow word wrap in text field.

__locales__

Hash, set custom locale texts for a single instance. If you want to set default locales for all simple-select instances, use `simple.select.locales` instead.


## Methods

__selectItem__

(`String` value), set selected option by value.

__unselectItem__

(`String` value), remove selected option in multiple select mode.

__clear__

clear selected option and .

__disable__

Disable component, cannot make changes.

__enable__

Enable component.

__destroy__

Destroy component, restore element to original state.

## Events

__change__

Triggered when the selection is changed with selection data as param.

## Development

Clone repository from github:

```bash
git clone https://github.com/mycolorway/simple-select.git
```

Install npm dependencies:

```bash
npm install
```

Run default gulp task to build project, which will compile source files, run test and watch file changes for you:

```bash
gulp
```

Now, you are ready to go.

## Publish

If you want to publish new version to npm and bower, please make sure all tests have passed before you publish new version, and you need do these preparations:

* Check the version number in `bower.json` and `package.json`.

* Add new release information in `CHANGELOG.md`. The format of markdown contents will matter, because build scripts will get version and release content from this file by regular expression. You can follow the format of the older release information.

* Put your [personal API tokens](https://github.com/blog/1509-personal-api-tokens) in `/.token`, which is required by the build scripts to request [Github API](https://developer.github.com/v3/) for creating new release.

* Commit changes and push.

Now you can run `gulp publish` task, which will request Github API to create new release.

If everything goes fine, you can see your release at [https://github.com/mycolorway/simple-select/releases](https://github.com/mycolorway/simple-select/releases). At the End you can publish new version to npm with the command:

```bash
npm publish
```

Please be careful with the last step, because you cannot delete or republish a release on npm.
