import {Button, Card, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGripVertical, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";

type TileLayersProps = {
    layers: RowCol[];
    onChange: (layers: RowCol[]) => void;
    onAddClick: () => void;
};

const rowColId = ({c, r}: RowCol) => `${r}-${c}`;

type LayerItemProps = {
    layer: RowCol;
    disableDelete: boolean;
    onDelete: (layer: RowCol) => void;
};

const LayerItem = (props: LayerItemProps) => {
    const {
        layer,
        disableDelete,
        onDelete,
    } = props;
    const id = rowColId(layer);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <Row ref={setNodeRef} style={style} className={'mb-2'}>
            <Col>
                <Card>
                    <Card.Body className={'p-2'}>
                        <Row className={'align-items-center justify-content-between'}>
                            <Col xs={'auto'}>
                                <Row className={'align-items-center'}>
                                    <Col xs={'auto'}>
                                        <Button
                                            type={'button'}
                                            variant={'danger'}
                                            disabled={disableDelete}
                                            onClick={() => onDelete(layer)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} fixedWidth/>
                                        </Button>
                                    </Col>
                                    <Col xs={'auto'}>
                                        ({layer.c}, {layer.r})
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={'auto'}>
                                <Button
                                    type={'button'}
                                    variant={'outline-secondary'}
                                    className={'p-1'}
                                    {...listeners}
                                    {...attributes}
                                >
                                    <FontAwesomeIcon icon={faGripVertical} fixedWidth/>
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

const TileLayers = (props: TileLayersProps) => {
    const {
        layers,
        onChange,
        onAddClick,
    } = props;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const onDragEnd = ({active, over}: DragEndEvent) => {
        if (!active || !over) return;
        if (active.id === over.id) return;
        const oldIndex = layers.findIndex((layer) => rowColId(layer) === active.id);
        const newIndex = layers.findIndex((layer) => rowColId(layer) === over.id);
        onChange(arrayMove([...layers], oldIndex, newIndex));
    };

    const onLayerDelete = (layer: RowCol) => {
        if (layers.length === 1) return;
        onChange(layers.filter((l) => rowColId(l) !== rowColId(layer)));
    }

    return (
        <>
            <Row className={'align-items-center justify-content-between mb-3'}>
                <Col xs={'auto'}>
                    <h5>Layers</h5>
                </Col>
                <Col xs={'auto'}>
                    <Button
                        variant={'success'}
                        type={'button'}
                        className={'rounded-pill'}
                        onClick={onAddClick}
                    >
                        <FontAwesomeIcon icon={faPlus} fixedWidth/>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={layers.map(rowColId)}
                            strategy={verticalListSortingStrategy}

                        >
                            {layers.map((layer) => (
                                <LayerItem
                                    key={rowColId(layer)}
                                    layer={layer}
                                    disableDelete={layers.length === 1}
                                    onDelete={onLayerDelete}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </Col>
            </Row>
        </>
    )
};

export default TileLayers;
