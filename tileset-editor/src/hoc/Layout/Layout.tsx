import React, {useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useAppSelector} from "../../hooks/redux";
import TileSelector from "../../components/TileSelector/TileSelector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import NewTileModal from "../../containers/NewTileModal/NewTileModal";

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({children}: LayoutProps) => {
    const tileData = useAppSelector(state => state.root.tileData);
    const tileset = useAppSelector(state => state.root.tileset);

    const [showNewTileModal, setShowNewTileModal] = useState<boolean>(false);

    if (tileData === null || tileset === null) return null;

    return (
        <Row className={'mt-3'}>
            <Col xs={{span: 12, order: 2}} lg={{span: 3, order: 1}}>
                <Row className={'mb-2 align-items-center justify-content-between'}>
                    <Col xs={'auto'}>
                        <h4>Tiles</h4>
                    </Col>
                    <Col xs={'auto'}>
                        <Button
                            type={'button'}
                            title={'Add tile to tileset'}
                            className={'rounded-pill'}
                            variant={'success'}
                            onClick={() => setShowNewTileModal(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} fixedWidth/>
                        </Button>
                    </Col>
                </Row>
                <TileSelector/>
            </Col>
            <Col xs={{span: 12, order: 1}} lg={{span: 9, order: 2}} className={'mb-2 mb-lg-0'}>
                <Row>
                    {children}
                </Row>
            </Col>
            <NewTileModal
                show={showNewTileModal}
                onHide={() => setShowNewTileModal(false)}
            />
        </Row>
    );
};
export default Layout;
