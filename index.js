"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Prompt = /** @class */ (function () {
    /**
     * If you will not use timeout, you can write the same type into both generic type parameter.
     * Like this:
     * ```ts
     * const promptees = new Prompt<Same, Same>();
     * ```
     * This will eliminate `{timeout: true}` from the return type of `waitForResponse()`.
     */
    function Prompt(opts) {
        this.promptees = {};
        if (opts === null || opts === void 0 ? void 0 : opts.timeout)
            this.timeout = opts.timeout;
        if (opts === null || opts === void 0 ? void 0 : opts.onTimeout)
            this.onTimeout = opts.onTimeout;
        if (opts === null || opts === void 0 ? void 0 : opts.loopWhen)
            this.loopWhen = opts.loopWhen;
        if (opts === null || opts === void 0 ? void 0 : opts.onLoop)
            this.onLoop = opts.onLoop;
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
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(identifier in this.promptees)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ((_b = (_a = this.promptees[identifier]) === null || _a === void 0 ? void 0 : _a.loopWhen) === null || _b === void 0 ? void 0 : _b.call(_a, value))];
                    case 1:
                        if (_e.sent()) {
                            (_d = (_c = this.promptees[identifier]) === null || _c === void 0 ? void 0 : _c.onLoop) === null || _d === void 0 ? void 0 : _d.call(_c, value);
                            return [2 /*return*/, true];
                        }
                        this.promptees[identifier].fn(value);
                        delete this.promptees[identifier];
                        return [2 /*return*/, true];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
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
                    _this.promptees[identifier].fn(((_b = ((_a = opts === null || opts === void 0 ? void 0 : opts.onTimeout) !== null && _a !== void 0 ? _a : _this.onTimeout)) === null || _b === void 0 ? void 0 : _b()) || { timeout: true });
                    delete _this.promptees[identifier];
                }, _this.timeout);
                _this.promptees[identifier] = {
                    fn: function (value) {
                        clearTimeout(timeoutId_1);
                        return resolve(value);
                    },
                };
            }
            else {
                _this.promptees[identifier] = {
                    fn: function (value) {
                        return resolve(value);
                    },
                };
            }
            _this.promptees[identifier].loopWhen = ((opts === null || opts === void 0 ? void 0 : opts.loopWhen) || _this.loopWhen);
            _this.promptees[identifier].onLoop = ((opts === null || opts === void 0 ? void 0 : opts.onLoop) || _this.onLoop);
        });
    };
    return Prompt;
}());
exports.default = Prompt;
