import React from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import TilePreview from "../TilePreview/TilePreview";
import {rootStateActions} from "../../store/root";

const TileSelector = () => {
    const tileset = useAppSelector(state => state.root.tileset!);
    const selectedTile = useAppSelector(state => state.root.selectedTile);
    const dispatch = useAppDispatch();

    const tiles = Object.keys(tileset.tiles);

    return (
        <ListGroup>
            {tiles.map((tile) => {
                return (
                    <ListGroupItem
                        key={tile}
                        onClick={() => dispatch(rootStateActions.setSelectedTile(tile))}
                        active={tile === selectedTile}
                        action
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
