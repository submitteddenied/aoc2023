export {}
const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string[] = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile

const nodes: {[from: string]: [string, string]} = {}

const instructions = input[0]
for(let i = 1; i < input.length; i++) {
    const [from, to] = input[i].split(" = ")
    const [left, right] = to.split(", ")
    nodes[from] = [
        left.slice(1), //trim '(' from start
        right.slice(0, 3) //trim ')' from end
    ]
}

let steps = 0
//let curr = 'AAA'
// while(curr !== 'ZZZ') {
//     const instIndex = steps % instructions.length
//     curr = nodes[curr][instructions[instIndex] === 'L' ? 0 : 1]
//     steps++
// }

console.log(`P1: Found in ${steps} steps`)

let currSet: string[] = Object.keys(nodes).filter(n => n.endsWith("A"))

const loopLength = (startPos: string): [number, number, number[]] => {
    const seen: {[node: string]: number} = {}
    let curr = startPos
    let step = 0
    let stepKey = ''
    const possibleEnds: number[] = []
    do {
        if(curr.endsWith("Z")) {
            possibleEnds.push(step)
        }
        const instruction = instructions[step % instructions.length]
        stepKey = `${curr}:${instruction}`
        if(seen[stepKey] !== undefined) {
            break
        }
        seen[`${curr}:${instruction}`] = step
        curr = nodes[curr][instruction === "L" ? 0 : 1]
        step++
    } while(true)
    const loopStart = seen[stepKey]
    const loopLength = step - loopStart
    return [loopStart, loopLength, possibleEnds]
}

const loops = currSet.map(loopLength)
let stepLengths = loops.map(l => BigInt(l[0]))
const allEqual = (arr: BigInt[]): boolean => {
    for(let i = 1; i < arr.length; i++) {
        if(arr[i] !== arr[0]) {
            return false
        }
    }
    return true
}

const lcd = loops.reduce((memo, loop) => memo * BigInt(loop[1]), BigInt(1))
do {
    stepLengths = stepLengths.map(s => s + lcd)
} while(!allEqual(stepLengths))

console.log(`P2: Found in ${stepLengths[0]} steps`)

//60,177,485,833 wrong
//51,381,180,672 wrong
//31,947,584,441 wrong
//144,115,209,469,692,580 wrong
//
// 3, 59
// 2, 73
// 8, 47
// 5, 53
// 4, 79
// 3, 71