

/*
 Double Tap to Go
 Author: Graffino (http://www.graffino.com)
 Version: 0.3
 Originally by Osvaldas Valutis, www.osvaldas.info
 Available for use under the MIT License
 */


var DISTANCE = 10;

;(function($, window, document, undefined) {
    $.fn.doubleTapToGo = function(action) {

        if (!('ontouchstart' in window) &&
            !navigator.msMaxTouchPoints &&
            !navigator.userAgent.toLowerCase().match( /windows phone os 7/i )) return false;

        if (action === 'unbind') {
            this.each(function() {
                $(this).off();
                $(document).off('click touchstart MSPointerDown', handleTouch);
            });

        } else {
            this.each(function() {
                var curItem = false;

                $(this).on('click', function(e) {
                    var item = $(this);
                    if (item[0] != curItem[0]) {
                        e.preventDefault();
                        curItem = item;
                    }
                });

                $(document).on('click touchstart MSPointerDown', handleTouch);

                function handleTouch(e) {
                    var resetItem = true,
                        parents = $(e.target).parents();

                    for (var i = 0; i < parents.length; i++)
                        if (parents[i] == curItem[0])
                            resetItem = false;

                    if(resetItem)
                        curItem = false;
                };
            });
        }
        return this;
    };
})(jQuery, window, document);


//$.noConflict();

