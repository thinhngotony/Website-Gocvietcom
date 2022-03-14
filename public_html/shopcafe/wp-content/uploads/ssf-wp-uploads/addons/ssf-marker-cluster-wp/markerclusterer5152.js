/*jslint browser: true, confusion: true, sloppy: true, vars: true, nomen: false, plusplus: false, indent: 2 */

/*global window,google */



function ClusterIcon(cluster, styles) {

  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);



  this.cluster_ = cluster;

  this.styles_ = styles;

  this.center_ = null;

  this.div_ = null;

  this.sums_ = null;

  this.visible_ = false;



  this.setMap(cluster.getMap()); // Note: this causes onAdd to be called

}





/**

 * Adds the icon to the DOM.

 */

ClusterIcon.prototype.onAdd = function () {

  var cClusterIcon = this;



  this.div_ = document.createElement("div");

  if (this.visible_) {

    this.show();

  }



  this.getPanes().overlayMouseTarget.appendChild(this.div_);



  google.maps.event.addDomListener(this.div_, "click", function () {

    var mc = cClusterIcon.cluster_.getMarkerClusterer();

    /**

     * This event is fired when a cluster marker is clicked.

     * @name MarkerClusterer#click

     * @param {Cluster} c The cluster that was clicked.

     * @event

     */

    google.maps.event.trigger(mc, "click", cClusterIcon.cluster_);

    google.maps.event.trigger(mc, "clusterclick", cClusterIcon.cluster_); // deprecated name



    // The default click handler follows. Disable it by setting

    // the zoomOnClick property to false.

    var mz = mc.getMaxZoom();

    if (mc.getZoomOnClick()) {

      // Zoom into the cluster.

      mc.getMap().fitBounds(cClusterIcon.cluster_.getBounds());

      // Don't zoom beyond the max zoom level

      if (mz && (mc.getMap().getZoom() > mz)) {

        mc.getMap().setZoom(mz + 1);

      }

    }

  });



  google.maps.event.addDomListener(this.div_, "mouseover", function () {

    var mc = cClusterIcon.cluster_.getMarkerClusterer();

  

    google.maps.event.trigger(mc, "mouseover", cClusterIcon.cluster_);

  });



  google.maps.event.addDomListener(this.div_, "mouseout", function () {

    var mc = cClusterIcon.cluster_.getMarkerClusterer();

  

    google.maps.event.trigger(mc, "mouseout", cClusterIcon.cluster_);

  });

};







ClusterIcon.prototype.onRemove = function () {

  if (this.div_ && this.div_.parentNode) {

    this.hide();

    google.maps.event.clearInstanceListeners(this.div_);

    this.div_.parentNode.removeChild(this.div_);

    this.div_ = null;

  }

};







ClusterIcon.prototype.draw = function () {

  if (this.visible_) {

    var pos = this.getPosFromLatLng_(this.center_);

    this.div_.style.top = pos.y + "px";

    this.div_.style.left = pos.x + "px";

  }

};







ClusterIcon.prototype.hide = function () {

  if (this.div_) {

    this.div_.style.display = "none";

  }

  this.visible_ = false;

};







ClusterIcon.prototype.show = function () {

  if (this.div_) {

    var pos = this.getPosFromLatLng_(this.center_);

    this.div_.style.cssText = this.createCss(pos);

    if (this.cluster_.printable_) {

      

      this.div_.innerHTML = "<img src='" + this.url_ + "'><div style='position: absolute; top: 0px; left: 0px; width: " + this.width_ + "px;'>" + this.sums_.text + "</div>";

    } else {

      this.div_.innerHTML = this.sums_.text;

    }

    this.div_.title = this.cluster_.getMarkerClusterer().getTitle();

    this.div_.style.display = "";

  }

  this.visible_ = true;

};







