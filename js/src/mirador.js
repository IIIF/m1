window.Mirador = window.Mirador || function(config) {

  if (Mirador.DEFAULT_SETTINGS.workspaceAutoSave) {

    // retrieve any saved settings or configuration options from
    // the localstorage database, merging them with the current
    // settings and configuration.
    //
    // acts as a "guard" function in the initialisation process.
    Mirador.settingsLoader = new Mirador.SettingsLoader(config);

    config = Mirador.settingsLoader.config;
    // console.log('Loaded Config:');
    // console.log(config);
  }

  // Render viewer using loaded manifests data
  Mirador.viewer = new Mirador.Viewer(config);

  // Fetch manifest, parse and render widgets from config
  Mirador.manifests = new Mirador.ManifestsLoader(config);
};

(function($) {

  /**
   * Default values for settings
   */
  $.DEFAULT_SETTINGS = {

    'workspaceAutoSave': false,
    'initialLayout': 'cascade',

    'availableViews': {
      'imageView': {
        'label': 'Image View'
      },
      'scrollView': {
        'label': 'Scroll View'
      },
      'thumbnailsView': {
        'label': 'Thumbnails View'
      },
      'metadataView': {
        'label': 'Metadata View'
      }
    },

    'maxWidgetsLimit': 10,

    // main (top) menu
    'mainMenu': {
      'height': 25,
      'width': '100%'
    },

    // status bar
    'statusBar': {
      'show': true,
      'height': 25,
      'width': '100%'
    },

    // scale
    'scale': {
      'height': 60,
      'maxWidth': 230
    },

    // widget
    'widget': {
      'height': 400,
      'width': 400
    },

    // widget toolbar
    'widgetToolbar': {
      'height': 25
    },

    // widget status bar
    'widgetStatusBar': {
      'height': 26
    },

    // image view
    'imageView': {
      'height': 400,
      'width': 350
    },

    // scroll view
    'scrollView': {
      'height': 400,
      'imageLabelHeight': 25,
      'toolbarHeight': 25,
      'width': 600
    },

    // thumbnails view
    'thumbnailsView': {
      'height': 400,
      'thumbsMaxHeight': 150,
      'thumbsMinHeight': 50,
      'thumbsDefaultZoom': .5,
      'width': 600
    },

    // metadata view
    'metadataView': {
      'height': 400,
      'width': 600
    },

    // parameters of saving system
    'saveController': {
      'saveInterval': 8000 // number of milliseconds between automatic saves.
    }
  };


  $.isValidView = function(view) {
    return (typeof $.DEFAULT_SETTINGS.availableViews.view === 'undefined');
  };


  $.inArrayToBoolean = function(index) {
    return index === -1 ? false : true;
  };


  $.castToArray = function(obj) {
    return (typeof obj === 'string') ? [obj] : obj;
  };


  // Removes duplicates from an array.
  $.getUniques = function(arr) {
    var temp = {},
        unique = [];

    for (var i = 0; i < arr.length; i++) {
      temp[arr[i]] = true;
    }

    for (var k in temp) {
      unique.push(k);
    }

    return unique;
  }


  $.getTitlePrefix = function(details) {
    var prefixes = [];

    if (details && details.label) {
      prefixes.push(details.label);
    }

    return prefixes.join(' / ');
  };


  $.trimString = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
  };


  $.getJsonFromUrl = function(url, async) {
    var json;

    jQuery.ajax({
      url: url,
      dataType: 'json',
      async: async || false,

      success: function(data) {
        json = data;
      },

      error: function(xhr, status, error) {
        console.log(xhr, status, error);
      }
    });

    return json;
  };


  $.getViewLabel = function(type) {
    var view = $.DEFAULT_SETTINGS.availableViews[type];

    return (view && view.label) ? view.label : type;
  };


  // Temporary method to create Stanford IIIF uri from Stanford stacks non-IIIF URI
  $.getIiifUri = function(uri) {
    var iiifUri = uri,
    match = /http?:\/\/stacks.stanford.edu\/image\/(\w+\/\S+)/i.exec(uri);

    if (match && match.length === 2) {
      iiifUri = 'https://stacks.stanford.edu/image/iiif/' + encodeURIComponent(match[1]);
    }

    return iiifUri;
  };


  $.getIiifUriWithHeight = function(uri, height) {
    return $.getIiifUri(uri) + '/full/,' + height + '/0/native.jpg';
  };


  $.extractLabelFromAttribute = function(attr) {
    var label = attr;

    label = label.replace(/^@/, '');
    label = label.replace(/([A-Z])/g, ' $1');
    label = label.replace(/\s{2,}/g, ' ');
    label = label.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    return label;
  };


  $.toString = function(obj, delimiter) {
    var str = '',
        joint = delimiter || ' ';

    if (jQuery.type(obj) === 'string') {
      str = obj;
    }

    if (jQuery.isArray(obj)) {
      str = obj.join(joint);
    }

    return str;
  };


  /* --------------------------------------------------------------------------
     Methods related to manifest data
     -------------------------------------------------------------------------- */

  $.getManifestIdByUri = function(uri) {
    var id;

    id = jQuery.map($.manifests, function(manifest, manifestId) {
      if (uri === manifest.uri) {
        return manifestId;
      }
    });

    return id[0] || id;
  };


  $.getMetadataByManifestId = function(manifestId) {
    return $.manifests[manifestId].metadata;
  };


  $.getImagesListByManifestId = function(manifestId) {
    return $.manifests[manifestId].sequences[0].imagesList;
  };


  $.getCollectionTitle = function(metadata) {
    return metadata.details.label || '';
  };


  $.getImageTitles = function(images) {
    var data = [];

    jQuery.each(images, function(index, image) {
      data.push({
        'title': image.title
      });
    });

    return data;
  };

}(Mirador));


/* --------------------------------------------------------------------------
   jQuery extensions
   -------------------------------------------------------------------------- */

// for scroll view
// source: http://stackoverflow.com/questions/14035083/jquery-bind-event-on-scroll-stops
jQuery.fn.scrollStop = function(callback) {
  $(this).scroll(function() {
    var self  = this,
        $this = $(self);

    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }

    $this.data('scrollTimeout', setTimeout(callback, 250, self));
  });
};
