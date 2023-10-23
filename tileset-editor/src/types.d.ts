type Tile = {
    weight: number;
    draw: {
        c: number;
        r: number;
    }[];
    neighbors: {
        north: string[];
        south: string[];
        east: string[];
        west: string[];
    };
};
type TileSet = {
    source: string;
    tileWidth: number;
    tileHeight: number;
    tiles: {
        [key: string]: Tile
    };
}



