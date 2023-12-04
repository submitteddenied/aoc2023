"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Map2D_1 = require("../util/Map2D");
var fs = require('fs');
require('colors');
// Usage: node index.js inputFile
var file = process.argv[2];
var input = fs.readFileSync(file, 'utf8').split('\n').filter(function (i) { return i; });
//input contains entry per line in inputFile
var isNumber = function (char) {
    return "0123456789".indexOf(char) >= 0;
};
var map = new Map2D_1.Map2D();
var numberRegions = [];
var gears = [];
for (var y = 0; y < input.length; y++) {
    var line = input[y];
    for (var x = 0; x < line.length; x++) {
        var partialNumber = '';
        if (isNumber(line[x])) {
            var startX = x;
            while (x < line.length && isNumber(line[x])) {
                //read until we get all the numbers
                partialNumber = partialNumber + line[x];
                x++;
            }
            var region_1 = new Map2D_1.Region2D(new Map2D_1.Vector2D(startX, y), partialNumber.length, 1, partialNumber);
            map.add(region_1);
            numberRegions.push(region_1);
            if (x >= line.length) {
                continue;
            }
        }
        var char = line[x];
        if (char === '.') {
            continue;
        }
        var region = new Map2D_1.Region2D(new Map2D_1.Vector2D(x, y), 1, 1, char);
        map.add(region);
        if (char === '*') {
            gears.push(region);
        }
    }
}
var regionToString = function (r) { return "(".concat(r.position.x, ", ").concat(r.position.y, ") - ").concat(r.data); };
//map.toString(regionToString).forEach(s => console.log(s))
console.log('========');
var result = 0;
numberRegions.forEach(function (r) {
    var adjacencies = map.adjacentRegions(r).filter(function (adjacent) { return !isNumber(adjacent.data); });
    if (adjacencies.length > 0) {
        //console.log(regionToString(r) + " adjacent to " + adjacencies.map(regionToString).join(', '))
        result += parseInt(r.data, 10);
    }
});
console.log("Total: ".concat(result));
console.log("P2!");
var p2Result = 0;
gears.forEach(function (g) {
    var adjacencies = map.adjacentRegions(g).filter(function (adjacent) { return isNumber(adjacent.data[0]); });
    if (adjacencies.length === 2) {
        console.log(regionToString(g) + " adjacent to " + adjacencies.map(regionToString).join(', '));
        var ratio = parseInt(adjacencies[0].data, 10) * parseInt(adjacencies[1].data, 10);
        p2Result += ratio;
    }
});
console.log("Total Ratio: ".concat(p2Result));
//# sourceMappingURL=index.js.map