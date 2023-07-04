'use strict';

var DataSet = /** @class */ (function () {
    function DataSet(sheet) {
        this.sheet = sheet;
    }
    return DataSet;
}());

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var TableDataSet = /** @class */ (function (_super) {
    __extends(TableDataSet, _super);
    function TableDataSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TableDataSet;
}(DataSet));

var WILDCARD = '*';
/* event-emitter */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this._events = {};
    }
    /**
     * 监听一个事件
     * @param evt
     * @param callback
     * @param once
     */
    EventEmitter.prototype.on = function (evt, callback, once) {
        if (!this._events[evt]) {
            this._events[evt] = [];
        }
        this._events[evt].push({
            callback: callback,
            once: !!once,
        });
        return this;
    };
    /**
     * 监听一个事件一次
     * @param evt
     * @param callback
     */
    EventEmitter.prototype.once = function (evt, callback) {
        return this.on(evt, callback, true);
    };
    /**
     * 触发一个事件
     * @param evt
     * @param args
     */
    EventEmitter.prototype.emit = function (evt) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var events = this._events[evt] || [];
        var wildcardEvents = this._events[WILDCARD] || [];
        // 实际的处理 emit 方法
        var doEmit = function (es) {
            var length = es.length;
            for (var i = 0; i < length; i++) {
                if (!es[i]) {
                    continue;
                }
                var _a = es[i], callback = _a.callback, once = _a.once;
                if (once) {
                    es.splice(i, 1);
                    if (es.length === 0) {
                        delete _this._events[evt];
                    }
                    length--;
                    i--;
                }
                callback.apply(_this, args);
            }
        };
        doEmit(events);
        doEmit(wildcardEvents);
    };
    /**
     * 取消监听一个事件，或者一个channel
     * @param evt
     * @param callback
     */
    EventEmitter.prototype.off = function (evt, callback) {
        if (!evt) {
            // evt 为空全部清除
            this._events = {};
        }
        else {
            if (!callback) {
                // evt 存在，callback 为空，清除事件所有方法
                delete this._events[evt];
            }
            else {
                // evt 存在，callback 存在，清除匹配的
                var events = this._events[evt] || [];
                var length_1 = events.length;
                for (var i = 0; i < length_1; i++) {
                    if (events[i].callback === callback) {
                        events.splice(i, 1);
                        length_1--;
                        i--;
                    }
                }
                if (events.length === 0) {
                    delete this._events[evt];
                }
            }
        }
        return this;
    };
    /* 当前所有的事件 */
    EventEmitter.prototype.getEvents = function () {
        return this._events;
    };
    return EventEmitter;
}());

/**
 * 基础的表格
 */
var Sheet = /** @class */ (function (_super) {
    __extends(Sheet, _super);
    function Sheet(dom, dataConfig, config) {
        var _this = _super.call(this) || this;
        _this.dataConfig = dataConfig;
        _this.config = config;
        _this.dataSet = _this.getDataSet();
        return _this;
    }
    return Sheet;
}(EventEmitter));

var TableSheet = /** @class */ (function (_super) {
    __extends(TableSheet, _super);
    function TableSheet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableSheet.prototype.getDataSet = function () {
        return new TableDataSet(this);
    };
    return TableSheet;
}(Sheet));

exports.DataSet = DataSet;
exports.Sheet = Sheet;
exports.TableDataSet = TableDataSet;
exports.TableSheet = TableSheet;
//# sourceMappingURL=index.cjs.js.map
