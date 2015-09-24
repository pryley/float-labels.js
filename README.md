# Float Labels v1.0.7

This plugin applies the float label pattern to a form.

The float label pattern floats the inline label up above the input after the user focuses on the form field or enters a value.

For production, use the files from the `dist/` folder.

## Usage Example

```
<script src="js/jquery.min.js"></script>
<script src="js/float-labels.min.js"></script>

<link href="css/float-labels.css" rel="stylesheet">

<script>
	jQuery( 'form' ).floatlabels();
</script>
```

## Options

Here are the default options

```
{
    regex       : /text|password|email|number|search|url|tel/,
    exclude     : [],
    priority    : '',
    customEvent : function(){},
    customLabel : function(){},
}
```

### regex:

This is a simple javascript regular expression that determines which input types to transform.

Default: `regex: /text|password|email|number|search|url|tel/`

### exclude:

The is an array of ids or classes to exclude. (i.e. `exclude: ['#countries, .simple-input']`).

Alternatively you can directly add a `.no-label` class to an input/select/textarea to exclude it.

Default: `exclude: []`

### priority:

This value determines whether to place priority to the label or placeholder text.

If `priority: 'label'`, the field placeholder attribute will be replaced with the label text.

If `priority: 'placeholder'`, the label text will be replaced with field attribute placeholder text.

Default: `priority: ''`

### customEvent:

This callback fires just before setting the float label.

The method passes through the field object. i.e. `function( field ) {}`

Default: `customEvent: function(){}`

### customLabel:

This callback allows you to set a custom label to an input/select/textarea.

The method passes through the field object and the label string, and returns the custom label. i.e. `function( field, label ) { return modified_label; }`

Default: `customLabel: function(){}`

## Build

Float Labels uses `gulp` to build from src.

```
$ npm install
$ gulp
```

The compiled files will be saved in the `dist/` folder.

## Contributing

All changes should be committed to the files in `src/`.

## Changelog

`v1.0.0 - [03/09/2015]`

- initial release

`v1.0.6 - [23/09/2015]`

- skip a form element if related label is not found
- adjusted SCSS variables

`v1.0.7 - [23/09/2015]`

- add the `placeholder=""` attribute from the label text if it doesn't exist
- add the `data-tooltip=""` attribute to the label if it exists
- new option `priority` for placeholder/label
- detect if field ID is not unique and handle label

## License

[MIT](/LICENSE)
