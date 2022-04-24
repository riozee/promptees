"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prompt = /** @class */ (function () {
    function Prompt() {
        this.promptees = {};
    }
    Prompt.prototype.isPrompting = function (identifier, value) {
        if (identifier in this.promptees) {
            this.promptees[identifier](value);
            delete this.promptees[identifier];
            return true;
        }
        else {
            return false;
        }
    };
    Prompt.prototype.waitForResponse = function (identifier) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.promptees[identifier] = function (value) {
                return resolve(value);
            };
        });
    };
    return Prompt;
}());
exports.default = Prompt;
