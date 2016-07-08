simple-select
=============

Autocomplete select component, supports html options data source, json data source or ajax remote data source.

### Usage

```html
<link rel="stylesheet" type="text/css" href="[style path]/select.css" />

<script type="text/javascript" src="[script path]/jquery.min.js"></script>
<script type="text/javascript" src="[script path]/module.js"></script>
<script type="text/javascript" src="[script path]/select.js"></script>

<select class="name-list">
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

### Options

__el__

Selector/Element/jQuery Object, Required, specify the select element to be initialized with.

__url__

String, the api url to get remote select options data. This option is required unless `el` option is present.

__cls__

String, extra html class to be added to wrapper element for style customization.

__onItemRender__

Function, callback function to be called when item renders in dropdown list with two params: item element and item data.

__placeholder__

String, set placeholder for input element. The default placeholder is the text of blank option if it exists.

__allowInput__

false/Selector/Element/jQuery Object, false by default, set an `input:text` element to allow input value outside the select options, .

__workWrap__

Boolean, false by default, set true to allow word wrap in input and dropdown list items.

__locales__

Hash, set custom locale texts for a single instance. If you want to set default locales for all simple-select instances, use `simple.select.locales` instead.


### Methods

__setItems__

(`Array` items), set select options by json data. The original options in select element will be overwrite.

__selectItem__

(`String`, value), set selected option by value.

__clear__

clear selected option and value of input.

__disable__

Disable component, user input is not allowed.

__enable__

Enable component, user input is accepted.

__destroy__

Destroy component, retore it to original state.

### Events

__select__

Triggered after some item is selected with two params: item data and item element.

**clear**

Triggered after `clear()` method is called or clear button is clicked.
