(function($) {

  $.AnnotationBottomPanel = function(options) {
    jQuery.extend(true, this, {
      visible:true
    }, options);


    this.create();
  };

  $.AnnotationBottomPanel.prototype = {

    create: function() {
      console.log("annotation Bottom Panel created");
      var element = jQuery($.Templates.imageView.annotationDetail( {body: "sample Body, yo"} ));
      console.log(element);
    },

    append: function(item) {
    },

    render: function() {

    },

    show: function() {
      // this.element.fadeIn();
    },

    hide: function() {
      // this.element.fadeOut();
    }


  };

}(Mirador));