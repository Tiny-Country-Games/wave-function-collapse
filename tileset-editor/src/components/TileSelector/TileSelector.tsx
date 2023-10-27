import React from "react";
import {useAppSelector} from "../../hooks/redux";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import TilePreview from "../TilePreview/TilePreview";

type TileSelectorProps = {
    onSelect?: (tile: string) => void;
    tiles?: string[];
};

const TileSelector = (props: TileSelectorProps) => {
    const {
        onSelect,
        tiles,
    } = props;

    const tileset = useAppSelector(state => state.root.tileset!);
    const selectedTile = useAppSelector(state => state.root.selectedTile);

    const tileNames = (() => {
        if (!tiles) return Object.keys(tileset.tiles);
        const availableTiles = new Set<string>([...Object.keys(tileset.tiles)]);
        return tiles.filter(tile => availableTiles.has(tile));
    })();

    return (
        <ListGroup>
            {tileNames.map((tile) => {
                return (
                    <ListGroupItem
                        key={tile}
                        onClick={() => onSelect?.(tile)}
                        active={!!onSelect && tile === selectedTile}
                        action={!!onSelect}
                    >
                        <TilePreview
                            tile={tile}
                            className={'h-100 w-auto'}
                        /> {tile}
                    </ListGroupItem>
                )
            })}
        </ListGroup>
    )
};
export default TileSelector;
