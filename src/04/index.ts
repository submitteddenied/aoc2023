const run = () => {
    const fs = require('fs')
    require('colors')

    // Usage: node index.js inputFile
    const file = process.argv[2]
    const input: string = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
    //input contains entry per line in inputFile

    type Card = {
        id: number,
        winning: number[]
        numbers: number[],
        matches: number
        copies: number,
        src: string
    }

    const cards: Card[] = []
    let result = 0
    for(let i = 0; i < input.length; i++) {
        const line = input[i].split(":")
        const gameNum = parseInt(line[0].split(' ').filter(x => x)[1].trim())
        const [winningNums, cardNums] = line[1].split("|")
        const card: Card = {
            id: gameNum,
            src: input[i],
            winning: winningNums.split(' ').filter(x => x).map(n => parseInt(n.trim())),
            numbers: cardNums.split(' ').filter(x => x).map(n => parseInt(n.trim())),
            matches: 0,
            copies: 1
        }
        cards.push(card)
        card.matches = card.numbers.reduce((memo, num) => {
            if(card.winning.indexOf(num) >= 0) {
                return memo + 1
            }
            return memo
        }, 0)
        
        const score = card.matches == 0 ? 0 : Math.pow(2, card.matches - 1)
        result += score
    }

    for(let i = 0; i < cards.length; i++) {
        console.log(`Card ${cards[i].id}: ${cards[i].copies} copy`)
        for(let j = 1; j <= cards[i].matches; j++) {
            if(i + j >= cards.length) {
                console.log(`Error: rolled off the end of the card table?`)
                break
            }
            console.log(`  - Card ${cards[i + j].id}: +${cards[i].copies}`)
            cards[i + j].copies += cards[i].copies
        }
    }

    console.log(`Sum score: ${result}`)
    console.log(`Total of copies: ${cards.reduce((m, c) => m + c.copies, 0)}`)
}

run()