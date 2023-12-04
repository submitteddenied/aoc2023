"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2D = exports.Region2D = exports.Map2D = void 0;
var Map2D = /** @class */ (function () {
    function Map2D() {
        this.regions = [];
    }
    Map2D.prototype.width = function (zeroBasis) {
        if (zeroBasis === void 0) { zeroBasis = false; }
        return this.widthOrHeight(zeroBasis, 'x');
    };
    Map2D.prototype.height = function (zeroBasis) {
        if (zeroBasis === void 0) { zeroBasis = false; }
        return this.widthOrHeight(zeroBasis, 'y');
    };
    Map2D.prototype.add = function (region) {
        this.regions.push(region);
    };
    Map2D.prototype.widthOrHeight = function (zeroBasis, xOrY) {
        var min = Number.MAX_SAFE_INTEGER;
        var max = Number.MIN_SAFE_INTEGER;
        this.regions.forEach(function (r) {
            min = Math.min(min, r.position[xOrY]);
            max = Math.max(max, r.position[xOrY]);
        });
        if (zeroBasis) {
            return max;
        }
        return max - min;
    };
    Map2D.prototype.adjacentRegions = function (region) {
        //make a new pseudo region which is +1 in all directions
        var hitbox = new Region2D(new Vector2D(region.position.x - 1, region.position.y - 1), region.w + 2, region.h + 2, undefined);
        var result = [];
        for (var i = 0; i < this.regions.length; i++) {
            if (this.regions[i] === region) {
                continue;
            }
            if (this.regions[i].intersects(hitbox)) {
                result.push(this.regions[i]);
            }
        }
        return result;
    };
    Map2D.prototype.toString = function (formatter) {
        var result = [];
        for (var i = 0; i < this.regions.length; i++) {
            result.push("Region ".concat(i + 1, ": ").concat(formatter(this.regions[i])));
        }
        return result;
    };
    return Map2D;
}());
exports.Map2D = Map2D;
var Region2D = /** @class */ (function () {
    function Region2D(pos, width, height, data) {
        this.w = 1;
        this.h = 1;
        this.position = pos;
        this.w = width;
        this.h = height;
        this.data = data;
    }
    Region2D.prototype.intersects = function (other) {
        return (this.position.x < other.position.x + other.w && this.position.x + this.w > other.position.x) &&
            (this.position.y < other.position.y + other.h && this.position.y + this.h > other.position.y);
    };
    return Region2D;
}());
exports.Region2D = Region2D;
var Vector2D = /** @class */ (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2D;
}());
exports.Vector2D = Vector2D;
//# sourceMappingURL=Map2D.js.map