(function($){

	/*$.fn.openModalWindow = function(href) {
		// data is the modal's content
		var data = $(href).html();
		boxInner.html(data);
	
		$(boxInner).css({
			width: settings.width+"px",
		});
		
		// this is to fix the bug where the height isn't calculated correctly on first load

		var boxOuterHeight = box.outerHeight();
		
		$(box).css({
			position: settings.position,
			left: ($(window).width() - box.outerWidth())/2,
			top: ($(window).height() - boxOuterHeight)/2
		});		
		
		if(settings.close != false) {
			box.append(close);
		}
		box.fadeTo(settings.speed, settings.trans).fadeIn(settings.speed);
		overlay.fadeTo(settings.speed, settings.opacity).fadeIn(settings.speed);
		
		setTimeout(function(){
			box.fadeIn(settings.speed);
		}, 500);
	
		box.find("#modalWindow-close").click(function(e){
			e.preventDefault();
			closeWindow();
		});		
	}*/

	$.fn.modalWindow = function(settings){
		
		var element = $(this);
		var isLoading = false;
		
		var defaultSettings = {			
			position	:	"fixed",
			width		:	600,
			trans		:	0.90,
			opacity		:	0.5,
			close		:	true,
			speed		:	600,
			className	:	'',
			borderWidth :	5
		};
		
		var settings = $.extend(defaultSettings, settings);
		
		var overlay = $('<div>', {
				'class': 'modalWindow-overlay'					
		});
		
		var box = $('<div>', {
				'class': 'modalWindow-box '+settings.className				
		});
		
		var boxInner = $('<div>', {
				'class': 'modalWindow-boxInner'					
		});
		
		var close = $('<a>', {
				'class': 'modalWindow-close'					
		});
	
		var loader = $('<div>', {
				'class': 'modalWindow-loader',
				html: 'Loading, please wait...'
		});
		
		$("body").append(overlay).append(box);
		$(box).append(boxInner);
		
		$(element).click(function(e){
			e.preventDefault();
			var href = $(this).attr("href");
			openWindow(href);
		});
		
		/*$('.modal-link').click(function(e){
			e.preventDefault().stopPropagation();
			
			var href = $(this).attr("href");
			if (typeof href == 'undefined') {
				var href = $(this).find('a').attr("href");
			}
			openWindow(href);
		});*/
		
		overlay.click(function(){							   
			closeWindow();			
		});
		
		close.click(function(){							   
			closeWindow();
		});
		
		function openWindow(href) {
			// data is the modal's content
			var data = $(href).html();
			boxInner.html(data);
		
			$(boxInner).css({
				width: settings.width+"px",
			});
			
			// this is to fix the bug where the height isn't calculated correctly on first load

			var boxOuterHeight = box.outerHeight();
			
			$(box).css({
				position: settings.position,
				left: ($(window).width() - box.outerWidth())/2,
				top: ($(window).height() - boxOuterHeight)/2
			});		
			
			if(settings.close != false) {
				box.append(close);
			}
			box.fadeTo(settings.speed, settings.trans).fadeIn(settings.speed);
			overlay.fadeTo(settings.speed, settings.opacity).fadeIn(settings.speed);
			
			setTimeout(function(){
				box.fadeIn(settings.speed);
				isLoading = false;
			}, 500);
		
			box.find("#modalWindow-close").click(function(e){
				e.preventDefault();
				closeWindow();
			});
		}
		
		function closeWindow(){
			if(overlay.is(":animated") || box.is(":animated")){return false;}
			box.fadeOut(settings.speed);
			overlay.fadeOut(600);
		}

	}
	
})(jQuery);


jQuery('.modal-link').live('click', function(e){
	e.preventDefault();

	var href = jQuery(this).attr("href");
	if (typeof href == 'undefined') {
		var href = jQuery(this).find('a').attr("href");
		jQuery(this).find('a').attr('href', '#news-'+Math.floor((Math.random()*jQuery(".modalWindow-box").length)+1));
	}
	//openWindow(href);
	jQuery(href+'-modal').trigger('click');
});