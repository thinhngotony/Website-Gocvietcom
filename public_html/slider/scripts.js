jQuery(document).ready(function() {
        jQuery('.meta-like').live('click',function(){
	var currentLike=jQuery(this);
	if(jQuery(this).attr('href')!='#')
	    jQuery.post(jQuery(this).attr('href'), function(response) {
		currentLike.parent().html('<a class="liked">'+response+'</a>');
	    });
	return false;
    });
})

// On window load. This waits until images have loaded which is essential
jQuery(window).load(function() {
  
  //jQuery("div.anythingSlider .arrow a").css("width",((jQuery(window).width()-1160)/2)+"px");
  if (jQuery('body').hasClass('Contact')) initializegmaps();
  //applesearch.init();
  
	// Fade in images so there isn't a color "pop" document load and then on window load
	jQuery(".item img").fadeIn(300);
	// clone image
	jQuery('.item img').each(function(){
		var el = jQuery(this);
		el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale').css({"position":"absolute","z-index":"998","opacity":"0"}).insertBefore(el).queue(function(){
			var el = jQuery(this);
			el.parent().css({"width":this.width,"height":this.height});
			el.dequeue();
		});
		this.src = grayscale(this.src);
	});
	// Fade image 
	jQuery('.item img').mouseover(function(){
		jQuery(this).parent().find('img:first').stop().animate({opacity:1}, 300);
	})
	jQuery('.img_grayscale').mouseout(function(){
		jQuery(this).stop().animate({opacity:0}, 1000);
	});
});

jQuery(window).resize(function() {
    var lefft = (jQuery(window).width() - jQuery('.anythingSlider.activeSlider').width()) / 2;
    jQuery('.anythingSlider.activeSlider').css('margin-left', lefft+'px');
});

function showBody(time){
    jQuery('#container_main > div').animate({
	opacity:1
    },time);
}
function theme_scripts(){
    jQuery('#navigation div ul:first li a').after('<span class="nav-sep">&nbsp\;</span>');
    fix_ie_zindex();
    jQuery('.imgload').preloadImages({
        showSpeed: 2000,   // length of fade-in animation, 500 is default
        easing: 'easeOutQuad'   // optional easing, if you don't have any easing scripts - delete this option
    });
    jQuery("a[rel^='prettyPhoto']").prettyPhoto({
        deeplinking:false
    });
    jQuery("label.overlabel").overlabel();

    //YOUTUBE VMODE FIX
    jQuery("iframe").each(function(){
        var ifr_source = jQuery(this).attr('src');
        var pos = ifr_source.indexOf("youtube.com");
        if(pos > -1) {
            var wmode = "?autohide=1&wmode=opaque";
            jQuery(this).attr('src',ifr_source+wmode);
        }
    });

    // ENTRY IMAGE SLIDE
    jQuery('.entry-image-slide').each(function(index){
        jQuery(this).after('<ul class="jcycle-pager nav-item'+index+'">').cycle({
            pager:  '.jcycle-pager',
            fx: 'fade', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
            easing: 'jswing',
            pause: true,
            autostop: false,
            pager:  '.nav-item'+index,
            pagerAnchorBuilder: function(idx, slide) {
                return '<li><a href="#">*</a></li>';
            }
        });
    });
    jQuery("#contactform").validate();

    jQuery("#commentform").validate();
    // GO TO TOP
    jQuery('.anchorLink').click(function() {
            jQuery('body,html').animate({scrollTop:0},'slow');
    });
    imgIconOverlay(jQuery);
};
function fix_ie_zindex(){
    if (jQuery.browser.msie) {
        var zIndexNumber = 400;
        jQuery('#header div, .slider_area div').each(function() {
            jQuery(this).css('zIndex', zIndexNumber);
            zIndexNumber -= 10;
        });
    }
}
function imgIconOverlay($) {
    // This will select the items which should include the image overlays
    jQuery("div.hover-content").each(function(){
        var	ctnr = jQuery(this).find('a.item-preview');
        var cntrDiv=jQuery(this);
        // insert the overlay image
        ctnr.each(function(){
            if (jQuery(this).children('img')) {
                if (jQuery(this).hasClass('iconPlay')) {
                    jQuery(this).append(jQuery('<div class="imgOverlay"><div class="symbolPlay"></div></div>'));
                } else if  (jQuery(this).hasClass('iconDoc')) {
                    jQuery(this).append(jQuery('<div class="imgOverlay"><div class="symbolDoc"></div></div>'));
                } else if (ctnr.hasClass('iconZoom')){
                    jQuery(this).append(jQuery('<div class="imgOverlay"><div class="symbolZoom"></div></div></div>'));
                }
            }
        })
        var overImg = ctnr.children('.imgOverlay');
        // var hoverInfo = ctnr.parent.next();

        if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 6) {
        // IE sucks at fading PNG's with gradients so just use show hide

        } else {
            // make sure it's not visible to start
            overImg.css('opacity',0);

            cntrDiv.hoverIntent(
                function(){
                    overImg.animate({
                        'opacity':'1'
                    },200,'swing');
                /*jQuery(this).children(':last-child').animate({
                        'opacity':'1'
                    },200,'swing');*/
                //                    jQuery(this).children('.jcycle-pager').animate({
                //                        'opacity':'0'
                //                    },500,'swing');

                },		// mouseover
                function(){
                    overImg.animate({
                        'opacity':'0'
                    },200,'swing');
                /* jQuery(this).children(':last-child').animate({
                        'opacity':'0'
                    },200,'swing');*/
                //                    jQuery(this).children('.jcycle-pager').animate({
                //                        'opacity':'1'
                //                    },500,'swing');

                }		// mouseout
                );
        }
    });
}
jQuery.fn.overlabel = function() {
    this.each(function(index) {
        var label = jQuery(this);
        var field;
        var id = this.htmlFor || label.attr('for');
        if (id && (field = document.getElementById(id))) {
            var control = jQuery(field);
            label.addClass("overlabel-apply");
            if (field.value !== '') {
                label.css("display", "none");
            }
            control.focus(function () {
                label.css("display", "none");
            }).blur(function () {
                if (this.value === '') {
                    label.css("display", "block");
                }
            });
            label.click(function() {
                var label = jQuery(this);
                var field;
                var id = this.htmlFor || label.attr('for');
                if (id && (field = document.getElementById(id))) {
                    field.focus();
                }
            });
        }
    });
};

jQuery("body").ready(function() {
if (jQuery(".tabs.shortcode-tabs li").length > 0) {
	var tabs_count = 0;
	jQuery(".tabs.shortcode-tabs li").each(function() {
		tabs_count++;
		jQuery(this).addClass('tab-'+tabs_count);
	})
}
});

jQuery("#country_selector").change(function() {
	location.href = '/'+jQuery(this).val()+'/';
});