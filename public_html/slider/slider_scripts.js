function tt_anything_slider() {
    jQuery('#page-wrap').css({
        display: 'block'
    });
    jQuery('#slider1 li:first .slider-text').css({
        marginLeft: '480px'
    });
    jQuery('#slider1 li:last .slider-text').css({
        display: 'none'
    });
    jQuery('#slider1').anythingSlider({
        width: 1920,
        // Override the default CSS width
        height: $(window).height(),
        // Override the default CSS width
        animationTime: 600,
        resumeDelay: 0,
        pauseOnHover: false,
        animationType: 'fade',
        // Resume slideshow after user interaction, only if autoplayLocked is true (in milliseconds).
        onSlideBegin: function() {
            var target_slide = jQuery('li.activePage').next();
            target_slide.find('.slider-text').css({
                display: 'block'
            });
            if (jQuery('li.activePage').length == 0 || target_slide.length == 0) target_slide = jQuery('#slider1 li:first').next().next();
            var target_text = target_slide.find('.slider-text');
            target_text.animate({
                marginLeft: '480px'
            },
            1000, 'easeInOutExpo');
        },
        onSlideComplete: function() {
            var target_slide = jQuery('li.activePage').next();
            target_slide.find('.slider-text').css({
                marginLeft: '1280px'
            });
            target_slide.find('.slider-text').css({
                display: 'none'
            });
        }
    });
    var lefft = (jQuery(window).width() - jQuery('.anythingSlider.activeSlider').width()) / 2;
    jQuery('.anythingSlider.activeSlider').css('margin-left', lefft + 'px');

}
