import React from "react";
import {Col, Row} from "react-bootstrap";
import {useAppSelector} from "../../hooks/redux";
import TileSelector from "../../components/TileSelector/TileSelector";

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({children}: LayoutProps) => {
    const tileData = useAppSelector(state => state.root.tileData);
    const tileset = useAppSelector(state => state.root.tileset);

    if (tileData === null || tileset === null) return null;

    return (
        <Row className={'mt-3'}>
            <Col xs={{span: 12, order: 2}} lg={{span: 3, order: 1}}>
                <TileSelector/>
            </Col>
            <Col xs={{span: 12, order: 1}} lg={{span: 9, order: 2}}>
                <Row>
                    {children}
                </Row>
            </Col>
        </Row>
    );
};
export default Layout;
