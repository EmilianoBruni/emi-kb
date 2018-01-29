(function(Emi, $, undefined) {
  Emi.kb = Emi.kb || {};

  Emi.kb.Model = function(url, opt = {}) {
    var type = opt.type || '';
    var deferred = opt.deferred || false;
    var mod = deferred
        ? Backbone.Deferred.Model.extend()
        : Backbone.Model.extend();
    mod.prototype.urlRoot = url;
    mod.prototype.parse = function(data) {
      var item = data[0] ? data[0] : data;
      if (type === "mongo") {
        if (item) {
          if (item._id) item.id = item._id["$oid"];
        }
      }
      return item;
    };
    return mod;
  };

  Emi.kb.Collection = function(model, opt = {}) {
    var deferred = opt.deferred || false;
    var coll = deferred
        ? Backbone.Deferred.Collection.extend()
        : Backbone.Collection.extend();
    coll.prototype.model = model;
    coll.prototype.url = model.prototype.urlRoot;
    return coll;
  };
})((window.Emi = window.Emi || {}), jQuery);
