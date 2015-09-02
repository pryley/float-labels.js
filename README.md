# Float Labels v1.0.0

The float label pattern floats the inline label up above the input after the user focuses on the form field or enters a value.

For production, use the files from the `dist/` folder.

## Usage Example

```
jQuery( 'form' ).floatlabels();
```

## Options

Here are the default options

```
{
    regex       : /text|password|email|number|search|url|tel/,
    exclude     : [],
    customEvent : function(){},
    customLabel : function(){},
}
```

### regex:

This is a simple javascript regular expression that determines which input types to transform.

### exclude:

The is an array of ids or classes to exclude. (i.e. `['#countries, .simple-input']`).

Alternatively you can directly add a `.no-label` class to an input/select/textarea to exclude it.

### customEvent:

This callback fires just before setting the float label.

### customLabel:

This callback allows you to set a custom label to an input/select/textarea.

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

`v1.0.0` - [03/09/2015] initial release

## License

[MIT](/LICENSE)
