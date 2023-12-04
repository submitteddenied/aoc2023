import { Map2D, Region2D, Vector2D } from "../util/Map2D"

const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile
const isNumber = (char: string): boolean => {
    return "0123456789".indexOf(char) >= 0
}

const map = new Map2D<string>()
const numberRegions: Region2D<string>[] = []
const gears: Region2D<string>[] = []

for(let y = 0; y < input.length; y++) {
    const line = input[y]
    for(let x = 0; x < line.length; x++) {
        let partialNumber = ''
        if(isNumber(line[x])) {
            const startX = x
            while(x < line.length && isNumber(line[x])) {
                //read until we get all the numbers
                partialNumber = partialNumber + line[x]
                x++
            }
            const region = new Region2D(new Vector2D(startX, y), partialNumber.length, 1, partialNumber)
            map.add(region)
            numberRegions.push(region)
            if(x >= line.length) {
                continue
            }
        }
        const char = line[x]
        if(char === '.') {
            continue
        }
        const region = new Region2D(new Vector2D(x, y), 1, 1, char)
        map.add(region)
        if(char === '*') {
            gears.push(region)
        }
    }
}
const regionToString = (r: Region2D<string>) => `(${r.position.x}, ${r.position.y}) - ${r.data}`
//map.toString(regionToString).forEach(s => console.log(s))
console.log('========')
let result = 0
numberRegions.forEach(r => {
    const adjacencies: Region2D<string>[] = map.adjacentRegions(r).filter((adjacent) => !isNumber(adjacent.data))
    if(adjacencies.length > 0) {
        //console.log(regionToString(r) + " adjacent to " + adjacencies.map(regionToString).join(', '))
        result += parseInt(r.data, 10)
    }
})

console.log(`Total: ${result}`)

console.log(`P2!`)
let p2Result = 0
gears.forEach(g => {
    const adjacencies: Region2D<string>[] = map.adjacentRegions(g).filter((adjacent) => isNumber(adjacent.data[0]))
    if(adjacencies.length === 2) {
        console.log(regionToString(g) + " adjacent to " + adjacencies.map(regionToString).join(', '))
        const ratio = parseInt(adjacencies[0].data, 10) * parseInt(adjacencies[1].data, 10)
        p2Result += ratio
    }
})

console.log(`Total Ratio: ${p2Result}`)