const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string[] = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile

let result = 0
let totalPower = 0
type MaxCounts = {
  [color: string]: number
}
const maxAllowed: MaxCounts = {
  red: 12,
  green: 13,
  blue: 14
}
//Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
for(let i = 0; i < input.length; i++) {
  const line = input[i].split(":")
  const gameNumber = parseInt(line[0].split(" ")[1])
  const turns = line[1].split(";")
  const maxes: MaxCounts = {}
  for(let t = 0; t < turns.length; t++) {
    const draws = turns[t].split(",").map(s => s.trim())
    for(let d = 0; d < draws.length; d++) {
      const [num, color] = draws[d].split(' ')
      if(!maxes[color]) {
        maxes[color] = 0
      }
      maxes[color] = Math.max(maxes[color], parseInt(num, 10))
    }
  }
  let possible = true
  let power = 1
  Object.keys(maxAllowed).forEach(k => {
    possible = possible && (maxAllowed[k] >= maxes[k])
    power *= maxes[k]
  })
  if(possible) {
    result += gameNumber
  }
  totalPower += power
  console.log(`Game number ${gameNumber} is${possible? '' : ' not'} possible (${JSON.stringify(maxes)}) Power: ${power}`)
}

console.log(`Sum: ${result}`)
console.log(`Total Power: ${totalPower}`)