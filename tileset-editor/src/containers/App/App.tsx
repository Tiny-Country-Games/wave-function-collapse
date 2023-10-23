import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {useAppSelector} from "../../hooks/redux";
import CreateTilesetRoutes from "../../routers/CreateTilesetRoutes/CreateTilesetRoutes";
import MainRoutes from "../../routers/MainRoutes/MainRoutes";

const App = () => {
    const tileData = useAppSelector(state => state.root.tileData);
    const tileset = useAppSelector(state => state.root.tileset);

    const router = (() => {
        if (tileData === null || tileset === null) return <CreateTilesetRoutes/>;
        return <MainRoutes/>
    })();

    return (
        <Container fluid>
            <Row>
                <Col>
                    {router}
                </Col>
            </Row>
        </Container>
    );
};

export default App;