ClusterIcon.prototype.useStyle = function (sums) {

  this.sums_ = sums;

  var index = Math.max(0, sums.index - 1);

  index = Math.min(this.styles_.length - 1, index);

  var style = this.styles_[index];

  this.url_ = style.url;

  this.height_ = style.height;

  this.width_ = style.width;

  this.anchor_ = style.anchor;

  this.textColor_ = style.textColor || "black";

  this.textSize_ = style.textSize || 11;

  this.textDecoration_ = style.textDecoration || "none";

  this.fontWeight_ = style.fontWeight || "bold";

  this.fontStyle_ = style.fontStyle || "normal";

  this.fontFamily_ = style.fontFamily || "Arial,sans-serif";

  this.backgroundPosition_ = style.backgroundPosition || "0 0";

};





ClusterIcon.prototype.setCenter = function (center) {

  this.center_ = center;

};





ClusterIcon.prototype.createCss = function (pos) {

  var style = [];

  if (!this.cluster_.printable_) {

    style.push('background-image:url(' + this.url_ + ');');

    style.push('background-position:' + this.backgroundPosition_ + ';');

  }



  if (typeof this.anchor_ === 'object') {

    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&

        this.anchor_[0] < this.height_) {

      style.push('height:' + (this.height_ - this.anchor_[0]) +

          'px; padding-top:' + this.anchor_[0] + 'px;');

    } else {

      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +

          'px;');

    }

    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&

        this.anchor_[1] < this.width_) {

      style.push('width:' + (this.width_ - this.anchor_[1]) +

          'px; padding-left:' + this.anchor_[1] + 'px;');

    } else {

      style.push('width:' + this.width_ + 'px; text-align:center;');

    }

  } else {

    style.push('height:' + this.height_ + 'px; line-height:' +

        this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');

  }



  style.push('cursor:pointer; top:' + pos.y + 'px; left:' +

      pos.x + 'px; color:' + this.textColor_ + '; position:absolute; font-size:' +

      this.textSize_ + 'px; font-family:' + this.fontFamily_ + '; font-weight:' +

      this.fontWeight_ + '; font-style:' + this.fontStyle_ + '; text-decoration:' +

      this.textDecoration_ + ';');

  return style.join("");

};





ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {

  var pos = this.getProjection().fromLatLngToDivPixel(latlng);

  pos.x -= parseInt(this.width_ / 2, 10);

  pos.y -= parseInt(this.height_ / 2, 10);

  return pos;

};





function Cluster(mc) {

  this.markerClusterer_ = mc;

  this.map_ = mc.getMap();

  this.gridSize_ = mc.getGridSize();

  this.minClusterSize_ = mc.getMinimumClusterSize();

  this.averageCenter_ = mc.getAverageCenter();

  this.printable_ = mc.getPrintable();

  this.markers_ = [];

  this.center_ = null;

  this.bounds_ = null;

  this.clusterIcon_ = new ClusterIcon(this, mc.getStyles());

}





Cluster.prototype.getSize = function () {

  return this.markers_.length;

};





Cluster.prototype.getMarkers = function () {

  return this.markers_;

};





Cluster.prototype.getCenter = function () {

  return this.center_;

};





Cluster.prototype.getMap = function () {

  return this.map_;

};





Cluster.prototype.getMarkerClusterer = function () {

  return this.markerClusterer_;

};





Cluster.prototype.getBounds = function () {

  var i;

  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);

  var markers = this.getMarkers();

  for (i = 0; i < markers.length; i++) {

    bounds.extend(markers[i].getPosition());

  }

  return bounds;

};





Cluster.prototype.remove = function () {

  this.clusterIcon_.setMap(null);

  this.markers_ = [];

  delete this.markers_;

};





