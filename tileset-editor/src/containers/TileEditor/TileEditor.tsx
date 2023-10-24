import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {Card, Col, Row} from "react-bootstrap";
import React from "react";
import TilePreview from "../../components/TilePreview/TilePreview";
import TileLayers from "../../components/TileLayers/TileLayers";
import {rootStateActions} from "../../store/root";

const TileEditor = () => {
    const tileset = useAppSelector(state => state.root.tileset!)
    const selectedTile = useAppSelector(state => state.root.selectedTile);
    const dispatch = useAppDispatch();

    if (selectedTile == null) return null;

    const selectedTileData = tileset.tiles[selectedTile];

    const onTileLayersChange = (layers: RowCol[]) => {
        const updatedTileset = JSON.parse(JSON.stringify(tileset));
        updatedTileset.tiles[selectedTile].draw = layers;
        dispatch(rootStateActions.setTileset(updatedTileset));
    }

    return (
        <Col>
            <h1>{selectedTile}</h1>
            <Row>
                <Col xs={12} lg={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Tile Renderer</Card.Title>
                            <Row>
                                <Col xs={6}>
                                    <TilePreview tile={selectedTile} className={'w-100'}/>
                                </Col>
                                <Col xs={6}>
                                    <TileLayers
                                        layers={selectedTileData.draw}
                                        onChange={onTileLayersChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Col>
    )

};
export default TileEditor;
