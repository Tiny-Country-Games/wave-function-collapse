import {Button, Modal} from "react-bootstrap";
import TileCoordsSelector from "../TileCoordsSelector/TileCoordsSelector";

type TileSelectorModalProps = Omit<TileCoordsSelector.TileCoordsSelectorProps, 'onDoubleClickTile'> & {
    show: boolean;
    onShow?: () => void;
    onHide?: () => void;
    onConfirm?: (tile: RowCol) => void;
};

const TileSelectorModal = (props: TileSelectorModalProps) => {
    const {
        show,
        onShow,
        onHide,
        onConfirm,
        value,
        ...selectorProps
    } = props;


    return (
        <Modal
            show={show}
            onShow={onShow}
            onHide={onHide}
            size={'xl'}
        >
            <Modal.Header closeButton>
                <Modal.Title>Select Tile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TileCoordsSelector
                    onDoubleClickTile={onConfirm}
                    value={value}
                    {...selectorProps}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type={'button'}
                    variant={'secondary'}
                    onClick={onHide}
                >
                    Cancel
                </Button>
                <Button
                    type={'button'}
                    variant={'primary'}
                    disabled={value == null}
                    onClick={() => onConfirm?.(value!)}
                >Confirm</Button>
            </Modal.Footer>
        </Modal>
    );

};

export default TileSelectorModal;
