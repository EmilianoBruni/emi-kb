(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['knockout'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('knockout'));
    } else {
        root.KnockoutElse = factory(root.ko);
    }
}(this, function(ko) {
    "use strict";

    ko.bindingHandlers.htmlDefault = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            return {
                'controlsDescendantBindings': true
            };
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var self = ko.bindingHandlers.htmlDefault;
            var htmlValue, def, checkFunction, rawValue;
            var vUnwrap = ko.unwrap(valueAccessor());
            if (!!vUnwrap && typeof vUnwrap === "object" &&
                vUnwrap.constructor == Object) {
                htmlValue = ko.unwrap(vUnwrap.html);
                def = vUnwrap.default ?
                    ko.unwrap(vUnwrap.default) : self.default();
                checkFunction = vUnwrap.checkFunction ?
                    ko.unwrap(vUnwrap.checkFunction) : self.checkFunction;
                rawValue = vUnwrap.rawValue ?
                    ko.unwrap(vUnwrap.rawValue) : htmlValue;
            } else {
                htmlValue = vUnwrap;
                def = self.default();
                checkFunction = self.checkFunction;
                rawValue = htmlValue;
            };

            var updatedValue = checkFunction(vUnwrap.rawValue ? rawValue : htmlValue) ?
                htmlValue : def;
            ko.utils.setHtml(element, updatedValue);
        },
        default: function() {
            return '<i class="fa fa-spinner fa-pulse fa-fw"></i>';
        },
        checkFunction: function(value) {
            return value != undefined && value != null;
        }
    }

}));
