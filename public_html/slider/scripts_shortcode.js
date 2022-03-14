jQuery(document).ready(function(){
    initScripts('body');
});

function initScripts(parentHtml){
    jQuery(parentHtml).find('.article-image-slide').each(function(index){
        myPager=jQuery('<ul id="jcycle-pager" class="jcycle-pager nav-item'+index+'">');
        jQuery(this).after(myPager);
        jQuery(this).cycle({
            pager:  myPager,
            fx: 'fade', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
            delay: 1000,
            random: 1,
            easing: 'easeInOutExpo',
            pause: true,
            // pager:  '.nav-item'+index,
            pagerAnchorBuilder: function(idx, slide) {
                return '<li><a href="#">*</a></li>';
            }
        });
    });
    jQuery(parentHtml).find('.preload').preloadImages({
        showSpeed: 2000,   // length of fade-in animation, 500 is default
        easing: 'easeOutQuad'   // optional easing, if you don't have any easing scripts - delete this option
    });
    jQuery(parentHtml).find('.shortcode_tabs').each(function(tabid){
        var tabTitles=jQuery(this).children('h5').remove();
        var myTab=tabid;
	var tabDivs=jQuery(this).children().remove();
        
        var tabTitleContainer=jQuery('<ul class="tabs shortcode-tabs '+jQuery(this).attr('rel')+'"></ul>');
        tabTitles.each(function(index){
            //jQuery(this).children('a').attr('href', '#tab-'+myTab+'-'+index);
            tabTitleContainer.append(jQuery('<li></li>').append(jQuery(this).children()));
        });
        jQuery(this).prepend(tabTitleContainer);
	var tabDivsContainer=jQuery('<div class="panes shortcode-tab-panes"></div>');
	tabDivsContainer.append(tabDivs);
	jQuery(this).append(tabDivsContainer);

    //jQuery(this).append(titles);
    });
    
        // setup ul.tabs to work as tabs for each div directly under div.panes
        jQuery("ul.tabs").tabs("div.panes > div");
    
   
    jQuery(".toggle_title").toggle(
		function(){
			jQuery(this).addClass('toggle_active');
			jQuery(this).siblings('.toggle_content').slideDown("fast");
		},
		function(){
			jQuery(this).removeClass('toggle_active');
			jQuery(this).siblings('.toggle_content').slideUp("fast");
		}
	);
    jQuery(".accordion").tabs(".accordion div.pane", {tabs: 'h2', effect: 'slide', initialIndex: null});
    jQuery(parentHtml).find('.testiominals').each(function(index){
        desNext=jQuery('<a href="#" class="tnext">&gt;</a>');
        desPrev=jQuery('<a href="#" class="tprev">&lt;</a>');
        desPager=jQuery('<div class="fp-pager"></div>');

        desPager.append(desPrev);
        desPager.append(desNext);
        jQuery(this).before(desPager);
        jQuery(this).cycle({
            fx: 'fade', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
            easing: 'easeInOutExpo',
            delay: 10,
            speed: 500,
            prev:    desPrev,
            next:    desNext
        });
    });
};