import React from "react";
import {useAppSelector} from "../../hooks/redux";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import TilePreview from "../TilePreview/TilePreview";

type TileSelectorProps = {
    onSelect?: (tile: string) => void;
};

const TileSelector = (props: TileSelectorProps) => {
    const {
        onSelect,
    } = props;

    const tileset = useAppSelector(state => state.root.tileset!);
    const selectedTile = useAppSelector(state => state.root.selectedTile);

    const tiles = Object.keys(tileset.tiles);

    return (
        <ListGroup>
            {tiles.map((tile) => {
                return (
                    <ListGroupItem
                        key={tile}
                        onClick={() => onSelect?.(tile)}
                        active={tile === selectedTile}
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
