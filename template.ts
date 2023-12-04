const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile