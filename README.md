# float-labels.js

[![GitHub version](https://badge.fury.io/gh/geminilabs%2Ffloat-labels.js.svg)](https://badge.fury.io/gh/geminilabs%2Ffloat-labels.js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/geminilabs/star-rating.js/blob/master/LICENSE)

A zero-dependency plugin that applies the float label pattern to a form.

The float label pattern floats the inline label up above the input after the user focuses on the form field or enters a value.

For production, use the files from the `dist/` folder.

## Usage

Load the `dist/float-labels.css` and `dist/float-labels.min.js` files somewhere on your page and then trigger the plugin as follows:

### Using vanilla javascript

```js
var floatlabels = new FloatLabels( 'form', {
    style: 1,
});
```

### Using jQuery

```js
jQuery( 'form' ).floatlabels({
    style: 1,
});
```

## Options

Here are the default options

```js
{
    customEvent  : null,
    customLabel  : null,
    exclude      : '.no-label',
    inputRegex   : /email|number|password|search|tel|text|url/,
    prioritize   : 'label',
    requiredClass: 'required',
    style        : 0,
    transform    : 'input, select, textarea',
}
```

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

This function lets you modify a label text; it must return a string.

```js
customLabel: function( labelEl, el ) {
    return labelEl.text;
},
```

### exclude

Type: `String`

A comma-separated string of DOM selector elements to exclude.

### inputRegex

Type: `Regex`

Regex of INPUT types to transform.

### prioritize

Type: `String`

Choose to prioritize either the label or placeholder text as the floating-label.

### requiredClass

Type: `String`

The class name of required elements (if not using the required attribute).

### style

Type: `Number`

Choose the style to use, value can be either `0`, `1`, or `2`.

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

## Contributing

All changes should be committed to the files in `src/`.

## Changelog

`v2.0.0 - [11/01/2017]`

- added 2 new styles
- added new options
- re-written to be a zero-dependency plugin

`v1.0.9 - [06/08/2016]`

- publish to npm

`v1.0.8 - [31/01/2016]`

- added "*-active" SCSS variables for borders and backgrounds
- fixed textarea font-size potentially differing from inputs/selects
- updated npm package dependancies

`v1.0.7 - [23/09/2015]`

- add the `placeholder=""` attribute from the label text if it doesn't exist
- add the `data-tooltip=""` attribute to the label if it exists
- new option `priority` for placeholder/label
- detect if field ID is not unique and handle label

`v1.0.6 - [23/09/2015]`

- skip a form element if related label is not found
- adjusted SCSS variables

`v1.0.0 - [03/09/2015]`

- initial release

## License

[MIT](/LICENSE)
