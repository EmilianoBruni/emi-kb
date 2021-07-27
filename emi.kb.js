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
        var pageable = opt.pageable || false; delete opt.pageable;
        var coll = deferred ? Backbone.Deferred.Collection.extend(opt) : null;
        if (pageable) {
            opt.state = _.defaults(opt.state || {}, {
                firstPage: 1,
                currentPage: 1,
                totalRecords: 200,
                pageSize: 10,
            });
            opt.queryParams = _.defaults(opt.queryParams || {}, {
                currentPage: "page",
                pageSize: "limit",
                sortKey: "sort",
                addRecordsCount: "with_count",
            });
            opt.parseState = function (resp, queryParams, state, options) {
                return {totalRecords: resp.count};
            };
            opt.parseRecords = function (resp, options) {
                return resp.recs;
            };
            opt.fetch = function(options) {
                options = options || {};
                // add addRecordsCount to querystring that you can use
                // to add record counts to you results{count: n, recs: [...]}
                if (this.queryParams.addRecordsCount != '') {
                    options.data = options.data || {};
                    options.data[this.queryParams.addRecordsCount] = 1;
                }
                Backbone.PageableCollection.prototype.fetch.call(this, options);
            };
            coll = Backbone.PageableCollection.extend(opt);
        }
        if (!coll) coll = Backbone.Collection.extend(opt);
        coll.prototype.model = model;
        coll.prototype.url = model.prototype.urlRoot;
        return coll;
    };
})((window.Emi = window.Emi || {}), jQuery);
