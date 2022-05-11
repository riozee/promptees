"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prompt = /** @class */ (function () {
    function Prompt(opts) {
        this.promptees = {};
        if (opts === null || opts === void 0 ? void 0 : opts.timeout)
            this.timeout = opts.timeout;
        if (opts === null || opts === void 0 ? void 0 : opts.onTimeout)
            this.onTimeout = opts.onTimeout;
    }
    /**
     * Check if identifier is waiting for an input.
     *
     * @returns {boolean} True if identifier is in promptees list. Otherwise False.
     */
    Prompt.prototype.isPrompting = function (identifier) {
        if (identifier in this.promptees) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Resolves `waitForResponse()` called with the same identifier.
     *
     * @param value The value returned by `waitForResponse()`
     * @returns {boolean} True if identifier is in promptees list. Otherwise False.
     */
    Prompt.prototype.returnPrompt = function (identifier, value) {
        if (identifier in this.promptees) {
            this.promptees[identifier](value);
            delete this.promptees[identifier];
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Prompt the user!
     *
     * Resolves after calling returnPrompt() with the same identifier. Returns the value passed to returnPrompt().
     *
     * If timeout and onTimeout are set, it will call onTimeout() and returns the value after the timeout has elapsed.
     * Otherwise, if onTimeout is not set, it will return {timeout: true}.
     *
     * @resolves Value passed to `returnPrompt()` with the same identifier.
     */
    Prompt.prototype.waitForResponse = function (identifier, opts) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a;
            if (((_a = opts === null || opts === void 0 ? void 0 : opts.timeout) !== null && _a !== void 0 ? _a : _this.timeout) > 0) {
                var timeoutId_1 = setTimeout(function () {
                    var _a, _b;
                    _this.promptees[identifier](((_b = ((_a = opts === null || opts === void 0 ? void 0 : opts.onTimeout) !== null && _a !== void 0 ? _a : _this.onTimeout)) === null || _b === void 0 ? void 0 : _b()) || { timeout: true });
                    delete _this.promptees[identifier];
                }, _this.timeout);
                _this.promptees[identifier] = function (value) {
                    clearTimeout(timeoutId_1);
                    return resolve(value);
                };
            }
            else {
                _this.promptees[identifier] = function (value) {
                    return resolve(value);
                };
            }
        });
    };
    return Prompt;
}());
exports.default = Prompt;
