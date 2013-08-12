// Manage the saving and retrieval of settings and
// initialisation options.

(function($) {

  $.SettingsLoader = function(options) {
    var _this = this;
    jQuery.extend(true, this, {
      config : (_this.load()) ? _this.load() : options
    });
    // console.log('loaded Object:');
    // console.log(_this.load());
  };

  $.SettingsLoader.prototype = {
    load : function() {
      if (!localStorage.getItem('Mirador_data')) {
        return false;
      }
      return JSON.parse(localStorage.getItem('Mirador_data'));
    }
  };

})(Mirador);
