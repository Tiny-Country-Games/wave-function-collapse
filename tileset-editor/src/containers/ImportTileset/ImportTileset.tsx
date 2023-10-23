import {Alert, Button, Col, Image, Modal, Row} from "react-bootstrap";
import ReadPlainTextFileButton from "../../components/ReadPlainTextFileButton/ReadPlainTextFileButton";
import React, {useRef, useState} from "react";
import YAML from 'yaml';
import tilesetSchema from '../../data/tileset-schema.json';
import {Draft07} from "json-schema-library";
import SpriteSheet from "../../data/SpriteSheet";
import {useAppDispatch} from "../../hooks/redux";
import {rootStateActions} from "../../store/root";
import {LinkContainer} from "react-router-bootstrap";


const ImportTileset = () => {

    const [isReading, setIsReading] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>([]);
    const [loadedTileset, setLoadedTileset] = useState<TileSet | null>(null);
    const [imageData, setImageData] = useState<string[][] | null>(null);

    const dispatch = useAppDispatch();

    const imageSelectRef = useRef<HTMLInputElement>(null);

    const onReadFile = async (fileContent: string) => {
        if (isReading) return;
        if (!imageSelectRef?.current) return;
        setIsReading(true);
        setErrorList([]);
        try {
            const parsedObject = YAML.parse(fileContent);
            const schema = new Draft07(tilesetSchema);
            const validationErrors = schema.validate(parsedObject);
            if (validationErrors.length > 0) {
                setErrorList(validationErrors.map(e => e.message));
                return;
            }
            const tileset = parsedObject as TileSet;
            const tileNames = new Set<string>([...Object.keys(tileset.tiles)]);
            const validatedTileset: TileSet = {
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
            setLoadedTileset(validatedTileset);
            imageSelectRef.current.click();
        } catch (e: any) {
            console.error(e);
            setErrorList([e.message]);
        } finally {
            setIsReading(false);
        }
    };

    const onImageFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!event.target.files || event.target.files.length <= 0) return;
        if (!loadedTileset) return;
        try {
            const file = event.target.files[0];
            const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file)
            });
            const tileData = await SpriteSheet.splitImage(data, loadedTileset.tileWidth, loadedTileset.tileHeight);
            setImageData(tileData);
            dispatch(rootStateActions.setTileData(tileData))
            dispatch(rootStateActions.setTileset(loadedTileset));
        } catch (e: any) {
            console.error(e);
            setErrorList(current => [...current, e.message])
        }
    }

    return (
        <Modal show={true}>
            <Modal.Body>
                <Row className={'justify-content-between'}>
                    <Col xs={'auto'}>
                        <Modal.Title>Import Tileset</Modal.Title>
                    </Col>
                    <Col xs={'auto'}>
                        <LinkContainer to={'/'}>
                            <Button variant={'danger'}>Back</Button>
                        </LinkContainer>
                    </Col>
                </Row>
                <input
                    type={'file'}
                    accept={'image/*'}
                    className={'d-none'}
                    onChange={onImageFileSelect}
                    ref={imageSelectRef}
                />
                <Row className={'mb-2'}>
                    <Col>
                        <ReadPlainTextFileButton
                            variant={'primary'}
                            onReadFile={onReadFile}
                            disabled={isReading || loadedTileset !== null}
                            accept={'.yaml,.yml'}
                        >
                            Read File
                        </ReadPlainTextFileButton>
                    </Col>
                </Row>
                {imageData !== null ? (
                    <Row className={'mb-2'}>
                        <Image src={imageData[12][9]}/>
                    </Row>
                ) : null}
                {errorList.map((e, index) => (
                    <Row key={index}>
                        <Col>
                            <Alert variant={'danger'}>{e}</Alert>
                        </Col>
                    </Row>
                ))}
            </Modal.Body>
        </Modal>
    )
};

export default ImportTileset;
