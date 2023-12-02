const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input = fs.readFileSync(file, 'utf8').split('\n').filter((i) => i)
//input contains entry per line in inputFile

let p1total = 0
let p2total = 0

const validDigits = {
    // "0": 0,
    // "1": 1,
    // "2": 2,
    // "3": 3,
    // "4": 4,
    // "5": 5,
    // "6": 6,
    // "7": 7,
    // "8": 8,
    // "9": 9,
    "one": "o1e",
    "two": "t2o",
    "three": "t3e",
    "four": "4r",
    "five": "5e",
    "six": "6",
    "seven": "7n" ,
    "eight": "e8t",
    "nine": "n9e"
}

function getFirstAndLast(arr) {
    return Number.parseInt(arr.at(0) + arr.at(-1), 10)
}

function subWordsToNumbers(line) {
    //for each key get a substr
    let remainingKeys = Object.keys(validDigits)
    let wipLine = line
    while(remainingKeys.length > 0) {
        remainingKeys = remainingKeys.filter(k => wipLine.indexOf(k) >= 0)
        remainingKeys.sort((a, b) => {
            return wipLine.indexOf(a) - wipLine.indexOf(b)
        })
        if(remainingKeys.length > 0) {
            wipLine = wipLine.replace(remainingKeys[0], validDigits[remainingKeys[0]])
        }
    }

    return wipLine
}

const firsts = new Set(Object.keys(validDigits).map(k => k[0]))

for(let i = 0; i < input.length; i++) {
    let line = input[i]
    const part1filtered = line.split("").filter(c => "0123456789".indexOf(c) >= 0)
    const subbedLine = subWordsToNumbers(line)
    const part2filtered = subbedLine.split("").filter(c => "0123456789".indexOf(c) >= 0)
    const p1 = getFirstAndLast(part1filtered)
    const p2 = getFirstAndLast(part2filtered)
    if(p1 !== p2) {
        console.log(`${i + 1}/${input.length} p1: ${p1} - p2: ${p2}    ${line} => ${subbedLine}`)
    }
    p1total += p1
    p2total += p2
}

console.log(`P1 Total: ${p1total}`)
console.log(`P2 Total: ${p2total}`)