Cluster.prototype.addMarker = function (marker) {

  var i;

  var mCount;



  if (this.isMarkerAlreadyAdded_(marker)) {

    return false;

  }



  if (!this.center_) {

    this.center_ = marker.getPosition();

    this.calculateBounds_();

  } else {

    if (this.averageCenter_) {

      var l = this.markers_.length + 1;

      var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;

      var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;

      this.center_ = new google.maps.LatLng(lat, lng);

      this.calculateBounds_();

    }

  }



  marker.isAdded = true;

  this.markers_.push(marker);



  mCount = this.markers_.length;

  if (this.map_.getZoom() > this.markerClusterer_.getMaxZoom()) {

    // Zoomed in past max zoom, so show the marker.

    if (marker.getMap() !== this.map_) {

      marker.setMap(this.map_);

    }

  } else if (mCount < this.minClusterSize_) {

    // Min cluster size not reached so show the marker.

    if (marker.getMap() !== this.map_) {

      marker.setMap(this.map_);

    }

  } else if (mCount === this.minClusterSize_) {

    // Hide the markers that were showing.

    for (i = 0; i < mCount; i++) {

      this.markers_[i].setMap(null);

    }

  } else {

    marker.setMap(null);

  }



  this.updateIcon_();

  return true;

};





Cluster.prototype.isMarkerInClusterBounds = function (marker) {

  return this.bounds_.contains(marker.getPosition());

};





Cluster.prototype.calculateBounds_ = function () {

  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);

  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);

};





Cluster.prototype.updateIcon_ = function () {

  var mCount = this.markers_.length;



  if (this.map_.getZoom() > this.markerClusterer_.getMaxZoom()) {

    this.clusterIcon_.hide();

    return;

  }



  if (mCount < this.minClusterSize_) {

    // Min cluster size not yet reached.

    this.clusterIcon_.hide();

    return;

  }



  var numStyles = this.markerClusterer_.getStyles().length;

  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);

  this.clusterIcon_.setCenter(this.center_);

  this.clusterIcon_.useStyle(sums);

  this.clusterIcon_.show();

};





Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {

  var i;

  if (this.markers_.indexOf) {

    return this.markers_.indexOf(marker) !== -1;

  } else {

    for (i = 0; i < this.markers_.length; i++) {

      if (marker === this.markers_[i]) {

        return true;

      }

    }

  }

  return false;

};





function MarkerClusterer(map, opt_markers, opt_options) {

  

  this.extend(MarkerClusterer, google.maps.OverlayView);



  opt_markers = opt_markers || [];

  opt_options = opt_options || {};



  this.markers_ = [];

  this.clusters_ = [];

  this.listeners_ = [];

  this.activeMap_ = null;

  this.ready_ = false;



  this.gridSize_ = opt_options.gridSize || 60;

  this.minClusterSize_ = opt_options.minimumClusterSize || 2;

  this.maxZoom_ = opt_options.maxZoom || null;

  this.styles_ = opt_options.styles || [];

  this.title_ = opt_options.title || "";

  this.zoomOnClick_ = true;

  if (opt_options.zoomOnClick !== undefined) {

    this.zoomOnClick_ = opt_options.zoomOnClick;

  }

  this.averageCenter_ = false;

  if (opt_options.averageCenter !== undefined) {

    this.averageCenter_ = opt_options.averageCenter;

  }

  this.ignoreHidden_ = false;

  if (opt_options.ignoreHidden !== undefined) {

    this.ignoreHidden_ = opt_options.ignoreHidden;

  }

  this.printable_ = false;

  if (opt_options.printable !== undefined) {

    this.printable_ = opt_options.printable;

  }

  this.imagePath_ = opt_options.imagePath || MarkerClusterer.IMAGE_PATH;

  this.imageExtension_ = opt_options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;

  this.imageSizes_ = opt_options.imageSizes || MarkerClusterer.IMAGE_SIZES;

  this.calculator_ = opt_options.calculator || MarkerClusterer.CALCULATOR;

  this.batchSizeIE_ = opt_options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;



  if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {

    

    this.batchSize_ = this.batchSizeIE_;

  } else {

    this.batchSize_ = MarkerClusterer.BATCH_SIZE;

  }



  this.setupStyles_();



  this.addMarkers(opt_markers, true);

  this.setMap(map); 

}





