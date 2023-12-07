export {}
const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string[] = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile

const CARDS = "AKQJT98765432".split("")
const JOKER_CARDS = "AKQT98765432J".split("")
enum HandType {
    FiveOfAKind,
    FourOfAKind,
    FullHouse,
    ThreeOfAKind,
    TwoPair,
    Pair,
    HighCard
}

class Hand {
    cards: string[]
    bid: number
    constructor(line: string) {
        this.cards = line.split(" ")[0].split("")
        this.bid = parseInt(line.split(" ")[1])
    }

    handType(jokers: boolean = false): HandType {
        const faceToCount = this.cards.reduce<{[card: string]: number}>((memo, c) => {
            if(!memo[c]) {
                memo[c] = 0
            }
            memo[c]++
            return memo
        }, {})
        let jokerCount = 0
        if(jokers && faceToCount['J']) {
            jokerCount = faceToCount['J']
        }
        let uniqueCards = Object.keys(faceToCount)
        if(uniqueCards.length === 1) { //No jokers or all jokers
            return HandType.FiveOfAKind
        }
        let values = Object.values(faceToCount)
        if(jokerCount > 0) {
            //add jokers to the card with the highest count
            //filter the joker's value out of the list
            values = values.filter((n, i) => i !== values.indexOf(jokerCount))
            const highestCountCard = uniqueCards.find(c => faceToCount[c] === Math.max(...values))
            faceToCount['J'] = 0
            faceToCount[highestCountCard] += jokerCount
            delete faceToCount['J']
            uniqueCards = uniqueCards.filter(c => c !== 'J')
            values = Object.values(faceToCount).filter(x => x) //sometimes `delete` puts a {undefined: NaN} in the object
        }
        if(uniqueCards.length === 1) {
            return HandType.FiveOfAKind
        }
        if(uniqueCards.length === 2) {
            if(Math.max(...values) === 4) {
                return HandType.FourOfAKind //4 and 1
            } else {
                return HandType.FullHouse //3 and 2
            }
        }
        if(uniqueCards.length === 3) {
            //three of a kind or two pair
            if(Math.max(...values) === 3) {
                return HandType.ThreeOfAKind //3, 1, 1
            } else {
                return HandType.TwoPair //2, 2, 1
            }
        }
        if(uniqueCards.length === 4) {
            return HandType.Pair
        }

        if(uniqueCards.length === 5) {
            return HandType.HighCard //all unique
        }
    }

    static compare(jokers: boolean): (a: Hand, b: Hand) => number {
        return (a: Hand, b: Hand) => {
            const aType = a.handType(jokers)
            const bType = b.handType(jokers)
            if(aType !== bType) {
                return aType - bType
            }
            const cardList = jokers ? JOKER_CARDS : CARDS
            for(let i = 0; i < 5; i++) {
                if(a.cards[i] !== b.cards[i]) {
                    return cardList.indexOf(a.cards[i]) - cardList.indexOf(b.cards[i])
                }
            }
            return 0
        }
    }
}

const shuffle = <T>(arr: T[]): T[] => {
    const result: T[] = new Array(...arr)
    for(let i = 0; i < result.length; i++) {
        const rand = Math.floor(Math.random() * result.length)
        const temp = result[rand]
        result[rand] = result[i]
        result[i] = temp
    }

    return result
}

const hands: Hand[] = input.map(line => new Hand(line))
for(let i = 0; i < 2; i++) {
    const jokers = i !== 0
    const sorted = hands.sort(Hand.compare(jokers)).reverse()
    let result = 0
    sorted.forEach((h, i) => {
        const winnings = h.bid * (i+1)
        //console.log(`Rank ${i+1}: ${h.cards.join("")} - ${HandType[h.handType(jokers)]} (${h.bid} = ${winnings})`)
        result += winnings
    })
    
    console.log(`Total: ${result}`)    
}
// 251444803 wrong

// for(let i = 0; i < 50; i++) {
//     const sorted = shuffle(hands).sort(Hand.compare(true)).reverse()
//     let result = 0
//     sorted.forEach((h, i) => {
//         const winnings = h.bid * (i+1)
//         console.log(`Rank ${i+1}: ${h.cards.join("")} - ${HandType[h.handType(true)]} (${h.bid} = ${winnings})`)
//         result += winnings
//     })
    
//     console.log(`Total: ${result}`)
// }