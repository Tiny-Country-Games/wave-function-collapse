import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {Card, Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import TilePreview from "../../components/TilePreview/TilePreview";
import TileLayers from "../../components/TileLayers/TileLayers";
import {rootStateActions} from "../../store/root";
import TileSelectorModal from "../../components/TileSelectorModal/TileSelectorModal";
import InputElement from "../../components/InputElement/InputElement";
import NeighborDroppable from "../../components/NeighborDroppable/NeighborDroppable";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import TileDraggable from "../../components/TileDraggable/TileDraggable";

const TileEditor = () => {
    const tileset = useAppSelector(state => state.root.tileset!)
    let tileImages = useAppSelector(state => state.root.tileData!);
    const selectedTile = useAppSelector(state => state.root.selectedTile);
    const dispatch = useAppDispatch();

    const [showAddLayer, setShowAddLayer] = useState<boolean>(false);
    const [selectedAddLayer, setSelectedAddLayer] = useState<RowCol | null>(null);

    const [tileWeight, setTileWeight] = useState<string>('');

    useEffect(() => {
        if (selectedTile === null) return;
        if (!tileset.tiles[selectedTile]) return;
        setTileWeight(`${tileset.tiles[selectedTile].weight}`);
    }, [selectedTile, tileset]);

    if (selectedTile === null) return null;

    const selectedTileData = tileset.tiles[selectedTile];

    if (!selectedTileData) return null;

    const allTiles = [...new Set<string>([...Object.keys(tileset.tiles)])];

    const onTileLayersChange = (layers: RowCol[]) => {
        const updatedTileset = JSON.parse(JSON.stringify(tileset));
        updatedTileset.tiles[selectedTile].draw = layers;
        dispatch(rootStateActions.setTileset(updatedTileset));
    }

    const hideAddLayerModal = () => {
        setShowAddLayer(false);
        setSelectedAddLayer(null);
    };

    const onAddLayerModalShow = () => setSelectedAddLayer(null);

    const onAddTileLayer = (tile: RowCol) => {
        const updatedTileset = JSON.parse(JSON.stringify(tileset));
        updatedTileset.tiles[selectedTile].draw.push(tile);
        dispatch(rootStateActions.setTileset(updatedTileset));
        hideAddLayerModal();
    }

    const allowTileToBeAdded = (tile: RowCol) => !selectedTileData.draw.some(t => t.r === tile.r && t.c === tile.c);

    const onWeightFieldBlur = () => {
        if (tileWeight.trim().length === 0) return;
        const weight = Number(tileWeight.trim());
        if (isNaN(weight) || weight <= 0) return;
        const updatedTileset: typeof tileset = JSON.parse(JSON.stringify(tileset));
        updatedTileset.tiles[selectedTile].weight = weight;
        dispatch(rootStateActions.setTileset(updatedTileset));
    };

    const weightField: TextInputType = {
        type: 'text',
        valid: tileWeight.trim().length > 0 && !isNaN(Number(tileWeight)) && Number(tileWeight) > 0,
        touched: true,
        label: 'Weight',
        domId: 'tile-weight',
        value: tileWeight,
        floatingLabel: true,
    };

    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (!active || !over) return;
        const draggedTileId = `${active.id}`;
        const overId: string = `${over.id}`;
        const updatedTileset: typeof tileset = JSON.parse(JSON.stringify(tileset));
        switch (overId) {
            case 'N':
                updatedTileset.tiles[selectedTile].neighbors.north = [...new Set<string>([...updatedTileset.tiles[selectedTile].neighbors.north, draggedTileId])];
                updatedTileset.tiles[draggedTileId].neighbors.south = [...new Set<string>([...updatedTileset.tiles[draggedTileId].neighbors.south, selectedTile])];
                break;
            case 'S':
                updatedTileset.tiles[selectedTile].neighbors.south = [...new Set<string>([...updatedTileset.tiles[selectedTile].neighbors.south, draggedTileId])];
                updatedTileset.tiles[draggedTileId].neighbors.north = [...new Set<string>([...updatedTileset.tiles[draggedTileId].neighbors.north, selectedTile])];
                break;
            case 'E':
                updatedTileset.tiles[selectedTile].neighbors.east = [...new Set<string>([...updatedTileset.tiles[selectedTile].neighbors.east, draggedTileId])];
                updatedTileset.tiles[draggedTileId].neighbors.west = [...new Set<string>([...updatedTileset.tiles[draggedTileId].neighbors.west, selectedTile])];
                break;
            case 'W':
                updatedTileset.tiles[selectedTile].neighbors.west = [...new Set<string>([...updatedTileset.tiles[selectedTile].neighbors.west, draggedTileId])];
                updatedTileset.tiles[draggedTileId].neighbors.east = [...new Set<string>([...updatedTileset.tiles[draggedTileId].neighbors.east, selectedTile])];
                break;
            default:
                return;
        }
        dispatch(rootStateActions.setTileset(updatedTileset));
    };

    const onNeighborRemove = (direction: 'N' | 'S' | 'E' | 'W', removedTileId: string) => {
        const updatedTileset: typeof tileset = JSON.parse(JSON.stringify(tileset));
        switch (direction) {
            case 'N':
                updatedTileset.tiles[selectedTile].neighbors.north = updatedTileset.tiles[selectedTile].neighbors.north.filter(tile => tile !== removedTileId);
                updatedTileset.tiles[removedTileId].neighbors.south = updatedTileset.tiles[removedTileId].neighbors.south.filter(tile => tile !== selectedTile);
                break;
            case 'S':
                updatedTileset.tiles[selectedTile].neighbors.south = updatedTileset.tiles[selectedTile].neighbors.south.filter(tile => tile !== removedTileId);
                updatedTileset.tiles[removedTileId].neighbors.north = updatedTileset.tiles[removedTileId].neighbors.north.filter(tile => tile !== selectedTile);
                break;
            case 'E':
                updatedTileset.tiles[selectedTile].neighbors.east = updatedTileset.tiles[selectedTile].neighbors.east.filter(tile => tile !== removedTileId);
                updatedTileset.tiles[removedTileId].neighbors.west = updatedTileset.tiles[removedTileId].neighbors.west.filter(tile => tile !== selectedTile);
                break;
            case 'W':
                updatedTileset.tiles[selectedTile].neighbors.west = updatedTileset.tiles[selectedTile].neighbors.west.filter(tile => tile !== removedTileId);
                updatedTileset.tiles[removedTileId].neighbors.east = updatedTileset.tiles[removedTileId].neighbors.east.filter(tile => tile !== selectedTile);
                break;
            default:
                return;
        }
        dispatch(rootStateActions.setTileset(updatedTileset));
    };

    return (
        <Col>
            <h1>{selectedTile}</h1>
            <Row>
                <Col xs={12} lg={6} className={'mb-4'}>
                    <Card className={'h-100'}>
                        <Card.Body>
                            <Card.Title>Meta</Card.Title>
                            <InputElement
                                element={weightField}
                                onBlur={onWeightFieldBlur}
                                onChange={value => setTileWeight(value)}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} lg={6} className={'mb-4'}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Tile Renderer</Card.Title>
                            <Row>
                                <Col xs={12} md={6} lg={4} xl={6} className={'mb-2'}>
                                    <TilePreview tile={selectedTile} className={'w-100'}/>
                                </Col>
                                <Col xs={12} md={6} lg={8} xl={6}>
                                    <TileLayers
                                        layers={selectedTileData.draw}
                                        onChange={onTileLayersChange}
                                        onAddClick={() => setShowAddLayer(true)}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Neighbors</Card.Title>
                            <DndContext onDragEnd={onDragEnd}>
                                <Row>
                                    <Col xs={3}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Tiles</Card.Title>
                                                <Row>
                                                    <Col>
                                                        {allTiles.map(tile => (
                                                            <TileDraggable
                                                                key={tile}
                                                                tile={tile}
                                                            />
                                                        ))}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs={9}>
                                        <Row>
                                            <Col xs={{span: 4, offset: 4}}>
                                                <NeighborDroppable
                                                    direction={'N'}
                                                    tileData={selectedTileData}
                                                    onTileRemove={onNeighborRemove}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={{span: 4}}>
                                                <NeighborDroppable
                                                    direction={'W'}
                                                    tileData={selectedTileData}
                                                    onTileRemove={onNeighborRemove}
                                                />
                                            </Col>
                                            <Col xs={{span: 4, offset: 4}}>
                                                <NeighborDroppable
                                                    direction={'E'}
                                                    tileData={selectedTileData}
                                                    onTileRemove={onNeighborRemove}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={{span: 4, offset: 4}}>
                                                <NeighborDroppable
                                                    direction={'S'}
                                                    tileData={selectedTileData}
                                                    onTileRemove={onNeighborRemove}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </DndContext>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <TileSelectorModal
                tiles={tileImages}
                show={showAddLayer}
                value={selectedAddLayer}
                onChange={setSelectedAddLayer}
                onHide={hideAddLayerModal}
                onShow={onAddLayerModalShow}
                onConfirm={onAddTileLayer}
                isTileAllowed={allowTileToBeAdded}
            />
        </Col>
    )

};
export default TileEditor;
