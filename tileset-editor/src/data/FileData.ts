import YAML from "yaml";
import {Draft07} from "json-schema-library";
import tilesetSchema from "./tileset-schema.json";
import {saveAs} from "file-saver";

export namespace FileData {

    export class ValidationErrorList extends Error {

        public readonly isValidationErrorList: boolean = true;


        constructor(private readonly errors: string[]) {
            super();
        }

        public get errorMessages(): string[] {
            return [...this.errors];
        }

    }

    export const parseTileset = (fileContent: string): TileSet => {
        const parsedObject = YAML.parse(fileContent);
        const schema = new Draft07(tilesetSchema);
        const validationErrors = schema.validate(parsedObject);
        if (validationErrors.length > 0) {
            throw new ValidationErrorList(validationErrors.map(e => e.message))
        }
        return FileData.cleanTileset(parsedObject);
    };

    export const saveTileset = async (tileset: TileSet) => {
        const tilesetFile = YAML.stringify(FileData.cleanTileset(tileset));
        const blob = new Blob([tilesetFile], {type: 'text/yaml;charset=utf-8'});
        saveAs(blob, 'tileset.yaml');
    }

    export const cleanTileset = (tileset: TileSet): TileSet => {
        const tileNames = new Set<string>([...Object.keys(tileset.tiles)]);
        return {
            ...tileset,
            tiles: Object.keys(tileset.tiles).reduce((tiles, tileName) => {
                const tile = tileset.tiles[tileName];
                if (!tile) return {...tiles};
                return {
                    ...tiles,
                    [tileName]: {
                        ...tile,
                        neighbors: {
                            north: tile.neighbors.north.filter(n => tileNames.has(n)),
                            south: tile.neighbors.south.filter(n => tileNames.has(n)),
                            east: tile.neighbors.east.filter(n => tileNames.has(n)),
                            west: tile.neighbors.west.filter(n => tileNames.has(n)),
                        }
                    },
                };
            }, {} as Record<string, Tile>)
        };
    }

}
