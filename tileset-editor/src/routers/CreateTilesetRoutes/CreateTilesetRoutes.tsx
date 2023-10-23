import {Route, Routes} from "react-router-dom";
import ImportTileset from "../../containers/ImportTileset/ImportTileset";
import CreateTilesetHome from "../../containers/CreateTilesetHome/CreateTilesetHome";


const CreateTilesetRoutes = () => {
    return (
        <Routes>
            <Route path={''} element={<CreateTilesetHome/>}/>
            <Route path={'import'} element={<ImportTileset/>}/>
        </Routes>
    )
};
export default CreateTilesetRoutes;
