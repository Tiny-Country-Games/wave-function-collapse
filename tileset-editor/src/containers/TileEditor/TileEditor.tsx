import {useAppSelector} from "../../hooks/redux";
import {Card, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import React from "react";
import TilePreview from "../../components/TilePreview/TilePreview";

const TileEditor = () => {
    const tileset = useAppSelector(state => state.root.tileset!)
    const selectedTile = useAppSelector(state => state.root.selectedTile);

    if (selectedTile == null) return null;

    const selectedTileData = tileset.tiles[selectedTile];

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
                                    <ListGroup>
                                        {selectedTileData.draw.map(({r, c}, index) => (
                                            <ListGroupItem key={index}>
                                                ({c}, {r})
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
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
