/*!
 * jQuery Placeholdr: add and remove placeholder texts, and provide validation
 * Author: Hiren Patel (@HieroIsHere)
 * Original author: Jonathan Stahlhacke (@popeshoe)
 * 
 * github.com/ninty9notout/jquery.placeholdr
 *
 * Licensed under the MIT license
 */
(function($) {
	$.fn.placeholdr = function(o) {
		// Check if the passed variable is a method
		if(typeof o == "string") {
			if($.fn.placeholdr[o]) {
				return $.fn.placeholdr[o]($(this));
			} else {
				$.error('jQuery.placeholdr has no method "' +  o + '"');
			}
		}
		
		var $o = $.extend({}, $.fn.placeholdr.defaults, o);
		
		$(this).each(function() {
			var
				$t = $(this),
				// Order of placeholder text is:
				// Option defined > value defined > dummy text
				$p = $o.text || $t.val() || "Plase enter...";

			// Add placeholder class
			$t.addClass($o.class);
			
			// If value is empty, add a placeholder text
			if($t.val() == "") {
				$t.val($p);
			}
			
			$t.on("focus", function() {
				// When a field is focused, check if the field value
				// matches the placeholder text. This means the field
				// value has not been edited yet.
				if($t.val().toLowerCase() == $p.toLowerCase()) {
					// Empty the field
					$t.val("");
					// Remove the placeholder class
					$t.removeClass($o.class);
				}
			}).on("blur", function() {
				// When the field loses focus, check if the field value
				// is empty or matches the placeholder text. This means
				// the field has yet to be edited.
				var $v = $t.val().toLowerCase();
				
				if($v == "" || $v == $p.toLowerCase()) {
					// Set the field value to placeholder text again
					$t.val($p);
					// Add the placeholder class
					$t.addClass($o.class);
				} else {
					// Remove the "required" class if it was set at form submission
					$t.removeClass("required");
				}
			});
			
			$t.parents("form").on("submit", function() {
				var $v = $t.val().toLowerCase();
				
				// If reset is true and field value matches the
				// placeholder text, empty the field.
				if($o.reset && $v == $p.toLowerCase()) {
					$t.val("");
				}
				
				// If required is true and field value is
				// empty, add the "required" class to the field.
				if($o.required && $v == "") {
					$t.addClass("required");
				}
				
				// If a validate call back has been provided,
				// execute the function and set the class of the
				// field to "required" if callback retured not true.
				if(typeof $o.validate == "function") {
					if($o.validate.call(this, $t.val()) !== true) {
						$t.addClass("required");
					}
				}
			});
		});
	}
	
	// Default options
	$.fn.placeholdr.defaults = {
		text: null,
		reset: true,
		class: "placeholdr",
		// Soft validation, checks if value is provided
		required: true,
		// Hard validation, runs the value through this
		validate: null
	};
	
	// Resets the field so it has placeholdr applied to it again
	$.fn.placeholdr.reset = function($e) {
		$e.focus().blur();
	}
})(jQuery);