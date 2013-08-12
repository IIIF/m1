// Manage the saving and retrieval of settings and // initialisation options.

(function($) {
  $.SaveController = function(options) {
    jQuery.extend(true, this, {
      saveInterval: $.DEFAULT_SETTINGS.saveController.saveInterval
    });
    this.save();
  };

  $.SaveController.prototype = {
    buildJSON : function() {

      var widgetIndex = {},
      configData = {
        id: 'viewer',
        data: [
        ]
      },
      buildWidgetJSON = function(widget) {

        var widgetState = {
          height: widget.getHeight(),
          width: widget.getWidth(),
          type: widget.type,
          position: widget.position
        };

        if (widgetState.type === 'imageView') {
          widgetState.openAt = widget.openAt,
          widgetState.zoomState = (function(bounds) {

            return {
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height
            };

          })(widget.viewObj.osd.viewport.getBounds()),
          widgetState.dimensions = [],
          widgetState.lockedViews = []
        }
        if (widgetState.type === "thumbnailsView") {

        }
        if (widgetState.type === "scrollView") {

        }
        // osdRect: 34,
        // scrollTop: 384,
        // thumbSize: 34,
        // scrollLeft: 234
        return widgetState;
      };

      // Build widgetIndex object for later reference. Add
      // objects as properties, with keys as manifestIds
      // and values of widget configuration properties.
      // See options for output examples.
      jQuery.each($.viewer.widgets, function(index, widget) {
        if (!widgetIndex[widget.manifestId]) {
          widgetIndex[widget.manifestId] = [];
        }
        widgetIndex[widget.manifestId].push(buildWidgetJSON(widget));
      });
      // console.log('widgetIndex');
      // console.log(widgetIndex);

      jQuery.each($.manifests, function(item) {

        var manifestEntry = {
          manifestUri: $.manifests[item].uri,
          title: $.getTitlePrefix($.getMetadataByManifestId(item).details)[0],
          widgets: []
        };

        if ( widgetIndex.hasOwnProperty(item) ) {

          manifestEntry.widgets = widgetIndex[item];

        }

        configData.data.push( manifestEntry );

      });

      // console.log('configData');
      // console.log(configData);

      return JSON.stringify(configData);
    },

    save : function() {
      if ($.viewer) {
        localStorage.setItem('Mirador_data', this.buildJSON());
      }

      // console.log("saved at " + Date.now());

      setTimeout( function(){
        $.viewer.saveController.save();
        $.viewer.addStatusBarMessage('right', 'Workspace saved at ' + (new Date()), 1000, false);
      }, ($.viewer) ? $.viewer.saveController.saveInterval : $.DEFAULT_SETTINGS.saveController.saveInterval);
    }
  };

})(Mirador);
