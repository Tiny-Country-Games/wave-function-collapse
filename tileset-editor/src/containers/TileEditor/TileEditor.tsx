import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {Card, Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import TilePreview from "../../components/TilePreview/TilePreview";
import TileLayers from "../../components/TileLayers/TileLayers";
import {rootStateActions} from "../../store/root";
import TileSelectorModal from "../../components/TileSelectorModal/TileSelectorModal";
import InputElement from "../../components/InputElement/InputElement";

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

    return (
        <Col>
            <h1>{selectedTile}</h1>
            <Row>
                <Col xs={12} lg={6} className={'mb-2'}>
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
                <Col xs={12} lg={6} className={'mb-2'}>
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
