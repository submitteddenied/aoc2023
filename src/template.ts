const tfs = require('fs')
require('colors')

// Usage: node index.js inputFile
const tfile = process.argv[2]
const tinput: string = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile