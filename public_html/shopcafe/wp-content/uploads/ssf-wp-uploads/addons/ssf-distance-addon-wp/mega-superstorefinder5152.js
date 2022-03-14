var initStoreLocator;
var d = new Date();
var geocoder;
var street;
var placeholdersearch = '';
var initTheMap = '';
var _map;
var lastid='';
var defualtLatLong;
var calltodefualt=false;
if(markerCategory!=undefined && markerCategory==true)
{
var mc;
var mcOptions;
var map;
var markersc = new Array();	
}
if(ssf_distance_limit==undefined || ssf_distance_limit=='')
{
 var ssf_distance_limit=30;	
}
jQuery(function() {
	if(document.getElementById('storeLocator__searchBar')!=null){
	placeholdersearch = document.getElementById('storeLocator__searchBar').placeholder;
	} else {
	return;
	}
    var baseURL = FE.baseURL,
        urls = {
            pathToJS :  ssf_wp_base+'/js/',
            pathToIcons : ssf_wp_uploads_base+'/images/icons/',
            pathToXML : baseURL + '',
            pins : {
                regular :  '/'+custom_marker,
                active :  '/'+custom_marker_active,
                skeuomorph :  '/youarehere.png'
            }
        },
        map = {
            el : document.getElementById('storeLocatorMap'),
            infobox : {
                el : document.getElementById('storeLocatorInfobox')
            },
            status : {
                $el : jQuery('#storeLocator__mapStatus'),
                $label : jQuery('#storeLocator__mapStatus__inner'),
                $closer : jQuery('#storeLocator__mapStatus__closer'),
                messages : {
                    loadingGoogleMap             : ssf_wp_loadingGoogleMap,
                    loadingGoogleMapUtilities    : ssf_wp_loadingGoogleMapUtilities,
                    startSearch                  : ssf_wp_startSearch,
                    gettingUserLocation          : ssf_wp_gettingUserLocation,
                    lookingForNearbyStores       : ssf_wp_lookingForNearbyStores,
                    lookingForStoresNearLocation : ssf_wp_lookingForStoresNearLocation,
                    filteringStores              : ssf_wp_filteringStores,
                    cantLocateUser               : ssf_wp_cantLocateUser,
                    notAllowedUserLocation       : ssf_wp_notAllowedUserLocation,
                    noStoresNearSearchLocation   : ssf_wp_noStoresNearSearchLocation,
                    noStoresNearUser             : ssf_wp_noStoresNearUser,
                    noStoresFromFilter           : ssf_wp_noStoresFromFilter,
                    cantGetStoresInfo            : ssf_wp_cantGetStoresInfo,
                    noStoresFoundNearUser        : ssf_noStoresFound,
                    noStoresFound                : ssf_noStoresFound,
                    storesFound                  : ssf_storesFound,
                    generalError                 : ssf_generalError
                },
                duration : 5000
            }
        },
        autocompleter = {
            el : document.getElementById('storeLocator__searchBar'),
            placeholderMediumUp : placeholdersearch,
            placeholderSmallDown : 'Search'
        },
        geolocator = {
            $el : jQuery('#geolocator'),
            currentState : 'neutral',
            states : {
                NEUTRAL : 'neutral',
                RUNNING : 'running'
            }
        },
        $els = {
            map : jQuery('#storeLocatorMap'),
            storeList : jQuery('#storeLocator__storeList'),
            topHalf : jQuery('#storeLocator__topHalf'),
            currentStoreCount : jQuery('#storeLocator__currentStoreCount'),
            totalStoreCount : jQuery('#storeLocator__totalStoreCount'),
            storeLocatorInfoBox : {
                self : jQuery('#storeLocatorInfobox'),
                init : function() {
					this.storeimage = this.self.find('.store-image');
                    this.location = this.self.find('.store-location');
                    this.address = this.self.find('.store-address');
					this.website = this.self.find('.store-website');
					this.distance = this.self.find('.store-distance');
					this.exturl = this.self.find('.store-exturl');
					this.embedvideo = this.self.find('.store-embedvideo');
					this.defaultmedia = this.self.find('.store-defaultmedia');
					this.email = this.self.find('.store-email');
					this.contactus = this.self.find('.store-contactus');
					this.telephone = this.self.find('.store-tel');
					this.fax = this.self.find('.store-fax');
					this.description = this.self.find('.store-description');
                    this.operatingHours = this.self.find('.store-operating-hours');
                    this.productsServices = this.self.find('.store-products-services');
                    this.directions = this.self.find('.infobox__cta');
					this.streetview = this.self.find('.infobox__stv');
					this.custmmarker = this.self.find('.store-custom-marker');
					this.zip = this.self.find('.store-zip');					
					this.state = this.self.find('.store-state');
                }
            },
            mobileStoreLocatorInfobox : {
                self : jQuery('#mobileStoreLocatorInfobox'),
                init : function() {
					this.storeimage = this.self.find('.store-image');
                    this.location = this.self.find('.store-location');
                    this.address = this.self.find('.store-address');
					this.website = this.self.find('.store-website');
					this.distance = this.self.find('.store-distance');										
					this.exturl = this.self.find('.store-exturl');
					this.embedvideo = this.self.find('.store-embedvideo');
					this.defaultmedia = this.self.find('.store-defaultmedia');
					this.email = this.self.find('.store-email');
					this.contactus = this.self.find('.store-contactus');
					this.telephone = this.self.find('.store-tel');
					this.fax = this.self.find('.store-fax');
					this.description = this.self.find('.store-description');
                    this.operatingHours = this.self.find('.store-operating-hours');
                    this.productsServices = this.self.find('.store-products-services');
                    this.directions = this.self.find('.infobox__cta');
					this.streetview = this.self.find('.infobox__stv');
					this.custmmarker = this.self.find('.store-custom-marker');
					this.zip = this.self.find('.store-zip');					
					this.state = this.self.find('.store-state');
                }
            },
            filters : {
                init : function() {
                    this.states = jQuery('#filter__states').find('input[name="storesState"]');
                    this.outletTypes = jQuery('#filter__outlets').find('input[name="storesOutletType"]');                    
					this.productsServices = jQuery('#filter__services').find('input[name="storesProductsServices"]');
					this.distance = jQuery('#filter__distance').find('input[name="storesdistance"]');
                    return this;
                }
            }
        },
        legend,
        xml = {
            filename : ssf_wp_base+'/ssf-wp-xml.php?t='+d.getTime()
        },
        isLocal = (window.location.hostname === '' || window.location.hostname === 'localhost'),
        isLargeScreen = true,
        isMediumScreen = true;
        setupMapStatus();
    /*---- Filter togglers ----*/
    var $filterTogglers = jQuery('.filter__toggler'),
        $filterTogglerContents = jQuery('.filter__toggler-contents');
    $filterTogglers.togglerify({
        singleActive: true,
        slide: true,
        content: function(index) {
            return $filterTogglerContents.eq(index);
        }
    });
    FE.watchSize('large', function(isLargeScreen) {
        var settings = (isLargeScreen) ? [true, 'toggleOff', 'activate'] : [false, 'toggleOn', 'deactivate'];
        $filterTogglers
            .togglerify('set', 'singleActive', settings[0])
            .togglerify(settings[1], { noSlide : true })
            .togglerify(settings[2]);
		if(placeholdersearch != ''){
        autocompleter.el.placeholder = (isLargeScreen) ? autocompleter.placeholderMediumUp : autocompleter.placeholderMediumUp;
		}
    });
    /*---- Filter popup ----*/
    var $storeLocatorFilterToggler = jQuery('#storeLocatorFilterToggler'),
        $filterPanel = $els.topHalf.find('.filter-radio');
    $filterPanel.data('filter-popup', {
        reveal : function() {
            jQuery('body').addClass('filter-popup-is-shown');
        },
        conceal : function() {
            jQuery('body').removeClass('filter-popup-is-shown');
        }
    });
    $filterPanel.find('[data-close-popup]').on('click', function(e) {
        e.preventDefault();
        $filterPanel.data('filter-popup').conceal();
    });
    $storeLocatorFilterToggler.on('click', function(e) {
        e.preventDefault();
        $filterPanel.data('filter-popup').reveal();
    });
    /*---- Store Locator functions ----*/
    map.status.notify({
        message : 'loadingGoogleMap',
        loadingIndicator : true
    });
     var googleApi=''
	if(google_api_key!='' && google_api_key!='undefined'){
		googleApi='key='+google_api_key+'&'
	}
	
jQuery.getScript('https://maps.googleapis.com/maps/api/js?'+googleApi+'sensor=false&libraries=places&v=3.15&language='+ssf_m_lang+'&region='+ssf_m_rgn+'&callback=initStoreLocator');
    initStoreLocator = function() {
        map.status.notify({
            message : 'loadingGoogleMapUtilities',
            loadingIndicator : true
        });
        jQuery.getScript(ssf_wp_base +'/js/plugins/google-maps-utility-library/marker-with-label.packed.js', onLoad);
        jQuery.getScript(ssf_wp_base +'/js/plugins/google-maps-utility-library/infobox.packed.js', onLoad);
        var loadCounter = 0;
        function onLoad() {
            loadCounter++;
            if(loadCounter < 2) return;
            map.status.notify({
                message: 'startSearch',
                autoclose: true
            });
            /*---- Setup variables ----*/
            jQuery.extend(true, map, {
                markers : {
                    user : {},
                    stores : {
                        list : []
                    }
                }
            });
            /* Setup infobox variables */
            $els.storeLocatorInfoBox.init();
            $els.mobileStoreLocatorInfobox.init();
            setupMediaQueries();
            setupGeolocator();
            setupAutocompleter();
            setupEventHandlers();
            /*---- Setup XML ----*/
            if(typeof xml.data === 'undefined') {
                jQuery.ajax({
                    type: "GET",
                    url: urls.pathToXML + xml.filename,
                    dataType: "xml",
                    success: function(data) {
                        xml.data = data;
                        continueInit();
                    }
                });
            } else {
                continueInit();
            }
            function continueInit() {
                /*---- Setup legend ----*/
                legend = {};
                var radiosStrArray = [];
				var multiCatCheck;
				var multiCatType;
				if(addonMultiCategory!=undefined && addonMultiCategory==true){
                multiCatCheck='icon--checkbox-btn'; multiCatType='checkbox'; } else {
				multiCatCheck='icon--radio-btn'; multiCatType='radio';				
				}                jQuery(xml.data).find('label').each(function() {                    
				var tag = jQuery(this).find('tag').text().trim();                    
				var copy = jQuery(this).find('copy').text().trim();
                    legend[tag] = copy;                    
					radiosStrArray.push([                        
					'<label class="label--vertical-align ssflabel">',                            
					'<div class="label__input-icon">',                                
					'<i class="icon icon--input ',multiCatCheck,'"></i>',                            
					'</div>',                            
					'<div class="label__contents">',                                
					'<input type="',multiCatType,'" class="checkBoxClass" name="storesProductsServices" value="', tag, '" /> ', copy,      '</div>', '</label>' ].join(''));
                });
                jQuery('#productsServicesFilterOptions').append(radiosStrArray.join(''));
				if(ssf_default_category!='' && ssf_default_category!=undefined)	
			{
				jQuery(function() {
				setTimeout(function(){
					jQuery('input[value='+ssf_default_category+']').trigger('click');
					jQuery('#filter__services .filter__toggler').trigger('click');
					},3000);
				});
			}
                $els.filters.init().productsServices.inputify();
                /*---- Setup store count ----*/
                $els.totalStoreCount.text(jQuery(xml.data).find('item').length);
                startMap();
            }
        }
    function startMap() {
	   jQuery('#ssf-overlay').css('display','none');
	   jQuery('#ssf-dummy-blck').css('display','none');
	   jQuery('#ssf-preloader').css('display','none');
	   jQuery('#store-locator-section-bg').css('display','block');
	   jQuery('#mainPopupContat').css('display','block');
	   jQuery('#mainPopupHolder').css('display','block');
	   jQuery('#storeLocator__topHalf').css('display','block');
	   setTimeout(function(){
       jQuery('#store-locator-section-bg').addClass('store-locator-section-bg');
	  }, 1000);
	   var defaultLatLng
			if(default_location!='' && default_location!==undefined && ssf_wp_map_settings=='geo'){
			  geocoder = new google.maps.Geocoder();
			  geocoder.geocode( {'address':default_location,'region':''}, function(results, status) {
						if(status == google.maps.GeocoderStatus.OK) {
							defaultLatLng = results[0].geometry.location;
							loadDefaultMap(defaultLatLng);
							}
							
					});
			}else{
			   defaultLatLng = new google.maps.LatLng(40.705, -74.0139);
			   loadDefaultMap(defaultLatLng);
			}			
        }
		
		function loadDefaultMap(defaultLatLng){
		defualtLatLong=defaultLatLng;
		var scrollset = false;
			if(map_mouse_scroll==1){
			scrollset = true;
			}
			
			mapWithStyle = {
					center: defaultLatLng,
					styles:ssf_wp_map_code,
					streetViewControl: true,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.RIGHT_TOP
					},
					zoom: init_zoom,
					zoomControl: true,
					zoomControlOptions: {
						position: google.maps.ControlPosition.RIGHT_TOP
					},
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					scrollwheel: scrollset
				   };
				   
				   mapWithoutStyle = {
					center: defaultLatLng,
					streetViewControl: true,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.RIGHT_TOP
					},
					zoom: init_zoom,
					zoomControl: true,
					zoomControlOptions: {
						position: google.maps.ControlPosition.RIGHT_TOP
					},
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					scrollwheel: scrollset
				   };
				   
			if(ssf_wp_map_code!="" && ssf_wp_map_code!=undefined)
				{
					map.self = new google.maps.Map(map.el, mapWithStyle);
				} else {
						map.self = new google.maps.Map(map.el, mapWithoutStyle);
				}
            map.infobox.self = new InfoBox({
                content: map.infobox.el,
                pixelOffset: new google.maps.Size(35, -240),
                closeBoxMargin: "10px 10px 0 0",
                closeBoxURL:  ssf_wp_base+"/images/icons/cross-white.png"
            });
            $els.storeLocatorInfoBox.self.find('.infobox__closer').on('click', function(e) {
                e.preventDefault();
                map.infobox.self.close();
            });
            geolocator.watch();
		
		
		}
        function setupGeolocator() {
            jQuery.extend(true, geolocator, {
                watch : function() {
                    var self = this;
                    self.currentState = self.states.RUNNING;
                    map.status.notify({
                        message: 'gettingUserLocation',
                        loadingIndicator: true
                    });
                
                    self.$el.addClass('is-loading');
                    
			if(initTheMap=='' && ssf_wp_map_settings=='showall'){
					 searchForStores({productsServices : ssf_default_category});
			} else if(initTheMap=='' && default_location!='' && ssf_wp_map_settings=='specific'){
						jQuery('input#storeLocator__searchBar').val(default_location);
						jQuery('.icon--search').trigger('click');						
			} else {
			
                    map.watcher = navigator.geolocation.watchPosition(
                        /* Geolocation is successful */
                        function(position) {
                            if(self.currentState !== self.states.RUNNING) return;
                            self.rest();
                            calltodefualt==true;
                            var coordinates = position.coords,
                                userLatLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
                               
                            setMainMapMarker(userLatLng, 'Your current location');
                            map.status.notify({
                                message : 'lookingForNearbyStores',
                                loadingIndicator : true
                            });
							/* Category filter*/
							var categories = $els.filters.productsServices.filter(':checked').val();
							if(typeof categories!=='undefined' && categories!=''){
							  categories=categories;
							}else{
							  categories=ssf_default_category;
							}
							var setRadiuslimit=$els.filters.distance.filter(':checked').val();
								if(setRadiuslimit==undefined || setRadiuslimit==''){
								setRadiuslimit=ssf_distance_limit;
								}
                            searchForStores({
                                latLng : userLatLng,
                                distance : parseInt(setRadiuslimit),
								productsServices : categories,
                                centerOnUser : true,
                                onError : function() {
                                    map.status.notify({
                                        message : 'noStoresNearUser',
                                        closeable : true
                                    });
                                }
                            });
                        },
                        /* Geolocation has failed */
                        function(error) {
                            if(self.currentState !== self.states.RUNNING) return;
                            self.rest();
                            
                            switch(error.code) {
                                case error.TIMEOUT:
                                    map.status.notify({
                                        message : 'cantLocateUser',
                                        closeable : true
                                    });
                                break;
                                
                                default:
                                    locationNotAvailable();
                                break;
                            }
                        },
                        /* Geolocation settings */
                        {
                            enableHighAccuracy: true,
                            maximumAge: 30000,
                            timeout: 15000 /* 15 seconds */
                        }
                    );
			}
			
			initTheMap='1';
                    setTimeout(function() {
                        navigator.geolocation.clearWatch(map.watcher);
                    }, 20000)
                    
                    /**
                     * For cases like Firefox where if user chooses to temporarily deny
                     * permission to their location (by choosing "Not Now"), the geolocation
                     * function will NOT trigger any callback.
                     *
                     * This timeout is to make sure that something WILL happen after a
                     * specific amount of time, and we will be assuming that the geolocation
                     * has failed.
                     **/
                    geolocator.timer = setTimeout(function() {
                        /* hideMapFeedback(); */
						if(ssf_wp_map_settings=='geo' && calltodefualt==false){ defaultLocationStore(); }
                        self.rest();
                        locationNotAvailable();
                    }, 20000);
                },
                rest : function() {
                    if(!navigator.geolocation) return;
                    geolocator.currentState = geolocator.states.NEUTRAL;
                    navigator.geolocation.clearWatch(map.watcher);
                    clearTimeout(geolocator.timer);
                    geolocator.$el.removeClass('is-loading');
                }
            });
        }
		function defaultLocationStore(){
					searchForStores({
                                latLng : defualtLatLong,
                                distance : ssf_distance_limit,
								productsServices : ssf_default_category,
                                centerOnUser : true,
                                onError : function() {
                                    map.status.notify({
                                        message : 'noStoresNearUser',
                                        closeable : true
                                    });
                                }
                            });	
		}
        function setupMediaQueries() {
            FE.watchSize('large', function(mq) {
                isLargeScreen = mq;
                if(typeof map.markers.stores.current === 'undefined'
                || map.markers.stores.current === null) {
                    return;
                }
                if(isLargeScreen) {
                    map.infobox.self.open(map.self, map.markers.stores.current);
                }
            });
            FE.watchSize('medium', function(mq) {
                isMediumScreen = mq;
                if(typeof map.markers.stores.current === 'undefined'
                || map.markers.stores.current === null) {
                    return;
                }
                if(isMediumScreen) {
                    map.infobox.self.open(map.self, map.markers.stores.current);
                } else {
                    setMapCenter(map.markers.stores.current.position);
                    map.infobox.self.close();
                }
            });
        }
        function setupAutocompleter() {
		
           if(ssf_defualt_region=='false'){
               var _autocompleter = new google.maps.places.Autocomplete(autocompleter.el, {
                    componentRestrictions: {'country': ssf_m_rgn}
                });
             }else{
				var _autocompleter = new google.maps.places.Autocomplete(autocompleter.el, {
                });
            }

            google.maps.event.addListener(_autocompleter, 'place_changed', function() {
				 jQuery('div[title="Exit Street View"]').trigger('click');
                 var searchPlace = jQuery('#storeLocator__searchBar').val();
				  if(searchPlace!=''){
				  geocoder = new google.maps.Geocoder();
				  geocoder.geocode( {'address':searchPlace+', '+ssf_m_rgn}, function(results, status) {
							if(status == google.maps.GeocoderStatus.OK) {
								 placeLocation = results[0].geometry.location;
								 setMainMapMarker(placeLocation, 'Your search location: ' + searchPlace);
								 var categories = $els.filters.productsServices.filter(':checked').val();
								 var setRadiuslimit=$els.filters.distance.filter(':checked').val();
								if(setRadiuslimit==undefined || setRadiuslimit==''){
								setRadiuslimit=ssf_distance_limit;
								}
								searchForStores({
									latLng : placeLocation,
									distance : parseInt(setRadiuslimit),
									productsServices : categories,
									centerOnUser : true,
									onError : function() {
										map.status.notify({
											message : 'noStoresNearSearchLocation',
											closeable : true
										});
									}
								});
							
							} else {
							}
						});
 
					}
            });
			
			jQuery( ".icon--search" ).click(function() {
			jQuery('div[title="Exit Street View"]').trigger('click');
			  var searchPlace = jQuery('#storeLocator__searchBar').val();
			  if(searchPlace!=''){
			  geocoder = new google.maps.Geocoder();
			  geocoder.geocode( {'address':searchPlace+', '+ssf_m_rgn}, function(results, status) {
						if(status == google.maps.GeocoderStatus.OK) {
							placeLocation = results[0].geometry.location;
							 setMainMapMarker(placeLocation, 'Your search location: ' + searchPlace);
							var categories = $els.filters.productsServices.filter(':checked').val();					
							if(typeof categories!=='undefined' && categories!=''){		
							categories=categories;				
							}else{					
							categories=ssf_default_category;	
							}	
							var setRadiuslimit=$els.filters.distance.filter(':checked').val();
								if(setRadiuslimit==undefined || setRadiuslimit==''){
								setRadiuslimit=ssf_distance_limit;
								}
							searchForStores({
								latLng : placeLocation,
								distance : parseInt(setRadiuslimit),
								productsServices : categories,
								centerOnUser : true,
								onError : function() {
									map.status.notify({
										message : 'noStoresNearSearchLocation',
										closeable : true
									});
								}
							});
						
						} else {
							
							
						}
					});
		
				}
			});
			
			
			jQuery( "input[name='storesRegion']" ).click(function() {
		
			jQuery('div[title="Exit Street View"]').trigger('click');
			var searchPlace = jQuery("input[name=storesRegion]:checked").val()
			jQuery('input#storeLocator__searchBar').val(searchPlace);
			  if(searchPlace!=''){
			  geocoder = new google.maps.Geocoder();
			  geocoder.geocode( {'address':searchPlace,'region':ssf_m_rgn}, function(results, status) {
						if(status == google.maps.GeocoderStatus.OK) {
							placeLocation = results[0].geometry.location;
							 setMainMapMarker(placeLocation, 'Your search location: ' + searchPlace);
							 var categories = $els.filters.productsServices.filter(':checked').val();
							 var setRadiuslimit=$els.filters.distance.filter(':checked').val();
								if(setRadiuslimit==undefined || setRadiuslimit==''){
								setRadiuslimit=ssf_distance_limit;
								}
							searchForStores({
								latLng : placeLocation,
								distance : parseInt(setRadiuslimit),
								productsServices : categories,
								centerOnUser : true,
								onError : function() {
									map.status.notify({
										message : 'noStoresNearSearchLocation',
										closeable : true
									});
								}
							});
						
						} else {
							
							
						}
					});
				}
			});
            /*
             * FastClick and Google Map's Autocomplete have a conflict with each
             * other: FastClick prevents touchscreen from being able to select
             * the Autocomplete options. To fix this, whenever Autocomplete
             * inserts its results into the DOM, we need to add the `needsclick`
             * class to it.
             *
             * http://stackoverflow.com/questions/9972080/cant-tap-on-item-in-google-autocomplete-list-on-mobile
             */
            jQuery(document).on({
                'DOMNodeInserted': function() {
                    jQuery('.pac-item, .pac-item span', this).addClass('needsclick');
                }
            }, '.pac-container');
        }
        function setupEventHandlers() {
            /* Geolocator */
            geolocator.$el.on('click', function(e) {
                e.preventDefault();
				jQuery('div[title="Exit Street View"]').trigger('click');
                if(!jQuery(this).hasClass('is-loading')) {
                    geolocator.watch();
                }
            });
            /* Filter options clearer */
            jQuery('#filterOptionsClearer').on('click', function(e) {
                e.preventDefault();
				jQuery('.icon--radio-btn').removeClass('is-checked');
                jQuery.each($els.filters, function(key, value) {
                    if(typeof value !== 'object' || !value instanceof jQuery) return;
                    value.prop('checked', false).inputify('refresh');
                });
            });
            jQuery('#filterShowAll').on('click', function(e) {
                e.preventDefault();
				jQuery('#storesProductsServices').trigger('click');
                searchForStores();
            });
        /* Filter category */
			 jQuery('#storesProductsServices').change(function(){
					if(this.checked)
					 	jQuery(".icon--checkbox").addClass("is-checked");
					 else
					 	jQuery(".icon--checkbox").removeClass("is-checked");
						 
			 });
            /* Filter applier */
            jQuery('#applyFilterOptions').on('click', function(e) {
				var values;
               if(addonMultiCategory==true && addonMultiCategory!=undefined){				
			   if (jQuery('input#storesProductsServices').is(':checked')) {					
			   values=jQuery('#storesProductsServices').val();				
			   }				
			   else{
					var $langSelect = jQuery("input[type=checkbox][name='storesProductsServices']:checked");								if ($langSelect.length) {
					values = $langSelect.map(function(){
					return this.value;
							   }).get();
							   } else {
							   values='';
							   }	
						 }
				}
				else{
				values=$els.filters.productsServices.filter(':checked').val();
				}
                var distanceCheck=$els.filters.distance.filter(':checked').val();
				if(distanceCheck==undefined || distanceCheck==''){
				distanceCheck=ssf_distance_limit;
				}
                var filterProps = {
                        latLng : (map.markers.user.self)
                            ? map.markers.user.self.position
                            : undefined,
                        state : $els.filters.states.filter(':checked').val(),
                        outletType : $els.filters.outletTypes.filter(':checked').val(),
						distance : parseInt(distanceCheck),                       
						productsServices : values,
                        onError : function() {
                            map.status.notify({
                                message : 'noStoresFromFilter',
                                closeable : true
                            });
                        }
                    };
                if(typeof filterProps.state === 'undefined') {
                    jQuery.extend(filterProps, {
                        distance : filterProps.distance,
                        centerOnUser : true
                    });
                }
                searchForStores(filterProps);
            });
            /* Mobile infobox closer */
            $els.mobileStoreLocatorInfobox.self.find('.infobox__closer').on('click', function(e) {
                e.preventDefault();
                $els.mobileStoreLocatorInfobox.self.removeClass('is-shown');
            });
            /* Store List */
            $els.storeList.on('click', '.store-locator__infobox', function(e) {
                e.preventDefault();
                setCurrentStoreDetails(jQuery(this));
		
            });
            /* Map Status Response */
            map.status.$closer.on('click', function(e) {
                e.preventDefault();
                map.status.conceal();
            });
            /* Get Directions */
            $els.storeList.on('click', 'a', function(e) {
                e.stopPropagation();
            });
        }
        function makeStoreDetailsString($storeXMLElem, index, useLabel) {
		
            var _store = {
                    lat : getText($storeXMLElem.find('latitude')),
                    lng : getText($storeXMLElem.find('longitude')),
					storeimage : getText($storeXMLElem.find('storeimage')),
					custmmarker : getText($storeXMLElem.find('custmmarker')),
                    location : getText($storeXMLElem.find('location')),
                    address : getText($storeXMLElem.find('address')),
					website : getText($storeXMLElem.find('website')),
					exturl : getText($storeXMLElem.find('exturl')),
					embedvideo : getText($storeXMLElem.find('embedvideo')),
					defaultmedia : getText($storeXMLElem.find('defaultmedia')),
					email : getText($storeXMLElem.find('email')),
					contactus : getText($storeXMLElem.find('contactus')),
					telephone : getText($storeXMLElem.find('telephone')),
					fax : getText($storeXMLElem.find('fax')),
					description : getText($storeXMLElem.find('description')),
                    operatingHours : getText($storeXMLElem.find('operatingHours')),
					zip : getText($storeXMLElem.find('zip')),
					state : getText($storeXMLElem.find('state'))
                },
                letter = '',
                clearClass = '',
                getDirections = '<div class="infobox__row infobox__cta">&nbsp;</div>';
				getStreetView = '<div class="infobox__row infobox__stv">&nbsp;</div>';
				
            if(_store.lat && _store.lng) {
                letter = translateIntoLetter(index);
                getDirections = [
                    '<a href="https://maps.google.com/maps?',
                            (map.markers.user.self)
                                ? 'saddr=' + map.markers.user.self.getPosition() + '&'
                                : '',
                            'daddr=(', _store.lat, ', ', _store.lng, ')"',
                        ' target="new"',
                        ' class="infobox__row infobox__cta ssflinks">',
                        ssf_wp_direction_label,
                    '</a>'
                ].join('');
				
				getStreetView = [
                    '<a href="javascript:streetView(',_store.lat, ', ', _store.lng, ')"',
                        ' class="infobox__row infobox__stv">',
                        ssf_wp_streetview_label,
                    '</a>'
                ].join('');
				
            }
            if(index !== 0 && index % 3 === 0) {
                clearClass += ' medium-clear-left';
            }
	var ext_url;
	var ext_url_link;	
	if(_store.exturl!='' && _store.exturl!=undefined)
	{
		ext_url="<div class='btn-super-info'>"+ ssf_wp_ext_url_label +"</div>";
	}
	else{
		ext_url='';
	}var ssf_image_video='';
	var ssf_image_image='';	
	if(ssf_show_image_list=='showboth'  && _store.defaultmedia=='video' && _store.embedvideo!=''){	
	ssf_image_video=base64.decode(_store.embedvideo);	
	}			
	else if(ssf_show_image_list=='showboth' && _store.defaultmedia!='video'){
	ssf_image_image=(_store.storeimage!='')? _store.storeimage:ssf_wp_base+'/images/NoImage.png';	
	}

	/* Distance code here */		
function distance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  if (ssf_matrix=="miles") { 
     var dist = d * 0.621371; 
  }else{
     var dist = d;
  }
  return parseFloat(dist.toFixed(2));
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
    var storeDistance;
    if(map.markers.user.self!=undefined)
	{
          var currentPosition=map.markers.user.self.getPosition();
		  storeDistance= distance(_store.lat, _store.lng, currentPosition.lat(), currentPosition.lng());
	}
	
	else if(map.markers.user.self===undefined) {
         storeDistance= distance(_store.lat, _store.lng, defualtLatLong.lat(), defualtLatLong.lng());
	}
	else{
		storeDistance=0;
	}	
   if(ssf_tel_fax_link=='true'){
		if(_store.telephone!=''){
		 _store.telephone='<a href="tel:'+ _store.telephone+'">'+ _store.telephone+'</a>';
		 }
		 if(_store.fax!=''){
		 _store.fax='<a href="tel:'+ _store.fax+'">'+ _store.fax+'</a>';
		 }
	}	
/*End Here Code */	            
return [
                '<div class="medium-4', clearClass, ' ssf-column">',
                    '<div class="store-locator__infobox" id="store', index, '">',
                        '<div class="infobox__row infobox__row--marker">',    
                        '<div class="infobox__marker', (letter.length > 1) ? ' infobox__marker--small' : '', '">',
						letter,    '</div>',   
						'</div>',   
						'<div class="infobox__body">',
						'<div class="infobox__title ssf_image_setting" style="background-image: url(',ssf_image_image,');">', ssf_image_video,   
						'</div>',					
						'<div class="infobox__row infobox__title   store-image"  style="display:none;">', _store.storeimage,                           
						'</div>',                          
						'<div class="infobox__row infobox__title   store-location">',  
						_store.location,                          
						'</div>',                            
						'<div class="infobox__row   store-address">',  
						_store.address,                          
						'</div>',							
						'<div class="infobox__rows   store-distance" style="text-align:center">',  
						,'(',storeDistance, '&nbsp;',ssf_matrix,')',                            
						'</div>',						 					
						'<div class="infobox__row   store-website" style="display:none;"><a target="new" href="',_store.website.replace(/(http:\/\/)\1/, '$1'),'">', 
						_store.website, 
						'</a></div>',
						'<div class="infobox__row   store-exturl" style="display:none;"><a ',((ssf_wp_exturl_link=='true') ? "target='new'" : ""),' href="',_store.exturl.replace(/(http:\/\/)\1/, '$1'),'">',
                                ext_url, 
                            '</a></div>',
                            '<div class="infobox__row   store-email" style="display:none;"><a href="mailto:',_store.email,'">',
                                _store.email, 
                            '</a></div>',
							'<div class="infobox__row   store-tel" style="display:none;">',
                                _store.telephone, 
                            '</div>',
							
							'<div class="infobox__row   store-fax" style="display:none;">',
                                _store.fax, 
                            '</div>',
							
							'<div class="infobox__row   store-contactus" style="display:none;">',
                                _store.contactus, 
                            '</div>',
							
							'<div class="infobox__row   store-description" style="display:none;">',
                                _store.description, 
                            '</div>',
							'<div class="infobox__row   store-embedvideo" style="display:none;">',
                                _store.embedvideo, 
                            '</div>',
							'<div class="infobox__row   store-defaultmedia" style="display:none;">',
                                _store.defaultmedia, 
                            '</div>',
							'<div class="infobox__row   store-custom-marker" style="display:none;">',
                                _store.custmmarker, 
                            '</div>',
							
							'<div class="infobox__row   store-operating-hours" style="display:none;">',
                                _store.operatingHours, 
                            '</div>',
							'<div class="infobox__row   store-zip" style="display:none;">',
                                _store.zip, 
                            '</div>',
							
							'<div class="infobox__row   store-state" style="display:none;">',
                                _store.state, 
                            '</div>',
                        '</div>',
                        getDirections,
						'<div style="display:none;">',
						getStreetView,
						 '</div>',
                    '</div>',
                '</div>'
            ].join('');
} 
        function makeStoreProductsServicesString($storeXMLElem) {
            var servicesStrArr = [];
            jQuery.each(legend, function(tag, copy) {
                var $service = $storeXMLElem.find(tag);
                if(!$service.length) return;
                var serviceBoolStr = $service.text().trim();
                if(serviceBoolStr !== 'true') return;
                servicesStrArr.push([
                    '<li>', copy, '</li>'
                ].join(''));
            });
            return servicesStrArr.join('');
        }
        /**
         * Possible properties for the `settings` Object Literal to be passed
         * into searchForStores():
         
            settings = {
                latLng : (Object),
                state : (String),
                outletTypes : (String),
                productsServices : (String),
                centerOnUser : (Boolean),
                distance : (Number)
            }
         * All properties can be included/excluded as needed.
         **/
        function searchForStores(settings) {
            settings = settings || {};
			_map = map.self;
			if(ssf_wp_map_code!="" && ssf_wp_map_code!=undefined)
			{
			  _map.setOptions({styles: ssf_wp_map_code});	
			}
			
			else  {
			
			if(style_map_color!=""){
				  var styles = [
				  {
					stylers: [
					  { hue: style_map_color },
					  { saturation: 0 },
					  { lightness: 50 },
					  { gamma: 1 },
					]
				  }
				];
				_map.setOptions({styles: styles});
				}
			}
            geolocator.rest();
            map.infobox.self.close();
            $els.topHalf.addClass('has-searched');
            /* Only run the AJAX if there's no cached data */
            if(typeof xml.data === 'undefined') {
                jQuery.ajax({
                    type: "GET",
                    url: xml.url,
                    dataType: "xml",
                    success: function(data) {
                        xml.data = data;
                        addStores();
                    },
                    error : function() {
                        hideMapFeedback();
                        showStatusFeedback(messages.cantGetStoresInfo);
                    }
                });
            } else {
                addStores();
            }
            
            function addStores() {
                var targetItems,
                    storesXMLArray = [];
                /**
                 * We're about to add in the new search results, so have to reset
                 * a few things to get a (relatively) blank slate.
                 **/
				 if(markerCategory!=undefined && markerCategory==true)
				 { 
						 if(mc!=undefined)
						{
							mc.setMap(null);
						}
					markersc = [];
				}
				jQuery('#page_navigation').html('');
                map.markers.stores.current = null;
                while(map.markers.stores.list.length) {
                    map.markers.stores.list.shift().setMap(null);
                }
                $els.mobileStoreLocatorInfobox.self.removeClass('is-shown'); //hideCurrentStore();
                
                /* If a state is provided, then narrow down the stores to that state. */
                if(typeof settings.state === 'string' && settings.state !== 'default') {
                    targetItems = jQuery(xml.data).find(settings.state).find('item');
                } else {
                    targetItems = jQuery(xml.data).find('item');
                }
                targetItems.each(function(indexs) {
                    var $thisStore = jQuery(this),
                        storeLatNode = $thisStore.find('latitude'),
                        storeLngNode = $thisStore.find('longitude'),
						storeMrkNode = $thisStore.find('custmmarker').text().trim(),
                        storeLatLng = 'nope',
                        storeDistance = 'nope';
                    
                    /* Only proceed if complete coordinates are available */
                    if(storeLatNode.length && storeLngNode.length) {
                        /**
                         * Calculate distance. Needed to sort from nearest to furthest
                         * later in the function.
                         **/
                        storeLatLng = new google.maps.LatLng(parseFloat(storeLatNode.text()), parseFloat(storeLngNode.text()));
                        storeDistance = (typeof settings.latLng === 'undefined') ? 0 : distHaversine(settings.latLng, storeLatLng);
                        
                        /**
                         * If a set distance is provided, check and make sure it's not
                         * further than that. Otherwise, exit this iteration.
                         **/
                        if(typeof settings.distance === 'number'
                        && storeDistance > settings.distance) {
                            return;
                        }
                    } else if(!settings.state
                           || !$thisStore.parent().is(jQuery.trim(settings.state))) {
                        return;
                    }
                    
                    /**
                     * If an outlet type is provided, check and make sure it
                     * matches. Otherwise, exit this iteration.
                     **/
                    if(typeof settings.outletType === 'string'
                    && settings.outletType !== 'default'
                    && $thisStore.find('shopType').text() !== settings.outletType) {
                        return;
                    }
                    
                    /**
                     * If a type of product/service is provided, check and
                     * make sure it matches. Otherwise, exit this iteration.
                     **/
      if(addonMultiCategory==true && addonMultiCategory!=undefined){          if(settings.productsServices !==undefined && settings.productsServices !== 'default' && settings.productsServices !== '') {
				var found=1;
					if(settings.productsServices.constructor === Array)
					{
					for (var x in settings.productsServices){
						
							if($thisStore.find(settings.productsServices[x]).text() == 'true')
							 {
								found=0;
							 }
					  	 }
						 if(found!=0)
						{
						   return; 
						}
					}
					else if($thisStore.find(settings.productsServices).text() !== 'true'){
						return; 
					}
                  }
			}
			else{
			if(typeof settings.productsServices === 'string'
                    && settings.productsServices !== 'default'
                    && $thisStore.find(settings.productsServices).text() !== 'true' &&  settings.productsServices !== '') {
                        return;

                    }
			
			}                    
                    /**
                     * If we've made it this far, means it's okay to add this
                     * store into the arrays to be processed later.
                     **/
                    
                    if(storeLatLng !== 'nope') {
                        map.markers.stores.list.push({
                            latLng : storeLatLng,
                            distance : storeDistance,
							sortord : $thisStore.find('sortord').text().trim(),
							storeMNode:storeMrkNode,
                            storeLocation : $thisStore.find('location').text().trim()
                        })
                    }
                    storesXMLArray.push({
                        '$xml' : $thisStore,
						sortord : $thisStore.find('sortord').text().trim(),
                        distance : storeDistance
                    });
                });
                if(!storesXMLArray.length) {
                    var errorMessage = map.status.messages[settings.errorMessage] || settings.errorMessage;
                    if(typeof settings.onError === 'function') settings.onError('noResults');
                    $els.storeList.html('<div class="text-large text-center">' + map.status.messages.noStoresFound + '</div>');
                    $els.currentStoreCount.text('0');
                    return;
                }
                /* Update store count */
                $els.currentStoreCount.text(storesXMLArray.length);
                /**
                 * Sort array contents to be from closet to furthest
                 * in distance.
                 **/
                if(settings.distance!==undefined && settings.distance!==''){
					storesXMLArray.sort(distanceAscendingSorter);
					map.markers.stores.list.sort(distanceAscendingSorter);
				}
				else{
					storesXMLArray.sort(sortordAscendingSorter);
					map.markers.stores.list.sort(sortordAscendingSorter);
				}
                var maximumNumberOfLabels = 25,
                    storesStrArr = [];
                for(var i = 0, ii = storesXMLArray.length; i < ii; i++) {
                    storesStrArr.push(makeStoreDetailsString(storesXMLArray[i].$xml, i));
                }
                
                /* Populate the list of stores */
                $els.storeList.html(storesStrArr.join(''));
                $els.storeList.heightSyncify({
                    items : ['.infobox__body']
                });
                map.status.notify({
                    message : 'storesFound',
                    autoclose: true
                });
                
                /* Reset marker bounds */
                map.markers.bounds = new google.maps.LatLngBounds();
                var markerLabelClass,
                    markerLabelContent;
                for(var j = 0, jj = map.markers.stores.list.length; j < jj; j++) {
                    /**
                     * Only use labelled pins if there are less than 53 markers
                     * to place. We're using 53 as the reference value, because
                     * we have 26 letters in the alphabet, and we differentiate
                     * between upper case and lower case, thus our total options
                     * are 26 * 2 = 52 letters. So the number of labelled
                     * markers cannot be more than 52.
                     **/
					 
					 if(labeled_marker=='1'){
                    markerLabelContent = translateIntoLetter(j);
					} else {
					markerLabelContent = '';
					}
					
					if(map.markers.stores.list[j].storeMNode!='')
					{
						customMarkersUrl=map.markers.stores.list[j].storeMNode;
					}
					else{
						customMarkersUrl=urls.pathToIcons + urls.pins.regular;
					}
					
                    markerLabelClass = 'store-locator__map-pin';
                    if(j > maximumNumberOfLabels) {
                        markerLabelClass += '  store-locator__map-pin--small';
                    } else if(j > maximumNumberOfLabels + 9) {
                        markerLabelClass += '  store-locator__map-pin--xsmall';
                    }
                
                    map.markers.bounds.extend(map.markers.stores.list[j].latLng);
                    
                    map.markers.stores.list[j] = new MarkerWithLabel({
                        position: map.markers.stores.list[j].latLng,
                        map: map.self,
                        title: map.markers.stores.list[j].storeLocation,
                        icon: customMarkersUrl,
                        zIndex: jj-j,
                        labelContent: markerLabelContent,
                        labelClass: markerLabelClass,
                        originalLabelClass: markerLabelClass,
                        labelInBackground: false
                    });
						if(markerCategory!=undefined && markerCategory==true)
				        {  markersc.push(map.markers.stores.list[j]); }
                    /**
                     * Later when we adjust the icon to be in its active state,
                     * the z-ndex will be adjusted so it's always on the top.
                     * This property will then be referenced to reset the
                     * z-index back to its original value.
                     **/
                    map.markers.stores.list[j].originalZIndex = jj-j;
                
                    (function() {
                        var $targetStore = jQuery('#store' + j);
                
                        $targetStore.data('storeMarker', map.markers.stores.list[j]);
                        
                        google.maps.event.addListener(map.markers.stores.list[j], 'click', function() {
                            setCurrentStoreDetails($targetStore);
                        });
                    })();
                }
				if(markerCategory!='undefined' && markerCategory==true)
				  {
					  /* Marker Clusterer */
						var clusterStyle = [
						  {
							textColor: 'black',
							url: ssf_wp_uploads_base+'/addons/ssf-marker-cluster-wp/markerclusterer/m1.png',
							height: 53,
							width: 52
						  },
						 {
							textColor: 'black',
							url: ssf_wp_uploads_base+'/addons/ssf-marker-cluster-wp/markerclusterer/m2.png',
							height: 56,
							width: 55
						  },
						 {
							textColor: 'black',
							url: ssf_wp_uploads_base+'/addons/ssf-marker-cluster-wp/markerclusterer/m3.png',
							height: 66,
							width: 65
						  },
						 {
							textColor: 'black',
							url: ssf_wp_uploads_base+'/addons/ssf-marker-cluster-wp/markerclusterer/m4.png',
							height: 78,
							width: 77
						  },
						 {
							textColor: 'black',
							url: ssf_wp_uploads_base+'/addons/ssf-marker-cluster-wp/markerclusterer/m5.png',
							height: 90,
							width: 89
						  }
						];
				 		 var mcOptions = {styles: clusterStyle, minimumClusterSize : 2};
               			 mc = new MarkerClusterer(_map, markersc, mcOptions);
				 }
                if(storesXMLArray.length === 1) {
                    setCurrentStoreDetails(jQuery('#store0'));
                }
                
                if(typeof ssf_map_position!== 'undefined' && ssf_map_position=='false'){
				  map.self.fitBounds(map.markers.bounds);
				   map.self.setZoom(map.self.getZoom());			
				}
                else if(settings.centerOnUser) {
					if(zoom_level=='auto'){
                    map.self.fitBounds(map.markers.bounds);
					}
					if(typeof map.markers.user.self !== 'undefined')
					{
                    setMapCenter(map.markers.user.self.position, true);
					}

                } else {
                    map.self.setCenter(map.markers.bounds.getCenter());
					if(zoom_level=='auto'){
                    map.self.fitBounds(map.markers.bounds);
					}
                    map.self.setZoom(map.self.getZoom());
                }
				ssf_ifrane_vedio();
				if(ssf_pagination>0 && storesXMLArray.length>ssf_pagination){  pagging(ssf_pagination);  }
                if(typeof settings.onSuccess === 'function') settings.onSuccess();
            }
        }
		var imgToggleS = function(v,v2){
		
				jQuery('div .info-img').css('height','150px');
				jQuery('div .info-img').css('background-image','url('+v+')');
				jQuery('#storeLocatorInfobox').children('div .info-img').click(function() {
				  showPopup(v,v2);
				});
				
				 //alert(jQuery('div .info-img').css('background-image'));
			
		};
		
		var imgToggleH = function(){
		  jQuery('div .info-img').css('background-image','url("")');
				jQuery('#storeLocatorInfobox').children('div .info-img').unbind();
				jQuery('div .info-img').css('height','0px');
			
		};
        function setCurrentStoreDetails($targetStoreElem) {
		//setTimeout(function(){
		if($targetStoreElem.find('.store-tel').html()==""){
		jQuery('#info-tel').css('display','none');
		if(jQuery('#info-tel').is(":visible"))
		{
			jQuery('#info-tel').css('display','none');
		}
		} else {
		jQuery('#info-tel').css('display','block');
		}
		if($targetStoreElem.find('.store-description').html()==""){
		jQuery('#info-description').css('display','none');
		} else {
		jQuery('#info-description').css('display','block');
		}
		
		if($targetStoreElem.find('.store-contactus').html()==""){
		jQuery('.store-contact-us').css('display','none');
		} else {
		jQuery('.store-contact-us').css('display','block');
		}
		if($targetStoreElem.find('.store-operating-hours').html()==""){
		jQuery('.info-operatinghour').css('display','none');
		} else {
		jQuery('.info-operatinghour').css('display','block');
		}
		if($targetStoreElem.find('.store-website').html()=="" || $targetStoreElem.find('.store-website').html()=='<a target="new" href="http://"></a>' || $targetStoreElem.find('.store-website').html()=='<a target="new" href=""></a>'){
		jQuery('#info-website').css('display','none');
		} else {
		jQuery('#info-website').css('display','block');
		}
		
		if($targetStoreElem.find('.store-distance').html()==""){

		jQuery('.info-distance').css('display','none');

		} else {

		jQuery('.info-distance').css('display','block');

		}
				if($targetStoreElem.find('.store-exturl').html()=="" || $targetStoreElem.find('.store-exturl').html()=='<a target="new" href="http://"></a>' || $targetStoreElem.find('.store-exturl').html()=='<a target="new" href=""></a>'){
		jQuery('#info-exturl').css('display','none');
		} else {
		jQuery('#info-exturl').css('display','block');
		}
		if($targetStoreElem.find('.store-email').html()=="" || $targetStoreElem.find('.store-email').html()=='<a href="mailto:"></a>'){
		jQuery('#info-email').css('display','none');
		} else {
		jQuery('#info-email').css('display','block');
		}

		if($targetStoreElem.find('.store-fax').html()==""){
		jQuery('#info-fax').css('display','none');
		} else {
		jQuery('#info-fax').css('display','block');
		}
		
		if($targetStoreElem.find('.store-zip').html()==""){
		jQuery('#info-zip').css('display','none');
		} else {
		jQuery('#info-zip').css('display','block');
		}
		if($targetStoreElem.find('.store-state').html()==""){
		jQuery('#info-state').css('display','none');
		} else {
		jQuery('#info-state').css('display','block');
		}
		
		jQuery('.info__toggler').addClass('actives');
	    jQuery('.info__toggler').removeClass('is-toggled');
		jQuery('.info__toggler-contents').removeClass('is-toggled');
		//},200);
		
		if(scroll_setting=='true'){
		 jQuery("body").animate({scrollTop:scroll_to_top}, 'slow');
		}
		
		jQuery('div[title="Exit Street View"]').trigger('click');
            var _store = {
					storeimage : $targetStoreElem.find('.store-image').html(),
                    location : $targetStoreElem.find('.store-location').html(),
					custmmarker : $targetStoreElem.find('.store-custom-marker').html(),
                    address : $targetStoreElem.find('.store-address').html(),
					distance : $targetStoreElem.find('.store-distance').html(),
					website : $targetStoreElem.find('.store-website').html(),
					exturl : $targetStoreElem.find('.store-exturl').html(),
					embedvideo : $targetStoreElem.find('.store-embedvideo').html(),
					defaultmedia : $targetStoreElem.find('.store-defaultmedia').html(),
					email : $targetStoreElem.find('.store-email').html(),
					contactus : $targetStoreElem.find('.store-contactus').html(),
					telephone : $targetStoreElem.find('.store-tel').html(),
					fax : $targetStoreElem.find('.store-fax').html(),
					description : $targetStoreElem.find('.store-description').html(),
                    operatingHours : $targetStoreElem.find('.store-operating-hours').html(),
                    productsServices : $targetStoreElem.find('.store-products-services').html(),
                    directions : $targetStoreElem.find('.infobox__cta').attr('href'),
					streetview : $targetStoreElem.find('.infobox__stv').attr('href'),
					zip : $targetStoreElem.find('.store-zip').html(),
					state : $targetStoreElem.find('.store-state').html()
                };
                var custm='';
                var custm=_store.custmmarker;
				if(_store.defaultmedia=='image' || _store.defaultmedia==''){
					if(_store.storeimage!=''){
				   var splitstr  = _store.storeimage.split("/");
				   var ori_img = splitstr[splitstr.length-1];
				   var imgpath = '';
				   for(i=0;i<splitstr.length-1;i++){
				   imgpath += splitstr[i]+"/";
				   }
	
					setTimeout(function(){	
					jQuery('div .info-img').css('height','150px');
					jQuery('div .info-img').html('');
					jQuery('#storeLocatorInfobox').children('div .info-img').click(function() {
					  showPopup(_store.location,imgpath+ori_img);
					});
					jQuery('.info-img').css('background-image','url('+_store.storeimage+')'); 
					},200);
			
				} else {
					jQuery('div .info-img').html('');
					jQuery('div .info-img').css('background-image','url("")');
					jQuery('#storeLocatorInfobox').children('div .info-img').unbind();
					jQuery('div .info-img').css('height','0px');
					setTimeout(imgToggleH, 200);
				}
				
				} else {
				
				if(_store.embedvideo!=''){
					var video = base64.decode(_store.embedvideo);
					//var video = '[embed]https://www.youtube.com/watch?v=fQCH9l6A-xM[/embed]';
					//'<iframe width="100%" height="100%" src="https://www.youtube.com/embed/CieuGZ7TthE" frameborder="0" allowfullscreen></iframe>';
					//console.log(atob(_store.embedvideo));
					setTimeout(function(){	
					jQuery('div .info-img').css('background-image','url("")');
					jQuery('div .info-img').css('height','250px');
					jQuery('div .info-img').html(video);
					var jQueryallVideos = jQuery("iframe[src^='http']");
					jQueryallVideos.each(function() {
					jQuery(this)
						.data('aspectRatio', this.height / this.width)
						
						// and remove the hard coded width/height
						.removeAttr('height')
						.removeAttr('width');
					});
				
					var newWidth = "100%";
				
					jQueryallVideos.each(function() {
						var jQueryel = jQuery(this);
						jQueryel
							.width(newWidth)
							.height(newWidth);
					});
					
					},200);
				} else {
					jQuery('div .info-img').html('');
					jQuery('div .info-img').css('background-image','url("")');
					jQuery('#storeLocatorInfobox').children('div .info-img').unbind();
					jQuery('div .info-img').css('height','0px');
					setTimeout(imgToggleH, 200);
				}
				
				}
			if(_store.contactus!='')
				{
					jQuery('#modernBrowserConatct').on('click', '#contact-submit', function() {
						SendMail(_store.contactus);
					})
				}
            /**
             * If there is already a Current Store displayed, revert its pin
             * back to the inactive state.
             **/
			 
            if(typeof map.markers.stores.current !== 'undefined' 
            && map.markers.stores.current !== null) {
				map.markers.stores.current.set('labelClass', map.markers.stores.current.originalLabelClass);
				if(lastid!='')
				{
						map.markers.stores.current.setIcon(lastid);
				}
				else
				{
               		    map.markers.stores.current.setIcon(urls.pathToIcons + urls.pins.regular);
				}
                map.markers.stores.current.setZIndex(map.markers.stores.current.originalZIndex);
            }
            
            /**
             * Update the current store marker, and set it to an active state by:
             *   (1) changing its visual so it stands out, and
             *   (2) setting its z-index so it is always on top
             * If the store has no coordinates, then it will not have a
             * storeMarker. So check for that first before proceeding.
             **/
            map.markers.stores.current = $targetStoreElem.data('storeMarker');
            var thereIsCurrentStore = (typeof map.markers.stores.current !== 'undefined' 
                                      && map.markers.stores.current !== null);
            if(thereIsCurrentStore) {
                map.markers.stores.current.set('labelClass', map.markers.stores.current.originalLabelClass + ' is-active');
               if(custm!='')
				{
					lastid=custm;
					jQuery('.gmnoprint').children('img').unbind();
					map.markers.stores.current.setIcon(custm);
				}
				else
				{
					lastid='';
                	map.markers.stores.current.setIcon(urls.pathToIcons + urls.pins.active); /* (1) */
				}
                map.markers.stores.current.setZIndex(999); /* (2) */
                setMapCenter(map.markers.stores.current.position);
            }
            
            /**
             * Make the currently selected store stand out in the list.
             **/
            $els.storeList.find('.store-locator__infobox').removeClass('is-active');
            $targetStoreElem.addClass('is-active');
            /* Open the map infobox on medium screens and above */
            if(isMediumScreen) {
                if(thereIsCurrentStore) {
                    map.infobox.self.open(map.self, map.markers.stores.current);
                } else {
                    var mapCenter = map.self.getCenter(),
                        fauxMarker = new google.maps.Marker({
                            position : mapCenter
                        });
                    map.infobox.self.open(map.self, fauxMarker);
                }
            }
            
            /* Populate the details to the Current Store */
            var infoboxArray = [$els.storeLocatorInfoBox, $els.mobileStoreLocatorInfobox];
            while(infoboxArray.length) {
                infoboxArray[0].self.toggleClass('store-locator__infobox--no-pointer', !thereIsCurrentStore);
				infoboxArray[0].location.html(_store.storeimage);
                infoboxArray[0].location.html(_store.location);
                infoboxArray[0].address.html(_store.address);
				infoboxArray[0].distance.html(_store.distance);
				infoboxArray[0].website.html(_store.website);
				infoboxArray[0].exturl.html(_store.exturl);
				infoboxArray[0].email.html(_store.email);
				infoboxArray[0].telephone.html(_store.telephone);
				infoboxArray[0].fax.html(_store.fax);
				infoboxArray[0].description.html(_store.description);
                infoboxArray[0].operatingHours.html(_store.operatingHours);
                infoboxArray[0].productsServices.html(_store.productsServices);
				infoboxArray[0].zip.html(_store.zip);
				infoboxArray[0].state.html(_store.state);
                if(_store.directions) {
                    infoboxArray[0].directions.attr('href', _store.directions);
                    infoboxArray[0].directions.css('display', '');
                } else {
                    infoboxArray[0].directions.hide();
                }
				if(_store.streetview) {
                    infoboxArray[0].streetview.attr('href', _store.streetview);
                    infoboxArray[0].streetview.css('display', '');
                } else {
                    infoboxArray[0].streetview.hide();
                }
                infoboxArray.shift();
            }
            $els.mobileStoreLocatorInfobox.self.addClass('is-shown');
            /*
             * On large screens, scroll the window so that the map is at the center of
             * the window. On small screens, scroll the window so that the search bar
             * is at the top of the window.
             */
		if(scroll_setting=='true'){
            if(isLargeScreen) {
                jQuery(window).scrollTop($els.map.offset().top + $els.topHalf.height()*0.5 - jQuery(window).height()*0.25 - jQuery('#mainNav').height());
            } else if(isMediumScreen || thereIsCurrentStore) {
                jQuery(window).scrollTop($els.topHalf.offset().top - jQuery('#mainNav').height());
            } else {
                jQuery(window).scrollTop($els.mobileStoreLocatorInfobox.self.offset().top - jQuery('#mainNav').height());
            }
		}
            /*
            currentStore.$showDirections.attr('href', ['https://maps.google.com/maps?saddr=', mainMarker.getPosition(), '&daddr=', $targetStoreElem.data('storeMarker').getPosition()].join(''));
            */
        }
        function setMainMapMarker(latLng, markerTitle) {
            setMapCenter(latLng, true);
            if(typeof map.markers.user.self !== 'undefined') map.markers.user.self.setMap(null);
            map.markers.user.self = new MarkerWithLabel({
                position: latLng,
                map: map.self,
                animation: google.maps.Animation.DROP,
                title: markerTitle,
                zIndex: 98,
                icon: urls.pathToIcons + urls.pins.skeuomorph
            });
            google.maps.event.removeListener(map.markers.user.clicker);
            map.markers.user.clicker = google.maps.event.addListener(map.markers.user.self, 'click', function() {
                setMapCenter(map.markers.user.self.getPosition());
            });
        }
        function setMapCenter(latLng, fitBounds) {
            _map = map.self;
			if(ssf_wp_map_code!="" && ssf_wp_map_code!=undefined)
			{
			  _map.setOptions({styles: ssf_wp_map_code});	
			} else {
			if(style_map_color!=""){
				  var styles = [
				  {
					stylers: [
					  { hue: style_map_color },
					  { saturation: 0 },
					  { lightness: 50 },
					  { gamma: 1 },
					]
				  }
				];
				_map.setOptions({styles: styles});
				}
			}
				
            _map.setCenter(latLng);
                
            if(isLargeScreen) _map.panBy(-100, 0);
            if(_map.getZoom() < 13 && fitBounds !== true) _map.setZoom(14);
        }
        
        function translateIntoLetter(index) {
            if(index < 26) {
                switch(index) {
                    case 0:  return 'A'; break;
                    case 1:  return 'B'; break;
                    case 2:  return 'C'; break;
                    case 3:  return 'D'; break;
                    case 4:  return 'E'; break;
                    case 5:  return 'F'; break;
                    case 6:  return 'G'; break;
                    case 7:  return 'H'; break;
                    case 8:  return 'I'; break;
                    case 9:  return 'J'; break;
                    case 10: return 'K'; break;
                    case 11: return 'L'; break;
                    case 12: return 'M'; break;
                    case 13: return 'N'; break;
                    case 14: return 'O'; break;
                    case 15: return 'P'; break;
                    case 16: return 'Q'; break;
                    case 17: return 'R'; break;
                    case 18: return 'S'; break;
                    case 19: return 'T'; break;
                    case 20: return 'U'; break;
                    case 21: return 'V'; break;
                    case 22: return 'W'; break;
                    case 23: return 'X'; break;
                    case 24: return 'Y'; break;
                    case 25: return 'Z'; break;
                }
            } else {
                return '' + (index-25);
            }
        }
        function distanceAscendingSorter(a, b) {
            var distA = a.distance,
                distB = b.distance;
            if(distA === 'nope') distA = 9999999;
            if(distB === 'nope') distB = 9999999;
            return (distA - distB);
        }
		
		function sortordAscendingSorter(a, b) {
            var distA = a.sortord,
                distB = b.sortord;
            if(distA === 'nope') distA = 9999999;
            if(distB === 'nope') distB = 9999999;
            return (distA - distB);
        }
        
        /* Function to get the distance between two sets of Google LatLng objects. */
        function distHaversine(p1, p2) {
            var R = 6371; // earth's mean radius in km
            var dLat  = rad(p2.lat() - p1.lat());
            var dLong = rad(p2.lng() - p1.lng());
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return d.toFixed(3);
        }
        /* Convert unit to radian */
        function rad(x) {
            return x*Math.PI/180;
        }
        function getText($obj) {
            if(!$obj.length) return '';
            return jQuery.trim($obj.text());
        }
        function locationNotAvailable() {
            map.status.notify({
                message : 'notAllowedUserLocation',
                closeable : true
            });
            jQuery('<a href="#/" class="inline-space-left inline-space-right">'+ssfContinueAnyway+'</a>')
                .appendTo(map.status.$label)
                .on('click', function(e) {
                    e.preventDefault();
                    map.status.conceal();
                });
            map.status.$label.append('|');
            jQuery('<a href="#/" class="inline-space-left inline-space-right">'+ssfShareLocation+'</a>')
                .appendTo(map.status.$label)
                .on('click', function(e) {
                    e.preventDefault();
                    geolocator.watch();
                });
        }
    };
    function setupMapStatus() {
        jQuery.extend(map.status, {
            /*
             * Possible settings:
                map.status.notify({
                    message: (String),
                    closeable: (Implicit Boolean),
                    loadingIndicator: (Implicit Boolean),
                    autoclose: (Implicit Boolean)
                });
             * All can be included/excluded as necessary.
             */
            notify : function(settings) {
                var self = this;
                clearTimeout(self.timer);
                if(settings.message) {
                    var statusMessage = self.messages[settings.message] || settings.message;
                    self.$label.find('a').off();
                    self.$label.html(statusMessage);
                }
                self.$el.toggleClass('is-loading', Boolean(settings.loadingIndicator));
                self.$el.toggleClass('is-closeable', Boolean(settings.closeable));
                self.reveal();
                if(settings.autoclose) {
                    self.timer = setTimeout(function() {
                        self.conceal();
                    }, self.duration);
                }
            },
            reveal : function() {
                var $statusEl = this.$el,
                    targetHeight;
                if($statusEl.hasClass('is-shown')) return;
                $statusEl.css('height', 'auto');
                targetHeight = $statusEl.height();
                $statusEl
                    .css('height', '')
                    .addClass('is-shown');
                setTimeout(function() {
                    $statusEl
                        .off(FE.events.transitionEnd)
                        .on(FE.events.transitionEnd, function() {
                            jQuery(this)
                                .off(FE.events.transitionEnd)
                                .removeClass('is-transitionable')
                                .css('height', 'auto');
                        })
                        .addClass('is-transitionable')
                        .css('height', targetHeight + 'px');
                }, 5);
            },
            conceal : function() {
                var $statusEl = map.status.$el;
                $statusEl
                    .css('height', $statusEl.height())
                    .removeClass('is-shown');
                setTimeout(function() {
                    $statusEl
                        .off(FE.events.transitionEnd)
                        .on(FE.events.transitionEnd, function() {
                            jQuery(this)
                                .off(FE.events.transitionEnd)
                                .removeClass('is-transitionable');
                        })
                        .addClass('is-transitionable')
                        .css('height', '');
                }, 5);
            }
        });
    }
});

