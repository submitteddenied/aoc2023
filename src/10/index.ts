import { Map2D, Region2D, Vector2D } from "../util/Map2D"

export {}
const fs = require('fs')
import {green} from 'colors/safe'

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string[] = fs.readFileSync(file, 'utf8').split('\n').filter((i: string) => i)
//input contains entry per line in inputFile

const map = new Map2D<string>()

let start: Region2D<string> | undefined = undefined;

for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        if(input[y][x] === '.') {
            //ignore floor
            continue
        }
        const region = new Region2D(new Vector2D(x, y), 1, 1, input[y][x])
        map.add(region)
        if(region.data === 'S') {
            start = region
        }
    }
}

//compute possiblities for S
if(start === undefined) {
    throw new Error("Didn't find the start!")
}
const adjacent = map.adjacentRegions(start)
type Dir = 'up' | 'right'| 'down' | 'left'
const possibleDirections: Dir[] = []
for(let i = 0; i < adjacent.length; i++) {
    const node = adjacent[i]
    if(!(node.position.x === start.position.x || node.position.y === start.position.y)) {
        //ignore diagonals
        continue
    }
    if(node.position.x === start.position.x) {
        //node is above or below
        const nodeDir: Dir = node.position.y > start.position.y ? 'down' : 'up'
        if(node.data === '|') {
            possibleDirections.push(nodeDir)
        }
        if(nodeDir === 'down' && "JL".indexOf(node.data) !== -1) {
            possibleDirections.push(nodeDir)
        } else if(nodeDir === 'up' && "7F".indexOf(node.data) !== -1) {
            possibleDirections.push(nodeDir)
        }
    }
    if(node.position.y === start.position.y) {
        //node is left or right
        const nodeDir: Dir = node.position.x > start.position.x ? 'right' : 'left'
        if(node.data === '-') {
            possibleDirections.push(nodeDir)
        }
        if(nodeDir === 'right' && "J7".indexOf(node.data) !== -1) {
            possibleDirections.push(nodeDir)
        } else if(nodeDir === 'left' && "LF".indexOf(node.data) !== -1) {
            possibleDirections.push(nodeDir)
        }
    }
}

if(possibleDirections.length === 2) {
    const key = possibleDirections.sort().join('')
    //down left right up
    start.data = {
        'downleft': '7',
        'downright': 'F',
        'downup': '|',
        'leftright': '-',
        'leftup': 'J',
        'rightup': 'L'
    }[key]
} else {
    throw new Error("Too many possible directions from start!")
}

const oppositeDir: {[from: string]: Dir} = {
    'up': 'down',
    'down': 'up',
    'left': 'right',
    'right': 'left'
}

const fromAndTo: {[dirAndPipe: string]: [/*x*/ number, /*y*/ number]} = {
    'down7': [-1, 0],
    'left7': [0, 1],
    'upL': [1, 0],
    'rightL': [0, -1],
    'down|': [0, -1],
    'up|': [0, 1],
    'left-': [1, 0],
    'right-': [-1, 0],
    'leftJ': [0, -1],
    'upJ': [-1, 0],
    'rightF': [0, 1],
    'upF': [1, 0]
}

const nextNode = (node: Region2D<string>, comingFrom: Dir): Region2D<string> => {
    const direction = fromAndTo[comingFrom + node.data]
    const newCoord = new Vector2D(node.position.x + direction[0], node.position.y + direction[1])
    return map.nodeAtCoord(newCoord)
}

const printMap = (map: Map2D<string>, seen: Set<Region2D<string>>): void => {
    for(let y = 0; y <= map.width(); y++) {
        let line = ''
        for(let x = 0; x <= map.height(); x++) {
            const node = map.nodeAtCoord(new Vector2D(x, y))
            if(node === undefined) {
                line += ' '
            } else {
                line += seen.has(node) ? green(node.data) : node.data
            }
        }
        console.log(line)
    }
}

let node = start
let dir = possibleDirections[0]
const seen = new Set<Region2D<string>>()
printMap(map, seen)
do {
    const newDir = oppositeDir[dir]
    node = nextNode(node, newDir)
    seen.add(node)
} while(node !== start)
console.log()
printMap(map, seen)

