var fs = require('fs');
require('colors');
// Usage: node index.js inputFile
var file = process.argv[2];
var input = fs.readFileSync(file, 'utf8').split('\n').filter(function (i) { return i; });
//input contains entry per line in inputFile
var result = 0;
var totalPower = 0;
var maxAllowed = {
    red: 12,
    green: 13,
    blue: 14
};
var _loop_1 = function (i) {
    var line = input[i].split(":");
    var gameNumber = parseInt(line[0].split(" ")[1]);
    var turns = line[1].split(";");
    var maxes = {};
    for (var t = 0; t < turns.length; t++) {
        var draws = turns[t].split(",").map(function (s) { return s.trim(); });
        for (var d = 0; d < draws.length; d++) {
            var _a = draws[d].split(' '), num = _a[0], color = _a[1];
            if (!maxes[color]) {
                maxes[color] = 0;
            }
            maxes[color] = Math.max(maxes[color], parseInt(num, 10));
        }
    }
    var possible = true;
    var power = 1;
    Object.keys(maxAllowed).forEach(function (k) {
        possible = possible && (maxAllowed[k] >= maxes[k]);
        power *= maxes[k];
    });
    if (possible) {
        result += gameNumber;
    }
    totalPower += power;
    console.log("Game number ".concat(gameNumber, " is").concat(possible ? '' : ' not', " possible (").concat(JSON.stringify(maxes), ") Power: ").concat(power));
};
//Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
for (var i = 0; i < input.length; i++) {
    _loop_1(i);
}
console.log("Sum: ".concat(result));
console.log("Total Power: ".concat(totalPower));
//# sourceMappingURL=index.js.map