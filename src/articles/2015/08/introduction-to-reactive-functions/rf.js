(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var currentId = 0;
var currentContext;
var ChangeEmitter = (function () {
    function ChangeEmitter() {
        this.id = currentId++;
        this.listeners = [];
    }
    ChangeEmitter.prototype.addChangeListener = function (fn) {
        this.listeners.push(fn);
    };
    ChangeEmitter.prototype.removeChangeListener = function (fn) {
        var indexOf = this.listeners.indexOf(fn);
        if (indexOf > -1) {
            this.listeners.splice(indexOf, 1);
        }
    };
    ChangeEmitter.prototype.emitChange = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener();
        }
    };
    return ChangeEmitter;
})();
exports.ChangeEmitter = ChangeEmitter;
var Context = (function (_super) {
    __extends(Context, _super);
    function Context(fn, parent) {
        var _this = this;
        if (parent === void 0) { parent = currentContext; }
        _super.call(this);
        this.fn = fn;
        this.parent = parent;
        this.cache = {};
        this._changeListener = function () { return _this.run(); };
        this.queued = false;
        this.running = false;
        this.stopped = false;
        if (parent) {
            parent.add(this);
        }
    }
    Context.prototype.add = function (value) {
        if (this.stopped) {
            if (value instanceof Context) {
                value.stop();
            }
            return;
        }
        if (!this.queued && !this.cache[value.id]) {
            this.cache[value.id] = value;
            value.addChangeListener(this._changeListener);
        }
    };
    Context.prototype.empty = function () {
        for (var _i = 0, _a = Object.keys(this.cache); _i < _a.length; _i++) {
            var id = _a[_i];
            var value = this.cache[id];
            value.removeChangeListener(this._changeListener);
            delete this.cache[id];
            if (value instanceof Context) {
                value.stop();
            }
        }
    };
    Context.prototype.stop = function () {
        this.empty();
        this.stopped = true;
    };
    Context.prototype.run = function () {
        this.empty();
        if (this.stopped) {
            return;
        }
        if (this.running) {
            this.queued = true;
            return;
        }
        var fn = this.fn;
        var prevContext = currentContext;
        this.queued = false;
        this.running = true;
        currentContext = this;
        fn(this);
        currentContext = prevContext;
        this.running = false;
        if (this.queued) {
            this.run();
        }
    };
    return Context;
})(ChangeEmitter);
exports.Context = Context;
var Store = (function (_super) {
    __extends(Store, _super);
    function Store(value) {
        _super.call(this);
        this.value = value;
    }
    Store.prototype.update = function (value) {
        if (this.value !== value) {
            this.value = value;
            this.emitChange();
        }
    };
    return Store;
})(ChangeEmitter);
exports.Store = Store;
function prop(value) {
    var store = new Store(value);
    function gettersetter() {
        if (arguments.length) {
            store.update(arguments[0]);
        }
        else if (currentContext) {
            currentContext.add(store);
        }
        return store.value;
    }
    ;
    gettersetter.toJSON = function () { return store.value; };
    return gettersetter;
}
exports.prop = prop;
function run(fn, parent) {
    var context = new Context(fn, parent);
    context.run();
    return function () { return context.stop(); };
}
exports.run = run;

},{}]},{},[1])(1)
});
