(function(Emi, $, undefined) {
    Emi.kb = Emi.kb || {};

    Emi.kb.Model = function(url, opt = {}) {
        var type = opt.type || ''; delete opt.type;
        var deferred = opt.deferred || false; delete deferred.type;
        var mod = deferred ?
            Backbone.Deferred.Model.extend(opt) :
            Backbone.Model.extend(opt);
        mod.prototype.urlRoot = url;
        mod.prototype.parse = function(data) {
            var item = data;
            if (Array.isArray(item)) {
                if (item.length === 0) {
                    // it's a problem
                    console.log('There is a problem');
                    return {};
                } else {
                    item = item[0]
                }
            }
            if (type === "mongo" && item && item._id) {
                item.id = item._id["$oid"] ? item._id["$oid"] : item._id;
            }
            return item;
        };
        return mod;
    };

    Emi.kb.Collection = function(model, opt = {}) {
        var deferred = opt.deferred || false; delete opt.deferred;
        var coll = deferred ?
            Backbone.Deferred.Collection.extend(opt) :
            Backbone.Collection.extend(opt);
        coll.prototype.model = model;
        coll.prototype.url = model.prototype.urlRoot;
        return coll;
    };
})((window.Emi = window.Emi || {}), jQuery);
