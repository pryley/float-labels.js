/*!
 * Float Labels
 *
 * Version: 2.0.0
 * Author: Paul Ryley (http://geminilabs.io)
 * URL: https://github.com/geminilabs/float-labels.js
 * License: MIT
 */

/** global: Option */

;(function( window, document, undefined )
{
	"use strict";

	var $ = window.jQuery || window.Zepto || window.$;

	var Plugin = function( el, options )
	{
		this.el = el;
		this.options = options;
		this.prefix = 'fl-';

		this.init();
	};

	Plugin.prototype = {

		defaults: {
			customEvent  : null,
			customLabel  : null,
			exclude      : '.no-label',
			inputRegex   : /email|number|password|search|tel|text|url/,
			prioritize   : 'label', // label|placeholder
			requiredClass: 'required',
			styledForm   : true,
			transform    : 'input,select,textarea'
		},

		init: function()
		{
			var _this = this;

			document.querySelectorAll( this.el ).forEach( function( form ) {

				_this.config = _this.extend( {}, _this.defaults, _this.options, form.getAttribute( 'data-options' ));

				var exclude = _this.sprintf( ':not($0)', _this.config.exclude.split(/[\s,]+/).join( '):not(' ));

				_this.on( 'reset', form, _this.onReset.bind( _this ));

				_this.addClass( form, _this.prefixed( 'form' ));

				if( _this.config.styledForm ) {
					_this.addClass( form, _this.prefixed( 'has-style' ));
				}

				_this.config.transform.split(/[\s,]+/).forEach( function( tag ) {
					form.querySelectorAll( tag + exclude ).forEach( function( el ) {
						_this.floatLabel( form, el );
					});
				});
			});
		},

		floatLabel: function( form, el )
		{
			if( !el.getAttribute( 'id' ) ||
				this.hasClass( el.parentNode, this.prefixed( 'wrap' )) || (
				el.tagName === 'INPUT' && !this.config.inputRegex.test( el.getAttribute( 'type' ))
			))return;

			var labelEl = this.getLabel( el, form );

			if( !labelEl )return;

			this.addClass( labelEl, this.prefixed( 'label' ));
			this.addClass( el, this.prefixed( el.tagName.toLowerCase() ));

			this.setLabel( labelEl, el );
			this.wrapLabel( labelEl, el );

			// call the custom defined event
			if( typeof this.config.customEvent === 'function' ) {
				this.config.customEvent.call( this, el );
			}

			// events
			this.on( 'blur', el, this.onBlur.bind( this ));
			this.on( 'input', el, this.onChange.bind( this ));
			this.on( 'focus', el, this.onFocus.bind( this ));
		},

		getLabel: function( el, form )
		{
			var label = this.sprintf( 'label[for="$0"]', el.getAttribute( 'id' ));
			var labelEl = form.querySelectorAll( label );

			// check for multiple labels with identical 'for' attributes
			if( labelEl.length > 1 ) {
				labelEl = el.parentNode.querySelectorAll( label );
			}

			if( labelEl.length === 1 ) {
				return labelEl[0];
			}

			return false;
		},

		setLabel: function( labelEl, el )
		{
			var labelText = labelEl.textContent.replace( /[*:]/g, '' ).trim();
			var placeholder = el.getAttribute( 'placeholder' );

			if( !labelText || ( labelText && placeholder && this.config.prioritize === 'placeholder' )) {
				labelText = placeholder;
			}

			// call the custom defined label event
			if( typeof this.config.customLabel === 'function' ) {
				var customLabel = this.config.customLabel.call( this, labelEl, el );
				if( customLabel !== undefined ) {
					labelText = customLabel;
				}
			}

			labelEl.text = labelText;

			// add a placholder option to the select if it doesn't already exist
			if( el.tagName === 'SELECT' ) {
				if( el.firstElementChild.value !== '' ) {
					el.insertBefore( new Option( labelText, '', true, true ), el.firstElementChild );
				}
				else if( el.firstElementChild.value === '' && el.options[0].text === '' ) {
					el.firstElementChild.text = labelText;
				}
			}
			// add a textarea/input placeholder attribute if it doesn't exist
			else if( !placeholder || this.config.prioritize === 'label' ) {
				el.setAttribute( 'placeholder', labelText );
			}
		},

		wrapLabel: function( labelEl, el )
		{
			var wrapper = this.createEl( 'div', {
				class: this.prefixed( 'wrap' ) + ' ' + this.prefixed( 'wrap-' + el.tagName.toLowerCase() ),
			});

			if( el.value.length ) {
				this.addClass( wrapper, this.prefixed( 'is-active' ));
			}

			if( el.getAttribute( 'required' ) !== null || this.hasClass( el, this.config.requiredClass )) {
				this.addClass( wrapper, this.prefixed( 'is-required' ));
			}

			el.parentNode.insertBefore( wrapper, el );

			wrapper.appendChild( labelEl );
			wrapper.appendChild( el );
		},

		onBlur: function( ev )
		{
			this.removeClass( ev.target.parentNode, this.prefixed( 'has-focus' ));
		},

		onChange: function( ev )
		{
			var event = ev.target.value.length ? 'add' : 'remove';
			this[event + 'Class']( ev.target.parentNode, this.prefixed( 'is-active' ));
		},

		onFocus: function( ev )
		{
			this.addClass( ev.target.parentNode, this.prefixed( 'has-focus' ));
		},

		onReset: function( ev )
		{
			var _this = this;

			this.config.transform.split(/[\s,]+/).forEach( function( tag ) {
				ev.target.querySelectorAll( tag ).forEach( function( el ) {
					_this.removeClass( el.parentNode, _this.prefixed( 'is-active' ));
				});
			});
		},

		addClass: function( el, className )
		{
			if( el.classList ) {
				el.classList.add( className );
			}
			else if( !this.hasClass( el, className )) {
				el.className += ' ' + className;
			}
		},

		hasClass: function( el, className )
		{
			if( el.classList ) {
				return el.classList.contains( className );
			}

			return new RegExp( '\\b' + className + '\\b' ).test( el.className );
		},

		removeClass: function( el, className )
		{
			if( el.classList ) {
				el.classList.remove( className );
			}
			else {
				el.className = el.className.replace( new RegExp( '\\b' + className + '\\b', 'g' ), '' );
			}
		},

		event: function( action, event, el, handler )
		{
			event.split( ' ' ).forEach( function( event ) {
				el[action + 'EventListener']( event, handler, false );
			});
		},

		on: function( event, el, handler )
		{
			this.event( 'add', event, el, handler );
		},

		off: function( event, el, handler )
		{
			this.event( 'remove', event, el, handler );
		},

		trigger: function( event, el )
		{
			var ev = document.createEvent( 'HTMLEvents' );
			ev.initEvent( event, false, true );
			el.dispatchEvent( ev );
		},

		extend: function()
		{
			var args = [].slice.call( arguments );
			var result = args[0];
			var extenders = args.slice(1);

			Object.keys( extenders ).forEach( function( i ) {
				for( var key in extenders[ i ] ) {
					if( !extenders[ i ].hasOwnProperty( key ))continue;
					result[ key ] = extenders[ i ][ key ];
				}
			});

			return result;
		},

		createEl: function( tag, attributes )
		{
			var el = ( typeof tag === 'string' ) ? document.createElement( tag ) : tag;

			attributes = attributes || {};

			for( var key in attributes ) {
				if( !attributes.hasOwnProperty( key ))continue;
				el.setAttribute( key, attributes[ key ] );
			}

			return el;
		},

		prefixed: function( value )
		{
			return this.prefix + value;
		},

		sprintf: function( format )
		{
			var args = [].slice.call( arguments, 1, arguments.length );

			return format.replace( /\$(\d+)/g, function( match, number ) {
				return args[ number ] !== undefined ? args[ number ] : match;
			});
		},
	};

	Plugin.defaults = Plugin.prototype.defaults;

	window.FloatLabels = Plugin;

	if( !$ )return;

	$.fn.starrating = function( options ) {
		return this.each( function() {
			if( $.data( this, "plugin_floatlabels" ))return;
			$.data( this, "plugin_floatlabels", new Plugin( this, options ));
		});
	};
})( window, document );