var mainmap;
$(document).ready( function($) {
    /*
    /*  REPLACE ALL SELECTS TO AN THEMABLE SELECT  */

    /* Replaced with plugin
    if ($("#storeLocatorMap").length > 0) {
        mainmap = $("#storeLocatorMap").acfMap({
            zoom: 16,
            useClusters: true,
            onFirstLoad:function(){

                $('#store-search').addClass('in');
            }
        });
        // Only want clusters in the initial launch
        mainmap.options.useClusters = false;
    }
    */


    // Mobile dropdown
    $( 'nav li:has(ul)' ).doubleTapToGo();

    //    Select.init();
    //$(".map .acf-map").acfMap({});
    $(".map .acf-map").each(function(index, el){
       $(el).acfMap({});
    });


    /*
        *
        * Slider
        *
        * */
        
        var $carousel = $(".slider.desktop");
        $carousel.on('init', function(event, slick, direction){
            $($carousel).find('video').each(function(index, el){
                el.play();
            });
        });

        $carousel.slick({
            arrows: true,
            dots: true,
            speed:300,
            autoplay: true,
            autoplaySpeed: 3500
        });
        $(".slider.mobile").slick({
            arrows: false,
            dots: true
        });
    $(".page-slider").slick({
        arrow: false,
        dots:true,
        speed:300,
        autoplay: true,
        autoplaySpeed: 7000
    });

    $(".related-slider").slick({
        arrows: false,
        dots: true
    });
        





        /*
         * Search
         */

         $('button#search').click(function(e){
            e.preventDefault();
            $('#masthead').toggleClass('search');
             $('#masthead input.search-field').focus();

         });



        
        window.sr = new scrollReveal();





        $('.js-nutrition').click(function(e){
            e.preventDefault();



            if ($(".nutritional-information").is(":visible") == false) {

                $('.nutritional-information').velocity("slideDown", {
                    delay: 800,
                    duration: 800
                });
            }

            // Scroll to section
            $(".nutritional-information").velocity("scroll", {
                container: $("body"),
                duration: 400,
                delay: 0
            });


        });













        $('button#nav-toggle').click(function(e){
            $('#masthead nav').toggleClass("open");
        });








    // MEGA MAP SEARCH
    $('#store-locator-search').submit(function(e){

        $('#storeLocatorMap').removeClass('disabled');

        var postcode = $(this).find('.search').val();
        if (isNaN(parseInt(postcode))) {


            $('#store-search').removeClass('in').addClass('results');
            $('#results-content').addClass('dirty');

            getCloseStoreBySuburb(postcode, DISTANCE, function (results) {
                console.log(results);
                if (results.data.length > 0) {
                    var html = results.html;
                    mainmap.replaceMarkers(results.data);

                } else {
                    var html = '';
                    $('#store-search').removeClass('results').addClass('in');

                }
                $('#results-content .content').html(html);

            });

        } else {

            $('#store-search').removeClass('in').addClass('results');
            $('#results-content').addClass('dirty');
            console.log('getCloseStoreByPostcode');
            getCloseStoreByPostcode(postcode, DISTANCE, function (results) {

                if (results.data.length > 0) {
                    var html = results.html;
                    mainmap.replaceMarkers(results.data);
                } else {
                    var html = '';
                    $('#store-search').removeClass('results').addClass('in');

                }
                $('#results-content .content').html(html);

            });
        }

        return false;
    })



    $('.js-menu-item').mouseover(function(){
        var height = $(this).height() + "px";
        $(this).css({'background-size':'300%'}).velocity({'background-size': "103%"}, 300);
    });
    $('.js-menu-item').mouseout(function(){
        $(this).css({'background-size':'cover'});
    });


    $('.filter .container > div.filter-dropdown').click(function(){
       var classname = $(this).attr('class');
        $(this).siblings().find('p, a:not(.selected)').velocity('fadeOut',  { queue: false });
        $(this).find('p, a').velocity('fadeIn',  {
            queue: false,
            complete: function(elements)
                {
                    $('.filter').attr('class', 'filter').addClass(classname);
                }
        });
    });


    // Dietry requirments filter
    $('.filter .container a').click(function(e){

        e.preventDefault();
        e.stopPropagation();

        // Reset selected
        $(this).parent().parent().find('a').removeClass('selected');
        $(this).toggleClass("selected");

        var count = $(this).parent().parent().find('.selected').length;
        var total = $(this).parent().parent().find('a').length;

        $(this).parent().parent().parent().parent().find('span').html(count + "/" + total);

        var terms = [];

        $('.allergens-list').find('.selected').each(function(index, el){
            terms.push($(this).attr('data-id'));
        });
        $('.menu-list').find('.selected').each(function(index, el){
            if ($(this).attr('data-id') != '') {
                window.filters.menu = $(this).attr('data-id');
            }
        });

        window.filters.diet = terms;
        window.filters.page = 0;

        getMenuItems(function(data){
            $('main article').fadeOut();
            $('#js-menu-items').html(data.html);

        });
    });

    // Menu filter
    $('.menu.filter-dropdown a').click(function(e){
        e.preventDefault();

        var text = $(this).html();
        $(this).parent().parent().parent().parent().find('h2').text(text);
        $(this).parent().parent().parent().parent().removeClass('open');
    });






    // Close dropdown filters if you click on theheader
    $('html').click(function(e){
        $('.filter-dropdown').each(function(index, el){
            if ($(el).hasClass('open')){
                $('.filter-dropdown').removeClass('open');
            }
        });
    });

    // Open/close dropdown filter
    $('.filter-dropdown h2').click(function(e){
        e.stopPropagation();
        $(this).parent().toggleClass('open');
    });








    $('.js-load-more').click(function(e){
        e.preventDefault();
        $(this).addClass('loading');
        window.filters.page++;

        getMenuItems(function(data){
            $('#js-menu-items').append(data.html);
            $('.js-load-more').removeClass('loading');
        });
    });



    $('.testimonial-shortcode').slick({
        dots: true,
        arrows: true,
        infinite: false,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            }
            /*,
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            */
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });





    // State select jump to section on mobile
    $('select.state-select').change(function(){
       var offset = 10; // offset from the top of the page
        var nav = $(this).val();

        var aTag = $("a[name='"+ nav +"']");
        $('html,body').animate({scrollTop: aTag.offset().top - offset},'slow');
    });

    $('a.scroll-to').click(function(e){
       e.preventDefault();
        var offset = 150; // offset from the top of the page
        var nav = $(this).attr('href').replace('#', '');
        var aTag = $("a[name='"+ nav +"']");
        $('html,body').animate({scrollTop: aTag.offset().top - offset},'slow');

    });




});



$(document).ready(function($) {

    // Hack to make uber menu submenu items display full width
    $('.ubermenu-submenu').each(function () {

        var count = $(this).children().length;
        var cols = Math.floor(12 / 6);
        $(this).addClass("children-col-" + count);
    });

});



/**
    Geo Functions
*/


function mapStoreResults(term, response){

    var count = 0;
    if (response.data.length){
        count = response.data.length;
    }
    $('.acf-map').each(function(index, el){
        $(el).acfMap({

        });
    });
    $('.term').each(function(index, el){
        $(el).html(term);
    });
    $('.found').each(function(index, el){
        $(el).html(count)
    });
}

