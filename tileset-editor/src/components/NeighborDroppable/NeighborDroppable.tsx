import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {useDroppable} from "@dnd-kit/core";
import TilePreview from "../TilePreview/TilePreview";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";

type DirectionId = 'N' | 'S' | 'E' | 'W';

type NeighborDroppableProps = {
    direction: DirectionId;
    tileData: Tile;
    onTileRemove: (direction: DirectionId, tileToRemove: string) => void;
};

const NeighborDroppable = (props: NeighborDroppableProps) => {

    const {
        direction,
        tileData,
        onTileRemove,
    } = props;

    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: direction,
    })

    const tileNames = (() => {
        switch (direction) {
            case "N":
                return [...new Set<string>([...tileData.neighbors.north])];
            case "S":
                return [...new Set<string>([...tileData.neighbors.south])];
            case "E":
                return [...new Set<string>([...tileData.neighbors.east])];
            case "W":
                return [...new Set<string>([...tileData.neighbors.west])];
        }
    })();

    const title = (() => {
        switch (direction) {
            case "N":
                return "North";
            case "S":
                return "South";
            case "E":
                return "East";
            case "W":
                return "West";
        }
    })();

    return (
        <Card className={'h-100'} border={isOver ? 'success' : undefined}>
            <Card.Body ref={setNodeRef}>
                <Card.Title>{title}</Card.Title>
                {tileNames.map(tileName => (
                    <Card className={'mb-2'}>
                        <Card.Body
                            className={'p-2'}
                        >
                            <Row className={'justify-content-between align-items-center'}>
                                <Col xs={'auto'}>
                                    <TilePreview tile={tileName}/> {tileName}
                                </Col>
                                <Col xs={'auto'}>
                                    <Button
                                        type={'button'}
                                        variant={'danger'}
                                        className={'px-1 py-0 rounded-pill'}
                                        onClick={() => onTileRemove(direction, tileName)}
                                    >
                                        <FontAwesomeIcon icon={faMinus} width={'0.75rem'}/>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </Card.Body>
        </Card>
    )
};
export default NeighborDroppable;
