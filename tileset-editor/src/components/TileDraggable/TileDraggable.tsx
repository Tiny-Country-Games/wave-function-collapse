import {Card} from "react-bootstrap";
import TilePreview from "../TilePreview/TilePreview";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

type TileDraggableProps = {
    tile: string;
};
const TileDraggable = (props: TileDraggableProps) => {
    const {
        tile,
    } = props;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useDraggable({
        id: tile,
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: 100
    };

    return (
        <Card
            className={'mb-2'}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <Card.Body className={'p-2'}>
                <TilePreview tile={tile}/> {tile}
            </Card.Body>
        </Card>
    )
};

export default TileDraggable;
