'use strict';

var xssFilters = require('xss-filters');
var _ = require('lodash');

var _cfg = {
    filters: ['inHTMLData']
};

function Filter(cfg) {
    this.cfg = {};
    _.extend(this.cfg, _cfg, cfg);
}


Filter.prototype.sanitizeString = function (data) {
    this.cfg.filters.forEach(function (name) {
        data = xssFilters[name](data);
    });
    return data;
};

Filter.prototype.sanitize = function (obj) {

    var self = this;
    if(_.isString(obj)) {
        return this.sanitizeString(obj);
    }
    if(_.isPlainObject(obj)) {
        var ret = {};
        _.forEach(obj, function (v, k) {
            ret[k] = self.sanitize(v);
        });
        return ret;
    }
    if(_.isArray(obj)) {
        return _.map(obj, function (v) {
            return self.sanitize(v);
        });
    }
    return obj;
};

module.exports = function (cfg) {
    return new Filter(cfg);
};
