export {}
const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile

type Race = {
    time: number,
    distance: number
}

const times = input[0].split(":")[1].split(" ").filter(x => x).map(s => parseInt(s, 10))
const distances = input[1].split(":")[1].split(" ").filter(x => x).map(s => parseInt(s, 10))

const races: Race[] = []
for(let i = 0; i < times.length; i++) {
    races.push({
        time: times[i],
        distance: distances[i]
    })
}

const quadraticFormula = (raceDuration: number, minDistance: number): [number, number] => {
    // y = ax^2 + bx + c
    // 0 = -1*x^2 + (raceDuration)x - (minDistance)
    const divisor = -2 //2a
    const sqrRoot = Math.sqrt(Math.pow(raceDuration, 2) - (4 * -1 * -minDistance))
    const result = [
        (-raceDuration + sqrRoot) / divisor,
        (-raceDuration - sqrRoot) / divisor
    ].sort((a, b) => a - b)

    return [Math.min(...result), Math.max(...result)] // ts :)
}

const solveIteratively = (raceDuration: number, minDistance: number): number => {
    let solutions = 0

    for(let i = 1; i < raceDuration; i ++) {
        const distanceTravelled = i * (raceDuration - i)
        if(distanceTravelled > minDistance) {
            solutions++
        }
        if(distanceTravelled <= minDistance && solutions != 0) {
            //we ran out of time
            break
        }
    }

    return solutions
}

let result = 1
for(let i = 0; i < races.length; i++) {
    const [min, max] = quadraticFormula(races[i].time, races[i].distance + 0.1) //have to BEAT the record
    const possibleSolutions = Math.floor(max) - Math.ceil(min) + 1 //off by one sad
    console.log(`Race ${i + 1}: ${possibleSolutions} ways to win (${min} - ${max})`)
    result *= possibleSolutions
}

console.log(`Total: ${result} ways to win`)

const megaRace: Race = {
    time: parseInt(times.map(n => n.toString()).join('')),
    distance: parseInt(distances.map(n => n.toString()).join(''))
}

const startTime = new Date().getTime()
const [min, max] = quadraticFormula(megaRace.time, megaRace.distance + 0.1)
const possibleSolutions = Math.floor(max) - Math.ceil(min) + 1 //off by one sad
const midTime = new Date().getTime()
const iterativeSolve = solveIteratively(megaRace.time, megaRace.distance)
const endTime = new Date().getTime()
console.log(`Mega Race: ${possibleSolutions} ways to win (${min} - ${max}) (${midTime - startTime}ms)`)
console.log(` iterative ${iterativeSolve} ways to win (${endTime - midTime}ms)`)