var styleConfig = {
	staticNavigation: true,
	staticNavigationMinWidth: 500,
	staticNavigationMinHeight: 400
};

jQuery(function($) {
	'use strict';

	if (styleConfig.staticNavigation) {
		$('.navbar > .inner').first().each(function(i) {
			var nav = this,
				navigation = $(nav),
				isStatic = false,
				Parent = navigation.parent(),
				dummy,
				inner,
				$w = $(window),
				minTopPosition = 0,
				minWidth = styleConfig.staticNavigationMinWidth,
				minHeight = styleConfig.staticNavigationMinHeight,
				windowWidth, navHeight,
				mainwidth = $('#wrap').outerWidth(),
				queued = false,
				throttled = false;

			Parent.addClass('not-static');
			navigation.before('<div class="static-nav-dummy inner" style="display:none;" />');
			dummy = navigation.prev();

			navigation.wrapInner('<div class="navbar static-inner" />');
			inner = navigation.children().css('max-width', mainwidth);

			function enableStatic()
			{
				dummy.css('height', Math.floor(navigation.height()) + 'px').show();
				navigation.addClass('static');
				Parent.removeClass('not-static');
				isStatic = true;
			}

			function disableStatic()
			{
				dummy.hide();
				navigation.removeClass('static');
				Parent.addClass('not-static');
				isStatic = false;
			}

			function testHash()
			{
				var hash = (window.location.hash) ? window.location.hash : '';
				if (!hash)
				{
					return;
				}
				window.scrollTo($w.scrollLeft(), $w.scrollTop() - navigation.height());
			}

			function check(checkHash)
			{
				var windowTop = 0,
					windowWidth = Math.floor($w.width()),
					top;

				if (windowWidth < minWidth || $w.height() < minHeight) {
					if (isStatic) {
						disableStatic();
					}
					return;
				}
				if (!isStatic)
				{
					navHeight = navigation.height();
					top = nav.getBoundingClientRect().top;
					if (top > 0) {
						return;
					}
					minTopPosition = $w.scrollTop() + top;
					enableStatic();
					if (checkHash) {
						testHash();
					}
					return;
				}
				if ($w.scrollTop() < minTopPosition) {
					disableStatic();
				} else if (checkHash) {
					testHash();
				}
			}

			$w.on('scroll resize', function() { 
				if (!isStatic) {
					check(false);
				}
				else {
					if (!throttled) {
						check(false);
						throttled = true;
						queued = false;
						setTimeout(function() {
							throttled = false;
							if (queued) {
								check(false);
							}
						}, 250);
					}
					else {
						queued = true;
					}
				}
			});
			$w.on('load', function() { check(true); });
			$w.on('hashchange', function() { check(true); });
		});
	}	
});