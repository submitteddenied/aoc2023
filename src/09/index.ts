export {}
const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string[] = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile

const allZeroes = (sequence: number[]): boolean => {
    return sequence.reduce((m, n) => m && (n === 0), true)
}

const nextValue = (sequence: number[]): number => {
    if(allZeroes(sequence)) {
        return 0
    }
    //compute the diff sequence for this sequence
    const diffSequence: number[] = []
    for(let i = 1; i < sequence.length; i++) {
        //is it guaranteed that the sequence is ascending?
        diffSequence.push(sequence[i] - sequence[i-1])
    }
    //console.log(diffSequence.join(' '))
    //get the next diff
    const nextDiff = nextValue(diffSequence)
    //return last value + nextdiff
    return sequence.at(-1) + nextDiff
}

const prevValue = (sequence: number[]): number => {
    if(allZeroes(sequence)) {
        return 0
    }
    //compute the diff sequence for this sequence
    const diffSequence: number[] = []
    for(let i = 1; i < sequence.length; i++) {
        //is it guaranteed that the sequence is ascending?
        diffSequence.push(sequence[i] - sequence[i-1])
    }
    console.log(diffSequence.join(' '))
    //get the prev diff
    const prevDiff = prevValue(diffSequence)
    //return last value - prevDiff
    return sequence.at(0) - prevDiff
}

const sequences: number[][] = input.map(line => line.split(' ').map(s => parseInt(s, 10)))

let sum = sequences.reduce((m, seq) => {
    console.log(seq.join(' '))
    const val = nextValue(seq)
    console.log(`                       => ${val}`)
    return m + val
}, 0)

console.log(`Total: ${sum}`)

sum = sequences.reduce((m, seq) => {
    console.log(seq.join(' '))
    const val = prevValue(seq)
    console.log(`                       => ${val}`)
    return m + val
}, 0)

console.log(`Total: ${sum}`)

