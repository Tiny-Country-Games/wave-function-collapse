import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {FormEvent, useEffect, useState} from "react";
import {Filters, Forms, Validators} from "../../data/Forms";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import VerticalInputElementForm
    from "../../components/InputElementForm/VerticalInputElementForm/VerticalInputElementForm";
import {rootSlice} from "../../store/root";

type NewTileModalProps = {
    show: boolean;
    onHide: () => void;
};

type NewTileForm = {
    tileWeight: TextInputType;
    tileName: TextInputType;
};

const NewTileModal = (props: NewTileModalProps) => {
    const {
        show,
        onHide,
    } = props;

    const tileset = useAppSelector(state => state.root.tileset!);
    const dispatch = useAppDispatch();

    const [newTileForm, setNewTileForm] = useState<NewTileForm>({
        tileWeight: {
            type: 'text',
            domId: 'new-tile-weight',
            label: 'Weight',
            touched: true,
            valid: true,
            value: '1',
            validator: Validators.combineValidators(Validators.requiredNumber, Validators.minNumberValue(0, false)),
            floatingLabel: true,
        },
        tileName: {
            type: 'text',
            domId: 'new-tile-name',
            label: 'Tile Id',
            touched: false,
            valid: false,
            value: '',
            validator: Validators.requiredText,
            filter: Filters.lowerCaseNoSpace,
            floatingLabel: true,
        },
    });
    const [newTileFormValid, setNewTileFormValid] = useState<boolean>(false);

    useEffect(() => {
        if (!show) return;
        setNewTileFormValid(false);
        setNewTileForm(current => ({
            ...current,
            tileWeight: {
                ...current.tileWeight,
                touched: true,
                valid: true,
                value: '1',
            },
            tileName: {
                ...current.tileName,
                touched: false,
                valid: false,
                value: '',
            }
        }));
    }, [show]);

    const onFormChange = (key: string, value: any) => {
        const {form, formValid} = Forms.updateForm({key, value, form: newTileForm});
        if (!formValid) {
            setNewTileForm(form);
            setNewTileFormValid(false);
            return;
        }
        let validTileName = true;
        if (key === 'tileName') {
            const tiles = new Set<string>([...Object.keys(tileset.tiles)]);
            if (tiles.has(form.tileName.value)) {
                form.tileName = {
                    ...form.tileName,
                    valid: false,
                };
                validTileName = false;
            }
        }
        setNewTileForm(form);
        setNewTileFormValid(validTileName);
    };

    const onFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        const {form, formValid} = Forms.filterAndValidateForm(newTileForm);
        if (!formValid) {
            setNewTileForm(form);
            setNewTileFormValid(false);
            return;
        }
        const updatedTileset: typeof tileset = JSON.parse(JSON.stringify(tileset));
        const existingTiles = new Set<string>([...Object.keys(updatedTileset.tiles)])
        if (existingTiles.has(form.tileName.value)) {
            setNewTileForm({
                ...form,
                tileName: {
                    ...form.tileName,
                    valid: false,
                },
            });
            setNewTileFormValid(false);
            return;
        }
        updatedTileset.tiles[form.tileName.value] = {
            weight: Number(form.tileWeight.value),
            draw: [
                {r: 0, c: 0},
            ],
            neighbors: {
                north: [],
                south: [],
                east: [],
                west: [],
            },
        };
        dispatch(rootSlice.actions.setTileset(updatedTileset));
        dispatch(rootSlice.actions.setSelectedTile(form.tileName.value));
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>New Tile</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onFormSubmit}>
                <Modal.Body>
                    <VerticalInputElementForm
                        form={newTileForm}
                        onChange={onFormChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col>
                            <Button
                                type={'button'}
                                onClick={onHide}
                                variant={'secondary'}
                            >
                                Cancel
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type={'submit'}
                                variant={'success'}
                                disabled={!newTileFormValid}
                            >
                                Add
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Form>
        </Modal>
    )
};
export default NewTileModal;
