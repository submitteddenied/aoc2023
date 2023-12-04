var run = function () {
    var fs = require('fs');
    require('colors');
    // Usage: node index.js inputFile
    var file = process.argv[2];
    var input = fs.readFileSync(file, 'utf8').split('\n').filter(function (i) { return i; });
    var cards = [];
    var result = 0;
    var _loop_1 = function (i) {
        var line = input[i].split(":");
        var gameNum = parseInt(line[0].split(' ').filter(function (x) { return x; })[1].trim());
        var _a = line[1].split("|"), winningNums = _a[0], cardNums = _a[1];
        var card = {
            id: gameNum,
            src: input[i],
            winning: winningNums.split(' ').filter(function (x) { return x; }).map(function (n) { return parseInt(n.trim()); }),
            numbers: cardNums.split(' ').filter(function (x) { return x; }).map(function (n) { return parseInt(n.trim()); }),
            matches: 0,
            copies: 1
        };
        cards.push(card);
        card.matches = card.numbers.reduce(function (memo, num) {
            if (card.winning.indexOf(num) >= 0) {
                return memo + 1;
            }
            return memo;
        }, 0);
        var score = card.matches == 0 ? 0 : Math.pow(2, card.matches - 1);
        result += score;
    };
    for (var i = 0; i < input.length; i++) {
        _loop_1(i);
    }
    for (var i = 0; i < cards.length; i++) {
        console.log("Card ".concat(cards[i].id, ": ").concat(cards[i].copies, " copy"));
        for (var j = 1; j <= cards[i].matches; j++) {
            if (i + j >= cards.length) {
                console.log("Error: rolled off the end of the card table?");
                break;
            }
            console.log("  - Card ".concat(cards[i + j].id, ": +").concat(cards[i].copies));
            cards[i + j].copies += cards[i].copies;
        }
    }
    console.log("Sum score: ".concat(result));
    console.log("Total of copies: ".concat(cards.reduce(function (m, c) { return m + c.copies; }, 0)));
};
run();
//# sourceMappingURL=index.js.map