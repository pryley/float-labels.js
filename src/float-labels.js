/*!
 * Float Labels
 * @version: 3.3.9
 * @author: Paul Ryley (http://geminilabs.io)
 * @url: https://pryley.github.io/float-labels.js
 * @license: MIT
 */

/** global: define, navigator, NodeList, Option */

;(function( window, document, undefined )
{
	"use strict";

	var Plugin = function( el, options )
	{
		this.el_ = this.isString_( el ) ? document.querySelectorAll( el ) : [el];
		this.config_ = [];
		this.options_ = options;
		this.selectors_ = [];
		this.init_();
		this.destroy = function() {
			this.loop_( function( el ) {
				el.removeEventListener( 'reset', this.events.reset );
				this.removeClasses_( el );
			}, function( field ) {
				this.reset_( field );
			});
		};
		this.rebuild = function() {
			this.loop_( null, function( field ) {
				this.floatLabel_( field, true );
			});
		};
	};

	Plugin.prototype = {

		defaults_: {
			customEvent: null,
			customLabel: null,
			customPlaceholder: null,
			exclude: '.no-label',
			inputRegex: /email|number|password|search|tel|text|url/,
			prefix: 'fl-',
			prioritize: 'label', // label|placeholder
			requiredClass: 'required',
			style: 0, // 0|1|2
			transform: 'input,select,textarea'
		},

		/** @return void */
		init_: function() {
			var self = this;
			self.initEvents_();
			self.loop_( function( el, i ) {
				var style = self.config_[i].style;
				el.addEventListener( 'reset', self.events.reset );
				el.classList.add( self.prefixed_( 'form' ));
				if( style ) {
					el.classList.add( self.prefixed_( 'style-' + style ));
				}
			}, function( field ) {
				self.floatLabel_( field );
			});
		},

		/** @return void */
		initEvents_: function() {
			var self = this;
			self.events = {
				blur: self.onBlur_.bind( self ),
				change: self.onInput_.bind( self ),
				focus: self.onFocus_.bind( self ),
				input: self.onInput_.bind( self ),
				reset: self.onReset_.bind( self ),
			};
		},

		/** @return string */
		addRemove_: function( bool ) {
			return bool ? 'add' : 'remove';
		},

		/** @return null|void */
		build_: function( el ) {
			var self = this;
			var labelEl = self.getLabel_( el );
			if( !labelEl )return;
			el.classList.add( self.prefixed_( el.tagName.toLowerCase() ));
			self.setLabel_( labelEl, el );
			self.setPlaceholder_( labelEl, el );
			self.wrapLabel_( labelEl, el );
			self.handleEvents_( el, 'add' );
			if( typeof self.config_[self.current_].customEvent === 'function' ) {
				self.config_[self.current_].customEvent.call( self, el );
			}
		},

		/** @return Element */
		createEl_: function( tag, attributes ) {
			var el = ( typeof tag === 'string' ) ? document.createElement( tag ) : tag;
			attributes = attributes || {};
			for( var key in attributes ) {
				if( !attributes.hasOwnProperty( key ))continue;
				el.setAttribute( key, attributes[key] );
			}
			return el;
		},

		/** @return object */
		extend_: function() {
			var args = [].slice.call( arguments );
			var result = args[0];
			var extenders = args.slice(1);
			Object.keys( extenders ).forEach( function( i ) {
				for( var key in extenders[i] ) {
					if( !extenders[i].hasOwnProperty( key ))continue;
					result[key] = extenders[i][key];
				}
			});
			return result;
		},

		/** @return null|void */
		floatLabel_: function( el, rebuild ) {
			var self = this;
			if( !self.isValidField_( el ))return;
			if( self.hasParent_( el )) {
				if( rebuild !== true )return;
				self.reset_( el );
			}
			self.build_( el );
		},

		/** @return string|false */
		getLabel_: function( el ) {
			var label = 'label[for="' + el.getAttribute( 'id' ) + '"]';
			var labelEl = this.el_[this.current_].querySelectorAll( label );
			// check for multiple labels with identical 'for' attributes
			if( labelEl.length > 1 ) {
				labelEl = el.parentNode.querySelectorAll( label );
			}
			if( labelEl.length === 1 ) {
				return labelEl[0];
			}
			return false;
		},

		/** @return string */
		getLabelText_: function( labelEl, el ) {
			var labelText = labelEl.textContent.replace( '*', '' ).trim();
			var placeholderText = el.getAttribute( 'placeholder' );
			if( !labelText || ( labelText && placeholderText && this.config_[this.current_].prioritize === 'placeholder' )) {
				labelText = placeholderText;
			}
			return labelText;
		},

		/** @return void */
		handleEvents_: function( el, action ) {
			var events = this.events;
			['blur','input','focus'].forEach( function( event ) {
				if( event === 'input' && ( el.type === 'file' || el.nodeName === 'SELECT' )) {
					event = 'change';
				}
				el[ action + 'EventListener']( event, events[event] );
			});
		},

		/** @return bool */
		hasParent_: function( el ) {
			return el.parentNode.classList.contains( this.prefixed_( 'wrap' ));
		},

		/** @return bool */
		isString_: function( str ) {
			return Object.prototype.toString.call( str ) === "[object String]";
		},

		/** @return bool */
		isValidField_: function( el ) {
			var isInvalidInput = el.tagName === 'INPUT' && !this.config_[this.current_].inputRegex.test( el.getAttribute( 'type' ));
			var isInvalidSelect = el.tagName === 'SELECT' && el.getAttribute( 'multiple' ) !== null;
			return el.getAttribute( 'id' ) && !isInvalidInput && !isInvalidSelect;
		},

		/** @return void */
		loop_: function( elCallback, fieldCallback ) {
			var self = this;
			for( var i = 0; i < self.el_.length; ++i ) {
				if( typeof self.selectors_[i] === 'undefined' ) {
					var config = self.extend_( {}, self.defaults_, self.options_, self.el_[i].getAttribute( 'data-options' ));
					var exclude = ':not(' + config.exclude.split( /[\s,]+/ ).join( '):not(' ) + ')';
					self.selectors_[i] = config.transform.replace( /,/g, exclude + ',' ) + exclude;
					self.config_[i] = config;
				}
				var fields = self.el_[i].querySelectorAll( self.selectors_[i] );
				self.current_ = i;
				if( typeof elCallback === 'function' ) {
					elCallback.call( self, self.el_[i], i );
				}
				for( var x = 0; x < fields.length; ++x ) {
					if( typeof fieldCallback === 'function' ) {
						fieldCallback.call( self, fields[x], i );
					}
				}
			}
		},

		/** @return void */
		onBlur_: function( ev ) {
			ev.target.parentNode.classList.remove( this.prefixed_( 'has-focus' ));
		},

		/** @return void */
		onInput_: function( ev ) {
			ev.target.parentNode.classList[
				this.addRemove_( ev.target.value.length )
			]( this.prefixed_( 'is-active' ));
		},

		/** @return void */
		onFocus_: function( ev ) {
			ev.target.parentNode.classList.add( this.prefixed_( 'has-focus' ));
		},

		/** @return void */
		onReset_: function() {
			setTimeout( this.resetFields_.bind( this ));
		},

		/** @return string */
		prefixed_: function( value ) {
			return this.config_[this.current_].prefix + value;
		},

		/** @return void */
		removeClasses_: function( el ) {
			var prefix = this.config_[this.current_].prefix;
			var classes = el.className.split( ' ' ).filter( function( c ) {
				return c.lastIndexOf( prefix, 0 ) !== 0;
			});
			el.className = classes.join( ' ' ).trim();
		},

		/** @return null|void */
		reset_: function( el ) {
			var self = this;
			var parent = el.parentNode;
			if( !self.hasParent_( el ))return;
			var fragment = document.createDocumentFragment();
			while( parent.firstElementChild ) {
				var childEl = parent.firstElementChild;
				self.removeClasses_( childEl );
				fragment.appendChild( childEl );
			}
			parent.parentNode.replaceChild( fragment, parent );
			self.resetPlaceholder_( el );
			self.handleEvents_( el, 'remove' );
		},

		/** @return void */
		resetFields_: function() {
			var self = this;
			var fields = self.el_[self.current_].querySelectorAll( self.selectors_[self.current_] );
			for( var i = 0; i < fields.length; ++i ) {
				fields[i].parentNode.classList[
					self.addRemove_( fields[i].tagName === 'SELECT' && fields[i].value !== '' )
				]( self.prefixed_( 'is-active' ));
			}
		},

		/** @return void */
		resetPlaceholder_: function( el ) {
			var dataPlaceholder = 'data-placeholder';
			var originalPlaceholder = el.getAttribute( dataPlaceholder );
			if( originalPlaceholder !== null ) {
				el.removeAttribute( dataPlaceholder );
				el.setAttribute( 'placeholder', originalPlaceholder );
			}
		},

		/** @return void */
		setLabel_: function( labelEl, el ) {
			var self = this;
			labelEl.classList.add( self.prefixed_( 'label' ));
			labelEl.textContent = self.getLabelText_( labelEl, el );
			if( typeof self.config_[self.current_].customLabel === 'function' ) {
				labelEl.textContent = self.config_[self.current_].customLabel.call( self, labelEl, el );
			}
		},

		/** @return void */
		setPlaceholder_: function( labelEl, el ) {
			var self = this;
			var placeholderText = el.getAttribute( 'placeholder' );
			if( self.config_[self.current_].prioritize === 'label' || !placeholderText ) {
				if( placeholderText ) {
					el.setAttribute( 'data-placeholder', placeholderText );
				}
				placeholderText = self.getLabelText_( labelEl, el );
			}
			if( typeof self.config_[self.current_].customPlaceholder === 'function' ) {
				placeholderText = self.config_[self.current_].customPlaceholder.call( self, placeholderText, el, labelEl );
			}
			if( el.tagName === 'SELECT' ) {
				self.setSelectPlaceholder_( el, placeholderText );
			}
			else {
				el.setAttribute( 'placeholder', placeholderText );
			}
		},

		/** @return void */
		setSelectPlaceholder_: function( el, placeholderText ) {
			var childEl = el.firstElementChild;
			if( childEl.hasAttribute( 'value' ) && childEl.value ) {
				el.insertBefore( new Option( placeholderText, '' ), childEl );
				if( el.options[el.selectedIndex].defaultSelected === false ) {
					el.selectedIndex = 0;
				}
			}
			else {
				childEl.setAttribute( 'value', '' );
			}
			if( childEl.textContent === '' ) {
				childEl.textContent = placeholderText;
			}
		},

		/** @return void */
		wrapLabel_: function( labelEl, el ) {
			var self = this;
			var wrapper = self.createEl_( 'div', {
				class: self.prefixed_( 'wrap' ) + ' ' + self.prefixed_( 'wrap-' + el.tagName.toLowerCase() ),
			});
			if( el.value !== undefined && el.value.length ) {
				wrapper.classList.add( self.prefixed_( 'is-active' ));
			}
			if( el.getAttribute( 'required' ) !== null || el.classList.contains( self.config_[self.current_].requiredClass )) {
				wrapper.classList.add( self.prefixed_( 'is-required' ));
			}
			el.parentNode.insertBefore( wrapper, el );
			wrapper.appendChild( labelEl );
			wrapper.appendChild( el );
		},
	};

	if( typeof define === "function" && define.amd ) {
		define( [], function() { return Plugin; });
	}
	else if( typeof module === "object" && module.exports ) {
		module.exports = Plugin;
	}
	else {
		window.FloatLabels = Plugin;
	}

})( window, document );
