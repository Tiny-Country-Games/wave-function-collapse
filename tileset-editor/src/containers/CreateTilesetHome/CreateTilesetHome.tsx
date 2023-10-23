import {Button, Col, Modal, Row} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const CreateTilesetHome = () => {
    return (
        <Modal show={true}>
            <Modal.Body>
                <Modal.Title>Tileset Editor</Modal.Title>
                <Row>
                    <Col className="d-grid">
                        <LinkContainer to={'/new'}>
                            <Button>
                                New Tileset
                            </Button>
                        </LinkContainer>
                    </Col>
                    <Col className="d-grid">
                        <LinkContainer to={'/import'}>
                            <Button>
                                Import Tileset
                            </Button>
                        </LinkContainer>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
};
export default CreateTilesetHome;
