# float-labels.js

[![GitHub version](https://badge.fury.io/gh/geminilabs%2Ffloat-labels.js.svg)](https://badge.fury.io/gh/geminilabs%2Ffloat-labels.js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/geminilabs/star-rating.js/blob/master/LICENSE)

A zero-dependency plugin that applies the float label pattern to a form.

The float label pattern floats the inline label up above the input after the user focuses on the form field or enters a value.

For production, use the files from the `dist/` folder.

## Installation

Use one of the following methods to add Float Labels to your project:

- [Download ZIP](https://github.com/geminilabs/float-labels.js/zipball/master)
- `yarn add float-labels.js`
- `npm install float-labels.js`
- `bower install float-labels.js`

## Usage

Load the `dist/float-labels.css` and `dist/float-labels.min.js` files somewhere on your page and then trigger the plugin as follows:

```js
// You may pass in a CSS selector, an HTMLElement or a DomList
var floatlabels = new FloatLabels( 'form', {
    // options go here
});
```

To re-initialize Float Labels after it has already been initialized (e.g. form fields have changed with ajax):

```js
floatlabels.rebuild();
```

To fully remove Float Labels, including all attached Event Listeners:

```js
floatlabels.destroy();
```

### HTML markup

Make sure your HTML markup is valid. Your form fields must have labels, the labels must have the `for` attribute which should have the same value as the field `id` attribute. Also input fields must have a `type` attribute.

```html
<label for="input-1">Enter a title</label>
<input type="text" id="input-1"/>

<label for="textarea-1">Enter some content</label>
<textarea id="textarea-1" placeholder="Placeholders are optional"></textarea>

<label for="select-1">Select an option</label>
<select id="select-1">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>
```

## Options

Here are the default options

```js
{
    customEvent      : null,
    customLabel      : null,
    customPlaceholder: null,
    exclude          : '.no-label',
    inputRegex       : /email|number|password|search|tel|text|url/,
    prefix           : 'fl-',
    prioritize       : 'label',
    requiredClass    : 'required',
    style            : 0,
    transform        : 'input, select, textarea',
}
```

1. Float Labels first looks at the `transform` option to know which element tags to transform.
2. Next, it filters all INPUT elements by the type found by the `inputRegex` option.
3. Finally, any resulting elements found in the `exclude` option are discarded.

### customEvent:

Type: `Function`

This function is run immediately after an element has been transformed by float-labels.

```js
customEvent: function( el ) {
    // do something
},
```

### customLabel

Type: `Function`

This function lets you modify the generated label text; it must return a string value.

```js
customLabel: function( labelEl, el ) {
    return labelEl.textContent;
},
```

### customPlaceholder

Type: `Function`

This function lets you modify the generated placeholder text; it must return a string value.

```js
customPlaceholder: function( placeholderText, el, labelEl ) {
    return placeholderText;
},
```

### exclude

Type: `String`

A comma-separated string of DOM selector elements to exclude.

### inputRegex

Type: `Regex`

Regex of INPUT types to transform.

### prefix

Type: `String`

The prefix of all the Float Label CSS classes.

If you change the prefix, you will need to either write your own custom CSS, or change the prefix option in the SCSS to match.

### prioritize

Type: `String`

Choose to prioritize either the label or placeholder text as the floating-label.

### requiredClass

Type: `String`

The class name of required elements (if not using the required attribute).

### style

Type: `Number|String`

Choose the style to use, the default value is either `0`, `1`, or `2`. This is used to create the Float Labels style classname (i.e. `.fl-style-1`). If you have created your own CSS style (i.e. `.fl-style-custom`), enter it here (i.e. `custom`).

### transform

Type: `String`

A comma-separated string of DOM elements to transform. Available options are: `input`, `select`, and `textarea`.

## Build

Float Labels uses [yarn](https://yarnpkg.com/) to manage package dependencies and [gulp](http://gulpjs.com/) to build from `src/`.

```bash
yarn
gulp
```

The compiled files will be saved in the `dist/` folder.

### Style Customization

Sass is used to build the stylesheet so you can `@import` the `src/float-labels.scss` file to compile it directly into your Sass project.

Following are the default sass values for Float Labels, they are contained in a map variable.

```sass
$float-labels-defaults: (
    base-height             : 24px,
    base-padding            : 6px,
    border-radius           : 3px,
    border-width            : 1px,
    margin-bottom           : 24px,
    color-background        : #fff,
    color-background-active : #fff,
    color-background-focus  : #fff,
    color-border            : #dfdfdf,
    color-border-active     : #dfdfdf,
    color-border-focus      : #1976D2,
    color-placeholder       : #bbb,
    color-required          : #D32F2F,
    color-text              : #444,
    color-text-focus        : #1976D2,
    line-height             : 1.5,
    font-size               : 16px,
    font-size-small         : 12px,
    font-weight             : 400,
    parent                  : '',
    prefix                  : 'fl-',
    transition-easing       : ease-in-out,
    transition-speed        : 0.2s,
);
```

To override any values with your own, simply create a new `$float-labels` map variable and include only the values you wish to change.

Important: Make sure you define `$float-labels` before you import the `src/float-labels.scss` file:

```sass
$float-labels: (
    border-radius      : 0,
    border-width       : 2px,
    color-border-focus : #009688,
    color-text-focus   : #009688,
    font-weight        : 700,
);

@import "../../node_modules/float-labels.js/src/float-labels"
```

### How to change CSS style priority

Sometimes existing CSS stylesheet rules will override the styling of Float Labels. To solve this problem, you can specify a "parent" option in the `$float-labels` map variable. This option value should be property such as an existing #id definition with a high priority/specificity.

In the following example, all Float Labels css rules will begin with `form#my-form`:

```sass
$float-labels: (
    parent: 'form#my-form',
);
```

The CSS rule `.fl-form label.fl-label { ... }` now becomes `form#my-form.fl-form label.fl-label { ... }`.

## Compatibility

- All modern browsers
- IE 10+

## Contributing

All changes should be committed to the files in `src/`.

## Changelog

`v3.3.6 - [2018-10-09]`
- Fixed issue [#29](https://github.com/geminilabs/float-labels.js/issues/29) Invalid CSS property ([@timelsass](https://github.com/timelsass))

`v3.3.5 - [2018-08-14]`
- Fixed issue [#27](https://github.com/geminilabs/float-labels.js/issues/27)

`v3.3.4 - [2018-05-25]`

- Fixed compatibility with IE10/Edge ([@bishsbytes](https://github.com/bishsbytes))
- Prevented SELECT elements with the "multiple" attribute from transforming

`v3.3.3 - [2018-01-30]`

- Expose FloatLabels as a module

`v3.3.2 - [2018-01-06]`

- Fixed issue [#16](https://github.com/geminilabs/float-labels.js/issues/16)

`v3.3.0 - [2017-11-11]`

- Added ability to accept a single Element ([@raysuelzer](https://github.com/raysuelzer))
- Handle inputs that have a value without the value attribute ([@raysuelzer](https://github.com/raysuelzer))

`v3.2.1 - [2017-10-27]`

- Added main property to package.json ([@joppuyo](https://github.com/joppuyo))

`v3.2.0 - [2017-08-21]`

- Added "customPlaceholder" callback option
- Fixed SELECT placeholder logic

`v3.1.0 - [2017-08-09]`

- Added change event for INPUT[type="file"]
- Removed "background-color" from .fl-style-2

`v3.0.3 - [2017-08-09]`

- Reset placeholder text on "destroy"

`v3.0.2 - [2017-08-08]`

- Added "rebuild" and "destroy" public methods
- Added ability to change the CSS class prefix
- Removed jQuery plugin as it's unnecessary
- Removed IE9 support

`v2.1.0 - [2017-08-07]`

- Added "parent" option in SCSS $float-labels-defaults to change the CSS rules priority.

`v2.0.2 - [2017-07-14]`

- Fixed usage of forEach method on a NodeList

`v2.0.1 - [2017-01-23]`

- Fixed jQuery plugin

`v2.0.0 - [2017-01-11]`

- added 2 new styles
- added new options
- re-written as a zero-dependency plugin

`v1.0.9 - [2016-08-06]`

- publish to npm

`v1.0.8 - [2016-01-31]`

- added "*-active" SCSS variables for borders and backgrounds
- fixed textarea font-size potentially differing from inputs/selects
- updated npm package dependancies

`v1.0.7 - [2015-09-23]`

- add the `placeholder=""` attribute from the label text if it doesn't exist
- add the `data-tooltip=""` attribute to the label if it exists
- new option `priority` for placeholder/label
- detect if field ID is not unique and handle label

`v1.0.6 - [2015-09-23]`

- skip a form element if related label is not found
- adjusted SCSS variables

`v1.0.0 - [2015-09-03]`

- initial release

## License

[MIT](/LICENSE)