function getCloseStoreBySuburb(suburb, distance, callback){

    var data = {
        'action'   : 'getStoreBySuburb',
        'suburb' : suburb,
        'distance' : distance,
        'template' : "home-postcode"
    };


    $.post(wp.ajax_url, data, function(response) {

        callback(response);
        mapStoreResults(suburb, response);
    }, "json");
}

function getCloseStoreByPostcode(postcode, distance, callback){

    var data = {
            'action'   : 'getStoreByPostcode',
            'postcode' : postcode,
            'distance' : distance,
            'template' : "home-postcode"
        };

        $.post(wp.ajax_url, data, function(response) {
            console.log("Locations", response);
            callback(response);
            mapStoreResults(postcode, response);

        }, "json"); 
}


function getCloseStoreByLatLng(lat, lng, distance, callback){
    console.log("getCloseStoreByLatLng", lat, lng, distance)
    var data = {
        'action'   : 'getStoreByLatLng',
        'lat' : lat,
        'lng' : lng,
        'distance': distance,
        'template' : "home-postcode"
    };


        $.post(wp.ajax_url, data, function(response) {
            callback(response);
            mapStoreResults('your location', response);
        }, "json"); 
}










/*
    Menu nav scroll events

**/
function init() {
    window.addEventListener('scroll', function(e){
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 120,
            header = $('#masthead');
        if (distanceY > shrinkOn) {
            //$(header).addClass("smaller");
        } else {
            //$(header).removeClass("smaller");
        }
    });
}



$(window).load( function() {
    /*
    /*  REMOVE THE PAGE LOADER  */
    
        var $pageLoader = $('.page-loader');
    
        $pageLoader.fadeOut();

    init();

});


String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
}

window.filters = {};
window.filters.diet = [];
window.filters.menu = null;
window.filters.page = 0;
window.filters.processing = false;
window.filters.timeout = null;
window.filters.request = null;


Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};


function getPosts(properties, callback){

    var data = {
        'action'   : 'getPosts'
    };

    var data = $.extend({}, data, properties);

    return $.ajax({
        url: wp.ajax_url,
        method: 'POST',
        dataType: "json",
        cache: false,
        data: data,
        success: function(results){
            callback(results)
        }
    });
    /*
    return $.post(wp.ajax_url, data, function(response) {
        callback(response);
    }, "json");
    */

};




function getMenuItems(callback){

    $('#menu-feedback').addClass('loading');

    $('#js-menu-items').html('');

    if (window.filters.request != null){
        window.filters.request.abort();
        window.filters.request = null;
        $('#menu-feedback').removeClass('loading');
    }

    var allergenQuery, menuQuery;
    if(window.filters.diet != null && window.filters.diet.length > 0){
        allergenQuery= {"taxonomy": "allergens", "field":"term_id", "operator":"NOT IN", "terms": window.filters.diet}
    }
    if(window.filters.diet.length > 0){
        allergenQuery= {"taxonomy": "allergens", "field":"term_id", "operator":"NOT IN", "terms": window.filters.diet}
    }
    if(window.filters.menu != null) {
        menuQuery = {"taxonomy": "menus", "field": "term_id", "operator": "IN", "terms": window.filters.menu}
    }
    //var taxQuery = [allergenQuery, menuQuery] We're disabling allergens
    var taxQuery = [menuQuery];

    var offset = window.filters.page * 16;
    var params = { posts_per_page:16, is_paged:1, offset: window.filters.page, orderby:'date', order:'ASC', offset: offset, post_type:"menu-item", template:"loop-menuitem.php", tax_query: taxQuery};

    var searchterms = $('#js-search-param').val();
    if (searchterms != ''){
        params.s = searchterms
    }

    window.filters.request = getPosts(params, function(data){
        window.filters.processing = false;
        window.filters.request = null;
        $('#menu-feedback').removeClass('loading');
        var feedback = "Showing results for " + $('.menu.filter-dropdown h2').html() + formatAllergens();
        $('#menu-feedback .results').html(feedback);
        if(callback)callback(data);
    });

};


function formatAllergens(){
    if (window.filters.diet.length == 0) return "";
    var allergens = $('.allergens-list a.selected').map(function(){
        return $.trim($(this).text());
    }).get();
    return ", excluding " + allergens.join(", ");

}



$(document).ready(function(){
    $("#js-search-param").keyup(function(event){
        if(event.keyCode == 13){
            getMenuItems(function(data){
                $('#js-menu-items').html(data.html);
                $('.js-load-more').removeClass('loading');
            });
        }
    });
});