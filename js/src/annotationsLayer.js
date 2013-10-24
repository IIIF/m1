(function($) {

  $.AnnotationsLayer = function(options) {

    jQuery.extend(true, this, {
      element:           null,
      sidePanelListing:  null,
      bottomPanel:       null,
      regionController:  null,
      width:             $.DEFAULT_SETTINGS.imageView.annotationsList.width,
      parent:            null,
      showList:          true,
      annotationUrls:    null,
      annotations:       [],
      commentAnnotations: 0,
      textAnnotations: 0,
      annotationListCls: 'mirador-annotation-list'
    }, options);

    this.create();
  };


  $.AnnotationsLayer.prototype = {

    create: function() {
      this.getAnnotations();
      this.element = jQuery($.Templates.imageView.annotationPanel({annotations: this.annotations})).resizable();
      this.parent.element.append(this.element);
      this.element.hide();
    },

    getAnnotations: function() {
      var _this = this;

      function parseRegion (url) {
        url = new URI(url);
        var regionString = url.hash(); 
        regionArray = regionString.split('=')[1].split(',');
        return regionArray;
      }

      function getOsdFrame (region) {
        var imgWidth = _this.parent.currentImg.width,
        imgHeight = _this.parent.currentImg.height,
        canvasWidth = _this.parent.currentImg.canvasWidth,
        canvasHeight = _this.parent.currentImg.canvasHeight,
        widthNormaliser = imgWidth/canvasWidth,
        heightNormaliser = imgHeight/canvasHeight,
        rectX = (region[0]*widthNormaliser)/imgWidth,
        rectY = (region[1]*heightNormaliser)/imgWidth,
        rectW = (region[2]*widthNormaliser)/imgWidth,
        rectH = (region[3]*heightNormaliser)/imgWidth;

        var osdFrame = new OpenSeadragon.Rect(rectX,rectY,rectW,rectH);

        return osdFrame;
      }

      jQuery.each(_this.annotationUrls, function(index, url) {

        jQuery.ajax({
          url: url,
          dataType: 'json',
          async: true,

          success: function(jsonLd) {
            jQuery.each(jsonLd.resources, function(index, resource) {
              var annotation = {
                region: parseRegion(resource.on),
                title: null,
                content: resource.resource.full ? resource.resource.full.chars : resource.resource.chars,
                type: (resource.motivation).split(':')[1],
                id: $.genUUID()
              };          

              annotation.osdFrame = getOsdFrame(annotation.region);

              if (annotation.type === 'commenting') { _this.commentAnnotations++; } else { _this.textAnnotations ++; }
              _this.annotations.push(annotation);
            });
          },

          error: function() {
            console.log('Failed loading ' + uri);
            // dfd.resolve(false);
          }
        });

      });
    },

    bindEvents: function() {
      _this = this;
      console.log('events bound');
      jQuery('.annotation').on('click', _this.clickAnnotation);
      jQuery('.annotation').on('hover', _this.hoverAnnotation);
      jQuery('.annotationListing').on('click', _this.clickAnnotationListing);
      jQuery('.annotationListing').on('hover', _this.hoverAnnotationListing);
    },

    clickAnnotation: function() {
      console.log('clicked anno');
    },

    hoverAnnotation: function() {
      console.log('hovered anno');
    },

    clickAnnotationListing: function() {
      var id = jQuery(this).attr('id');
      id = '#' + id.substring(8, 10000);
      var el = jQuery(id).attr('class','annotation selected');
      console.log(el);
      var annotationId = id.substring(1, 10000); 
      console.log(annotationId);
      var annotationFrame = jQuery.grep(_this.annotations, function(a) { return a.id === annotationId; } )[0].osdFrame;
      _this.parent.osd.viewport.fitBounds(annotationFrame);
      console.log('clicked listing');
    },

    hoverAnnotationListing: function() {
      console.log('hovered listing');
    },

    append: function(item) {
      this.element.append(item);
    },

    show: function() {
      this.render();
      this.element.fadeIn();
    },

    hide: function() {
      this.element.fadeOut();
    },

    render: function() {
      var _this = this; 
      var templateData = {
        annotations: this.annotations,
        annotationCount: this.annotations.length,
        imageAnnotationCount: this.commentAnnotations, //filtered
        textAnnotationCount: this.textAnnotations //filtered
      };

      this.element.replaceWith($.Templates.imageView.annotationPanel(templateData)).resizable();
      jQuery.each(this.annotations, function(index, annotation) {
        var elemString = '<div class="annotation" id="'+ annotation.id + '">',
        elem = jQuery(elemString)[0];

        _this.parent.osd.drawer.addOverlay(elem, annotation.osdFrame);
      });
      this.bindEvents();
    }

  };

}(Mirador));