export class Map2D<T> {
    constructor() {
        this.regions = []
    }

    regions: Region2D<T>[]

    width(zeroBasis: boolean = false): number {
        return this.widthOrHeight(zeroBasis, 'x')
    }

    height(zeroBasis: boolean = false): number {
        return this.widthOrHeight(zeroBasis, 'y')
    }

    add(region: Region2D<T>) {
        this.regions.push(region)
    }

    private widthOrHeight(zeroBasis: boolean, xOrY: 'x' | 'y'): number {
        let min = Number.MAX_SAFE_INTEGER
        let max = Number.MIN_SAFE_INTEGER
        this.regions.forEach(r => {
            min = Math.min(min, r.position[xOrY])
            max = Math.max(max, r.position[xOrY])
        })
        if(zeroBasis) {
            return max
        }
        return max - min
    }

    adjacentRegions(region: Region2D<T>): Region2D<T>[] {
        //make a new pseudo region which is +1 in all directions
        const hitbox: Region2D<void> = new Region2D<void>(new Vector2D(region.position.x-1, region.position.y-1), region.w + 2, region.h + 2, undefined)

        let result: Region2D<T>[] = []
        for(let i = 0; i < this.regions.length; i++) {
            if(this.regions[i] === region) {
                continue
            }
            if(this.regions[i].intersects(hitbox)) {
                result.push(this.regions[i])
            }
        }

        return result
    }

    toString(formatter: (region: Region2D<T>) => string): string[] {
        const result: string[] = []
        for(let i = 0; i < this.regions.length; i++) {
            result.push(`Region ${i + 1}: ${formatter(this.regions[i])}`)
        }

        return result
    }
}

export class Region2D<T> {
    constructor(pos: Vector2D, width: number, height: number, data: T) {
        this.position = pos
        this.w = width
        this.h = height
        this.data = data
    }

    position: Vector2D
    w: number = 1
    h: number = 1
    data: T

    intersects(other: Region2D<any>): boolean {
        return (this.position.x < other.position.x + other.w && this.position.x + this.w > other.position.x) &&
               (this.position.y < other.position.y + other.h && this.position.y + this.h > other.position.y)
    }
}

export class Vector2D {
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    x: number
    y: number
}