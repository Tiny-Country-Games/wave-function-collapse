type Tile = {
    weight: number;
    draw: RowCol[];
    neighbors: {
        north: string[];
        south: string[];
        east: string[];
        west: string[];
    };
};

type RowCol = {
    c: number;
    r: number;
};

type TileSet = {
    source: string;
    tileWidth: number;
    tileHeight: number;
    tiles: {
        [key: string]: Tile
    };
}



