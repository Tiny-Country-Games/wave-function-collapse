import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {FileData} from "../../data/FileData";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import IconText from "../IconText/IconText";
import {faFolderOpen, faSave} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";
import {rootStateActions} from "../../store/root";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const tileData = useAppSelector(state => state.root.tileData);
    const tileset = useAppSelector(state => state.root.tileset);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const {code, metaKey, ctrlKey} = event;
            if (!metaKey && !ctrlKey) return;
            switch (code) {
                case 'KeyS':
                    event.preventDefault();
                    onSave();
                    break;
                case 'KeyO':
                    event.preventDefault();
                    onOpen();
                    break;
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const onSave = () => {
        if (!tileData || !tileset) return;
        FileData.saveTileset(tileset);
    };

    const onOpen = () => {
        if (!tileData || !tileset) return;
        dispatch(rootStateActions.clearAllData());
        navigate('/import');
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
                            <NavDropdown.Item onClick={onOpen}>
                                <IconText icon={faFolderOpen} fixedWidth>Open</IconText>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