MarkerClusterer.prototype.onAdd = function () {

  var cMarkerClusterer = this;



  this.activeMap_ = this.getMap();

  this.ready_ = true;



  this.repaint();



  

  this.listeners_ = [

    google.maps.event.addListener(this.getMap(), "zoom_changed", function () {

      cMarkerClusterer.resetViewport_(false);

    }),

    google.maps.event.addListener(this.getMap(), "idle", function () {

      cMarkerClusterer.redraw_();

    })

  ];

};





MarkerClusterer.prototype.onRemove = function () {

  var i;



 

  for (i = 0; i < this.markers_.length; i++) {

    this.markers_[i].setMap(this.activeMap_);

  }



 

  for (i = 0; i < this.clusters_.length; i++) {

    this.clusters_[i].remove();

  }

  this.clusters_ = [];



 

  for (i = 0; i < this.listeners_.length; i++) {

    google.maps.event.removeListener(this.listeners_[i]);

  }

  this.listeners_ = [];



  this.activeMap_ = null;

  this.ready_ = false;

};





MarkerClusterer.prototype.draw = function () {};





MarkerClusterer.prototype.setupStyles_ = function () {

  var i, size;

  if (this.styles_.length > 0) {

    return;

  }



  for (i = 0; i < this.imageSizes_.length; i++) {

    size = this.imageSizes_[i];

    this.styles_.push({

      url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,

      height: size,

      width: size

    });

  }

};





MarkerClusterer.prototype.fitMapToMarkers = function () {

  var i;

  var markers = this.getMarkers();

  var bounds = new google.maps.LatLngBounds();

  for (i = 0; i < markers.length; i++) {

    bounds.extend(markers[i].getPosition());

  }



  this.getMap().fitBounds(bounds);

};





MarkerClusterer.prototype.getGridSize = function () {

  return this.gridSize_;

};





MarkerClusterer.prototype.setGridSize = function (gridSize) {

  this.gridSize_ = gridSize;

};





MarkerClusterer.prototype.getMinimumClusterSize = function () {

  return this.minClusterSize_;

};



MarkerClusterer.prototype.setMinimumClusterSize = function (minimumClusterSize) {

  this.minClusterSize_ = minimumClusterSize;

};





MarkerClusterer.prototype.getMaxZoom = function () {

  return this.maxZoom_ || this.getMap().mapTypes[this.getMap().getMapTypeId()].maxZoom;

};





MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {

  this.maxZoom_ = maxZoom;

};





MarkerClusterer.prototype.getStyles = function () {

  return this.styles_;

};





MarkerClusterer.prototype.setStyles = function (styles) {

  this.styles_ = styles;

};





MarkerClusterer.prototype.getTitle = function () {

  return this.title_;

};





MarkerClusterer.prototype.setTitle = function (title) {

  this.title_ = title;

};





MarkerClusterer.prototype.getZoomOnClick = function () {

  return this.zoomOnClick_;

};





MarkerClusterer.prototype.setZoomOnClick = function (zoomOnClick) {

  this.zoomOnClick_ = zoomOnClick;

};





MarkerClusterer.prototype.getAverageCenter = function () {

  return this.averageCenter_;

};





MarkerClusterer.prototype.setAverageCenter = function (averageCenter) {

  this.averageCenter_ = averageCenter;

};





MarkerClusterer.prototype.getIgnoreHidden = function () {

  return this.ignoreHidden_;

};





MarkerClusterer.prototype.setIgnoreHidden = function (ignoreHidden) {

  this.ignoreHidden_ = ignoreHidden;

};





MarkerClusterer.prototype.getImageExtension = function () {

  return this.imageExtension_;

};





MarkerClusterer.prototype.setImageExtension = function (imageExtension) {

  this.imageExtension_ = imageExtension;

};





MarkerClusterer.prototype.getImagePath = function () {

  return this.imagePath_;

};





MarkerClusterer.prototype.setImagePath = function (imagePath) {

  this.imagePath_ = imagePath;

};



