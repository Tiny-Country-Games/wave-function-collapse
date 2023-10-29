import {useAppSelector} from "../../hooks/redux";
import {FileData} from "../../data/FileData";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import IconText from "../IconText/IconText";
import {faSave} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const tileData = useAppSelector(state => state.root.tileData);
    const tileset = useAppSelector(state => state.root.tileset);

    const onSave = () => {
        if (!tileData || !tileset) return;
        FileData.saveTileset(tileset);
    };

    return (
        <header>
            <Navbar className={'bg-body-tertiary'}>
                <Container fluid>
                    <Nav>
                        <NavDropdown title={'File'} id={'nav-dropdown-file'}>
                            <NavDropdown.Item onClick={onSave}>
                                <IconText icon={faSave} fixedWidth>Save</IconText>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
