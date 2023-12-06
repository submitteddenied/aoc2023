export {}
const fs = require('fs')
require('colors')

// Usage: node index.js inputFile
const file = process.argv[2]
const input: string = fs.readFileSync(file, 'utf8').split('\n')
//input contains entry per line in inputFile

type MapRange = {
    sourceStart: number,
    destinationStart: number,
    length: number
}

type Range = {
    start: number,
    end: number
}

type FlattenedRanges = {
    min: number,
    max: number,
    ranges: MapRange[]
}

class Mapping {
    ranges: MapRange[]
    nextMapper?: Mapping

    constructor() {
        this.ranges = []
    }

    addRange(range: MapRange) {
        this.ranges.push(range)
        this.ranges.sort((a, b) => a.sourceStart - b.sourceStart)
    }

    flattenedRanges(): FlattenedRanges {
        let min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER
        for(let i = 0; i < this.ranges.length; i++) {
            if(this.ranges[i].sourceStart < min) {
                min = this.ranges[i].sourceStart
            }
            if(this.ranges[i].sourceStart + this.ranges[i].length > max) {
                max = this.ranges[i].sourceStart + this.ranges[i].length
            }
        }
        return {
            min,
            max,
            ranges: this.ranges
        }
    }

    toString(): string {
        return this.ranges.map(r => `[${r.sourceStart},${r.sourceStart + (r.length - 1)}]=>[${r.destinationStart},${r.destinationStart + (r.length - 1)}]`).join("; ")
    }

    map(num: number): number {
        //apply this Mapping
        let result = num
        for(let i = 0; i < this.ranges.length; i++) {
            if(this.ranges[i].sourceStart <= num && this.ranges[i].sourceStart + this.ranges[i].length >= num) {
                //in this range!
                const offset = num - this.ranges[i].sourceStart
                result = this.ranges[i].destinationStart + offset
            } else if (this.ranges[i].sourceStart > num) {
                //not in any range?
                break
            }
        }
        //It's possible we didn't hit any condition and are just off the end of the range list

        //If there's a next mapper, use it
        if(this.nextMapper) {
            return this.nextMapper.map(result)
        }
        //otherwise, return result
        return result
    }

    mapRange({start, end}: Range): number {
        const flattened = this.flattenedRanges()
        const resultRanges: Range[] = []
        let n = start
        if(n < flattened.min) {
            //some unmapped territory
            resultRanges.push({start: n, end: flattened.min - 1})
            n = flattened.min
        }
        //n == flattened.min
        let rangeIdx = 0
        while(n < end) {
            if(rangeIdx >= this.ranges.length) {
                //no more ranges left
                resultRanges.push({start: n, end})
                n = end
                continue
            }
            let range = this.ranges[rangeIdx]
            //catch up to the next range
            if(n < range.sourceStart) {
                resultRanges.push({start: n, end: range.sourceStart - 1})
                n = range.sourceStart
            } else if(n > range.sourceStart + range.length - 1) {
                rangeIdx++
                continue
            }

            //n >= range.sourceStart
            const lengthRemaining = end - n
            const offset = n - range.sourceStart //if n == sourceStart; offset = 0
            if(lengthRemaining > range.length - offset) {
                resultRanges.push({start: range.destinationStart + offset, end: range.destinationStart + range.length - 1})
                n = range.sourceStart + range.length
                rangeIdx++
            } else {
                resultRanges.push({start: range.destinationStart + offset, end: range.destinationStart + offset + lengthRemaining})
                n += lengthRemaining
            }
        }

        if(this.nextMapper) {
            const mappedResults = resultRanges.map(r => this.nextMapper.mapRange(r))
            return Math.min(...mappedResults)
        } else {
            return Math.min(...resultRanges.map(r => r.start))
        }
    }

    /// Combine two Mappings into a single mapping that functions as if a.nextMapper == b
    // static merge(a: Mapping, b: Mapping): Mapping {
    //     //get the flattened ranges for both
    //     const result = new Mapping()
        
    //     for(let i = 0; i < a.ranges.length; i++) {
    //         //for each range in a, map it to 0 or more ranges in b
    //         const aRange = a.ranges[i]
    //         const mapped: MapRange[] = []
    //         for(let j = 0; j < b.ranges.length; j++) {
    //             const bRange = b.ranges[j]
    //             if(aRange.destinationStart <= bRange.sourceStart && aRange.destinationStart + aRange.length >= bRange.sourceStart) {
    //                 //some kind of overlap!
    //                 const offset = bRange.sourceStart - aRange.destinationStart
    //                 const endInputNum = Math.min(aRange.sourceStart + aRange.length - 1, bRange.sourceStart + bRange.length - 1 + offset)
    //                 const newRange: MapRange = {
    //                     sourceStart: aRange.sourceStart + offset,
    //                     destinationStart: bRange.destinationStart,
    //                     length: endInputNum - (aRange.sourceStart + offset)
    //                 }
    //                 mapped.push(newRange)
    //             }
    //         }
    //         //if there are no mapped ranges, just add the source
    //         if(mapped.length === 0) {
    //             result.addRange(aRange)
    //         } else {
    //             //otherwise add all mapped ranges
    //             mapped.forEach(m => result.addRange(m))
    //         }
    //     }

    //     //handle edge cases (a.min < b.min and max)

    //     return result
    // }
}

const mappers: {[name: string]: Mapping} = {}
const seeds: number[] = []
const mapperStructure: {[from: string]: string} = {}

for(let i = 0; i < input.length; i++) {
    if(input[i].startsWith("seeds:")) {
        input[i].split(":")[1].trim().split(" ").filter(n => n).map(n => parseInt(n, 10)).forEach(n => seeds.push(n))
        continue
    }
    if(input[i].endsWith("map:")) {
        const [from, to] = input[i].split(" ")[0].split("-to-")
        const mapper = new Mapping()
        mappers[from] = mapper
        mapperStructure[from] = to
        while(i < input.length - 1 && input[++i].trim() !== '') {
            const [destinationStart, sourceStart, length] = input[i].split(" ").map(n => parseInt(n, 10))
            mapper.addRange({destinationStart, sourceStart, length})
        }
    }
}

Object.keys(mapperStructure).forEach(source => {
    const dest = mapperStructure[source]
    mappers[source].nextMapper = mappers[dest]
})

seeds.forEach(s => {
    const loc = mappers["seed"].map(s)
    console.log(`Seed ${s}: Location ${loc}`)
})

console.log("Lowest location: " + seeds.map((s) => mappers["seed"].map(s)).sort((a, b) => a - b)[0])
console.log("")
console.log("Part 2!")

let min = Number.MAX_SAFE_INTEGER
const startTime = (new Date().getTime())
for(let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i]
    const length = seeds[i+1]
    const r: Range = {start, end: start + length - 1}
    const thisMinLoc = mappers["seed"].mapRange(r)
    console.log(`Seed range [${r.start}, ${r.end}] best location: ${thisMinLoc}`)
    if(thisMinLoc < min) {
        min = thisMinLoc
    }
}

console.log(`Min Location for ranges: ${min}`)
console.log(`Took ${(new Date().getTime()) - startTime}ms`)