MarkerClusterer.prototype.getImageSizes = function () {

  return this.imageSizes_;

};





MarkerClusterer.prototype.setImageSizes = function (imageSizes) {

  this.imageSizes_ = imageSizes;

};





MarkerClusterer.prototype.getCalculator = function () {

  return this.calculator_;

};





MarkerClusterer.prototype.setCalculator = function (calculator) {

  this.calculator_ = calculator;

};





MarkerClusterer.prototype.getPrintable = function () {

  return this.printable_;

};





MarkerClusterer.prototype.setPrintable = function (printable) {

  this.printable_ = printable;

};





MarkerClusterer.prototype.getBatchSizeIE = function () {

  return this.batchSizeIE_;

};





MarkerClusterer.prototype.setBatchSizeIE = function (batchSizeIE) {

  this.batchSizeIE_ = batchSizeIE;

};





MarkerClusterer.prototype.getMarkers = function () {

  return this.markers_;

};





MarkerClusterer.prototype.getTotalMarkers = function () {

  return this.markers_.length;

};





MarkerClusterer.prototype.getTotalClusters = function () {

  return this.clusters_.length;

};





MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {

  this.pushMarkerTo_(marker);

  if (!opt_nodraw) {

    this.redraw_();

  }

};





MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {

  var i;

  for (i = 0; i < markers.length; i++) {

    this.pushMarkerTo_(markers[i]);

  }

  if (!opt_nodraw) {

    this.redraw_();

  }

};





MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {

  // If the marker is draggable add a listener so we can update the clusters on the dragend:

  if (marker.getDraggable()) {

    var cMarkerClusterer = this;

    google.maps.event.addListener(marker, "dragend", function () {

      if (cMarkerClusterer.ready_) {

        this.isAdded = false;

        cMarkerClusterer.repaint();

      }

    });

  }

  marker.isAdded = false;

  this.markers_.push(marker);

};





MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {

  var removed = this.removeMarker_(marker);



  if (!opt_nodraw && removed) {

    this.repaint();

  }



  return removed;

};





MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {

  var i, r;

  var removed = false;



  for (i = 0; i < markers.length; i++) {

    r = this.removeMarker_(markers[i]);

    removed = removed || r;

  }



  if (!opt_nodraw && removed) {

    this.repaint();

  }



  return removed;

};





MarkerClusterer.prototype.removeMarker_ = function (marker) {

  var i;

  var index = -1;

  if (this.markers_.indexOf) {

    index = this.markers_.indexOf(marker);

  } else {

    for (i = 0; i < this.markers_.length; i++) {

      if (marker === this.markers_[i]) {

        index = i;

        break;

      }

    }

  }



  if (index === -1) {

    // Marker is not in our list of markers, so do nothing:

    return false;

  }



  marker.setMap(null);

  this.markers_.splice(index, 1); // Remove the marker from the list of managed markers

  return true;

};





MarkerClusterer.prototype.clearMarkers = function () {

  this.resetViewport_(true);

  this.markers_ = [];

};





MarkerClusterer.prototype.repaint = function () {

  var oldClusters = this.clusters_.slice();

  this.clusters_ = [];

  this.resetViewport_(false);

  this.redraw_();



  // Remove the old clusters.

  // Do it in a timeout to prevent blinking effect.

  setTimeout(function () {

    var i;

    for (i = 0; i < oldClusters.length; i++) {

      oldClusters[i].remove();

    }

  }, 0);

};





MarkerClusterer.prototype.getExtendedBounds = function (bounds) {

  var projection = this.getProjection();



  // Turn the bounds into latlng.

  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),

      bounds.getNorthEast().lng());

  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),

      bounds.getSouthWest().lng());



  // Convert the points to pixels and the extend out by the grid size.

  var trPix = projection.fromLatLngToDivPixel(tr);

  trPix.x += this.gridSize_;

  trPix.y -= this.gridSize_;



  var blPix = projection.fromLatLngToDivPixel(bl);

  blPix.x -= this.gridSize_;

  blPix.y += this.gridSize_;



  // Convert the pixel points back to LatLng

  var ne = projection.fromDivPixelToLatLng(trPix);

  var sw = projection.fromDivPixelToLatLng(blPix);



  // Extend the bounds to contain the new bounds.

  bounds.extend(ne);

  bounds.extend(sw);



  return bounds;

};