/**.** Open hour toogle code here **.**/
jQuery(".info__toggler").on("click", function(e){
var id= this.id;
if (jQuery('#'+id).hasClass('actives'))
	{
		jQuery('.info__toggler').addClass('actives');
		jQuery('#'+id).removeClass('actives');
	}
	else{
		jQuery('.info__toggler').addClass('actives');
		
	}
})
/**.**/

function streetView(lat,lng){

if(scroll_setting=='true'){
 jQuery("body").animate({scrollTop:scroll_to_top}, 'slow');
}
		   // street view
		   street = new google.maps.StreetViewPanorama(document.getElementById("storeLocatorMap"), { 
			position: new google.maps.LatLng(lat, lng),
			zoomControl: false,
			enableCloseButton: true,
			addressControl: false,
			panControl: true,
			linksControl: true
		  });
		}
var base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
base64.makeDOMException = function() {
    // sadly in FF,Safari,Chrome you can't make a DOMException
    var e, tmp;
    try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    } catch (tmp) {
        // not available, just passback a duck-typed equiv
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
        var ex = new Error("DOM Exception 5");
        // ex.number and ex.description is IE-specific.
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";
        // Safari/Chrome output format
        ex.toString = function() { return 'Error: ' + ex.name + ': ' + ex.message; };
        return ex;
    }
}
base64.getbyte64 = function(s,i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw base64.makeDOMException();
    }
    return idx;
}
base64.decode = function(s) {
    // convert to string
    s = '' + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax === 0) {
        return s;
    }
    if (imax % 4 !== 0) {
        throw base64.makeDOMException();
    }
    pads = 0
    if (s.charAt(imax - 1) === base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }
    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
            (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }
    switch (pads) {
    case 1:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
        break;
    case 2:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break;
    }
    return x.join('');
}
base64.getbyte = function(s,i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw base64.makeDOMException();
    }
    return x;
}
base64.encode = function(s) {
    if (arguments.length !== 1) {
        throw new SyntaxError("Not enough arguments");
    }
    var padchar = base64.PADCHAR;
    var alpha   = base64.ALPHA;
    var getbyte = base64.getbyte;
    var i, b10;
    var x = [];
    // convert to string
    s = '' + s;
    var imax = s.length - s.length % 3;
    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
    case 1:
        b10 = getbyte(s,i) << 16;
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               padchar + padchar);
        break;
    case 2:
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               alpha.charAt((b10 >> 6) & 0x3f) + padchar);
        break;
    }
    return x.join('');
}
function ssf_ifrane_vedio(){
	var jQueryallVideos = jQuery("iframe[src^='http']");
					jQueryallVideos.each(function() {
					jQuery(this)
						.data('aspectRatio', this.height / this.width)
						.removeAttr('height')
						.removeAttr('width');
					});
					var newWidth = "100%";
					jQueryallVideos.each(function() {
						var jQueryel = jQuery(this);
						jQueryel
							.width(newWidth)
							.height(newWidth);
					});
}
/* pagination code here */
var number_of_pages
function pagging(ssf_pagination){
	var show_per_page = ssf_pagination; 
	var number_of_items = jQuery('#storeLocator__storeList').children().size();
	number_of_pages = Math.ceil(number_of_items/show_per_page);
	jQuery('#current_page').val(0);
	jQuery('#show_per_page').val(show_per_page);
	jQuery('#storeLocator__currentStoreCount').html(number_of_items);
	if(number_of_pages>1)
	{
	var navigation_html = '<a class="previous_link arrow-toggler-left pagination-btn paginationgrey" id="ssf_previous_link" href="javascript:previous();">&nbsp; &nbsp; '+ssf_prev_label+'</a>';
	var current_link = 0;
	while(number_of_pages > current_link){
		navigation_html += '<a class="page_link" style="display:none;" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';
		current_link++;
	}
	navigation_html += '<a class="next_link arrow-toggler-right pagination-btn ssf-button" id="ssf_next_link" href="javascript:next();">'+ssf_next_label+' &nbsp; &nbsp;</a>';
	}else { var navigation_html=''; }
	jQuery('#page_navigation').html(navigation_html);
	jQuery('#page_navigation .page_link:first').addClass('active_page');
	jQuery('#storeLocator__storeList').children().css('display', 'none');
	jQuery('#storeLocator__storeList').children().slice(0, show_per_page).css('display', 'block');
}
function previous(){
	new_page = parseInt(jQuery('#current_page').val()) - 1;
	if(jQuery('.active_page').prev('.page_link').length==true){
		go_to_page(new_page);
	}
}
function next(){
	new_page = parseInt(jQuery('#current_page').val()) + 1;
	if(jQuery('.active_page').next('.page_link').length==true){
		go_to_page(new_page);
	}
}
function go_to_page(page_num){
   
	var show_per_page = parseInt(jQuery('#show_per_page').val());
	if(page_num==number_of_pages-1){
		jQuery('#ssf_next_link').addClass('paginationgrey');
		jQuery('#ssf_next_link').removeClass('ssf-button');
	}
	else{
		jQuery('#ssf_next_link').removeClass('paginationgrey');
		jQuery('#ssf_next_link').addClass('ssf-button');
	}
	if(page_num>0){
		jQuery('#ssf_previous_link').removeClass('paginationgrey');
		jQuery('#ssf_previous_link').addClass('ssf-button');
	}
	else{
	 jQuery('#ssf_previous_link').addClass('paginationgrey');
	 jQuery('#ssf_previous_link').removeClass('ssf-button');
	}
	start_from = page_num * show_per_page;
	end_on = start_from + show_per_page;
	jQuery('#storeLocator__storeList').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
	jQuery('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');
	jQuery('#current_page').val(page_num);
	jQuery('#storeLocator__storeList').heightSyncify({
                    items : ['.infobox__body']
                });
    jQuery('html, body').animate({ 'scrollTop' : jQuery("#storeLocator__storeList").position().top+250 }, 'slow');
}