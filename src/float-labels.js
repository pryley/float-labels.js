/*!
 * Float Labels
 *
 * Version: 3.0.0
 * Author: Paul Ryley (http://geminilabs.io)
 * URL: https://github.com/geminilabs/float-labels.js
 * License: MIT
 */

/** global: Option */

;(function( window, document, undefined )
{
	"use strict";

	var Plugin = function( el, options )
	{
		this.el = this.isString( el ) ? document.querySelectorAll( el ) : el;
		if( !NodeList.prototype.isPrototypeOf( this.el ))return;
		this.options = options;
		this.config = [];
		this.selectors = [];
		this.init();
		this.rebuild = function() {
			for( var i = 0; i < this.el.length; ++i ) {
				var fields = this.el[i].querySelectorAll( this.selectors[i] );
				this.current = i;
				for( var x = 0; x < fields.length; ++x ) {
					this.floatLabel( fields[x], true );
				}
			}
		};
		this.destroy = function() {
			for( var i = 0; i < this.el.length; ++i ) {
				var fields = this.el[i].querySelectorAll( this.selectors[i] );
				this.current = i;
				this.el[i].removeEventListener( 'reset', this.events.reset );
				this.removeClasses( this.el[i] );
				for( var x = 0; x < fields.length; ++x ) {
					this.reset( fields[x] );
				}
			}
		}
	};

	Plugin.prototype = {

		defaults: {
			customEvent  : null,
			customLabel  : null,
			exclude      : '.no-label',
			inputRegex   : /email|number|password|search|tel|text|url/,
			prefix       : 'fl-',
			prioritize   : 'label', // label|placeholder
			requiredClass: 'required',
			style        : 0, // 0|1|2
			transform    : 'input,select,textarea'
		},

		init: function()
		{
			this.initEvents();
			for( var i = 0; i < this.el.length; ++i ) {
				var el = this.el[i];
				var config = this.extend( {}, this.defaults, this.options, el.getAttribute( 'data-options' ));
				var exclude = this.sprintf( ':not($0)', config.exclude.split( /[\s,]+/ ).join( '):not(' ));
				var selectors = config.transform.replace( /,/g, exclude + ',' ) + exclude;
				var fields = el.querySelectorAll( selectors );

				el.addEventListener( 'reset', this.events.reset );

				this.config[i] = config;
				this.selectors[i] = selectors;
				this.current = i;

				el.classList.add( this.prefixed( 'form' ));
				if( config.style ) {
					el.classList.add( this.prefixed( 'style-' + config.style ));
				}
				for( var i = 0; i < fields.length; ++i ) {
					this.floatLabel( fields[i], el );
				}
			}
		},

		initEvents: function()
		{
			this.events = {
				blur: this.onBlur.bind( this ),
				focus: this.onFocus.bind( this ),
				input: this.onChange.bind( this ),
				reset: this.onReset.bind( this ),
			};
		},

		floatLabel: function( el, rebuild )
		{
			if( !el.getAttribute( 'id' ) || (
				el.tagName === 'INPUT' && !this.config[this.current].inputRegex.test( el.getAttribute( 'type' ))
			))return;
			if( this.hasParent( el )) {
				if( rebuild !== true )return;
				this.reset( el );
			}
			this.build( el );
		},

		build: function( el )
		{
			var labelEl = this.getLabel( el );
			if( !labelEl )return;
			labelEl.classList.add( this.prefixed( 'label' ));
			el.classList.add( this.prefixed( el.tagName.toLowerCase() ));
			this.setLabel( labelEl, el );
			this.wrapLabel( labelEl, el );
			this.addEvents( el );
			if( typeof this.config[this.current].customEvent === 'function' ) {
				this.config[this.current].customEvent.call( this, el );
			}
		},

		reset: function( el )
		{
			var parent = el.parentNode;
			if( !this.hasParent( el ))return;
			var fragment = document.createDocumentFragment();
			while( parent.firstElementChild ) {
				this.removeClasses( parent.firstElementChild );
				fragment.appendChild( parent.firstElementChild );
			}
			parent.parentNode.replaceChild( fragment, parent );
			this.removeEvents( el );
		},

		removeClasses: function( el )
		{
			var prefix = this.config[this.current].prefix;
			var classes = el.className.split( ' ' ).filter( function( c ) {
				return c.lastIndexOf( prefix, 0 ) !== 0;
			});
			el.className = classes.join( ' ' ).trim();
		},

		getLabel: function( el )
		{
			var label = this.sprintf( 'label[for="$0"]', el.getAttribute( 'id' ));
			var labelEl = this.el[this.current].querySelectorAll( label );
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

			if( !labelText || ( labelText && placeholder && this.config[this.current].prioritize === 'placeholder' )) {
				labelText = placeholder;
			}
			// call the custom defined label event
			if( typeof this.config[this.current].customLabel === 'function' ) {
				var customLabel = this.config[this.current].customLabel.call( this, labelEl, el );
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
			else if( !placeholder || this.config[this.current].prioritize === 'label' ) {
				el.setAttribute( 'placeholder', labelText );
			}
		},

		wrapLabel: function( labelEl, el )
		{
			var wrapper = this.createEl( 'div', {
				class: this.prefixed( 'wrap' ) + ' ' + this.prefixed( 'wrap-' + el.tagName.toLowerCase() ),
			});
			if( el.value.length ) {
				wrapper.classList.add( this.prefixed( 'is-active' ));
			}
			if( el.getAttribute( 'required' ) !== null || el.classList.contains( this.config[this.current].requiredClass )) {
				wrapper.classList.add( this.prefixed( 'is-required' ));
			}
			el.parentNode.insertBefore( wrapper, el );
			wrapper.appendChild( labelEl );
			wrapper.appendChild( el );
		},

		addEvents: function( el )
		{
			el.addEventListener( 'blur', this.events.blur );
			el.addEventListener( 'input', this.events.input );
			el.addEventListener( 'focus', this.events.focus );
		},

		removeEvents: function( el )
		{
			el.removeEventListener( 'blur', this.events.blur );
			el.removeEventListener( 'input', this.events.input );
			el.removeEventListener( 'focus', this.events.focus );
		},

		onBlur: function( ev )
		{
			ev.target.parentNode.classList.remove( this.prefixed( 'has-focus' ));
		},

		onChange: function( ev )
		{
			var event = ev.target.value.length ? 'add' : 'remove';
			ev.target.parentNode.classList[event]( this.prefixed( 'is-active' ));
		},

		onFocus: function( ev )
		{
			ev.target.parentNode.classList.add( this.prefixed( 'has-focus' ));
		},

		onReset: function( ev )
		{
			var fields = this.el[this.current].querySelectorAll( this.selectors[this.current] );
			for( var i = 0; i < fields.length; ++i ) {
				fields[i].parentNode.classList.remove( this.prefixed( 'is-active' ));
			}
		},

		hasParent: function( el )
		{
			return el.parentNode.classList.contains( this.prefixed( 'wrap' ));
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

		isString: function( str ) {
			return Object.prototype.toString.call( str ) === "[object String]";
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
			return this.config[this.current].prefix + value;
		},

		sprintf: function( format )
		{
			var args = [].slice.call( arguments, 1, arguments.length );
			return format.replace( /\$(\d+)/g, function( match, number ) {
				return args[ number ] !== undefined ? args[ number ] : match;
			});
		},
	};

	window.FloatLabels = Plugin;

})( window, document );