MarkerClusterer.prototype.redraw_ = function () {

  this.createClusters_(0);

};





MarkerClusterer.prototype.resetViewport_ = function (opt_hide) {

  var i, marker;

  // Remove all the clusters

  for (i = 0; i < this.clusters_.length; i++) {

    this.clusters_[i].remove();

  }

  this.clusters_ = [];



  // Reset the markers to not be added and to be removed from the map.

  for (i = 0; i < this.markers_.length; i++) {

    marker = this.markers_[i];

    marker.isAdded = false;

    if (opt_hide) {

      marker.setMap(null);

    }

  }

};





MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {

  var R = 6371; // Radius of the Earth in km

  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;

  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +

    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *

    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;

  return d;

};





MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {

  return bounds.contains(marker.getPosition());

};





MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {

  var i, d, cluster, center;

  var distance = 40000; // Some large number

  var clusterToAddTo = null;

  for (i = 0; i < this.clusters_.length; i++) {

    cluster = this.clusters_[i];

    center = cluster.getCenter();

    if (center) {

      d = this.distanceBetweenPoints_(center, marker.getPosition());

      if (d < distance) {

        distance = d;

        clusterToAddTo = cluster;

      }

    }

  }



  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {

    clusterToAddTo.addMarker(marker);

  } else {

    cluster = new Cluster(this);

    cluster.addMarker(marker);

    this.clusters_.push(cluster);

  }

};





MarkerClusterer.prototype.createClusters_ = function (iFirst) {

  var i, marker;

  var cMarkerClusterer = this;

  if (!this.ready_) {

    return;

  }



  // Cancel previous batch processing if we're working on the first batch:

  if (iFirst === 0) {

    

    google.maps.event.trigger(this, "clusteringbegin", this);



    if (typeof this.timerRefStatic !== "undefined") {

      clearTimeout(this.timerRefStatic);

      delete this.timerRefStatic;

    }

  }



  // Get our current map view bounds.

  // Create a new bounds object so we don't affect the map.

  var mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),

      this.getMap().getBounds().getNorthEast());

  var bounds = this.getExtendedBounds(mapBounds);



  var iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);



  for (i = iFirst; i < iLast; i++) {

    marker = this.markers_[i];

    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {

      if (!this.ignoreHidden_ || (this.ignoreHidden_ && marker.getVisible())) {

        this.addToClosestCluster_(marker);

      }

    }

  }



  if (iLast < this.markers_.length) {

    this.timerRefStatic = setTimeout(function () {

      cMarkerClusterer.createClusters_(iLast);

    }, 0);

  } else {

    delete this.timerRefStatic;



   

    google.maps.event.trigger(this, "clusteringend", this);

  }

};





MarkerClusterer.prototype.extend = function (obj1, obj2) {

  return (function (object) {

    var property;

    for (property in object.prototype) {

      this.prototype[property] = object.prototype[property];

    }

    return this;

  }).apply(obj1, [obj2]);

};





MarkerClusterer.CALCULATOR = function (markers, numStyles) {

  var index = 0;

  var count = markers.length.toString();



  var dv = count;

  while (dv !== 0) {

    dv = parseInt(dv / 10, 10);

    index++;

  }



  index = Math.min(index, numStyles);

  return {

    text: count,

    index: index

  };

};





MarkerClusterer.BATCH_SIZE = 2000;





MarkerClusterer.BATCH_SIZE_IE = 500;





MarkerClusterer.IMAGE_PATH = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/images/m";





MarkerClusterer.IMAGE_EXTENSION = "png";





MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90];

