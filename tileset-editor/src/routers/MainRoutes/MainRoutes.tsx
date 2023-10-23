import {Route, Routes} from "react-router-dom";
import Redirect from "../../components/Redirect/Redirect";
import Layout from "../../hoc/Layout/Layout";
import TileEditor from "../../containers/TileEditor/TileEditor";

const MainRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path={'import'} element={<Redirect to={'/'}/>}/>
                <Route path={''} element={<TileEditor/>}/>
            </Routes>
        </Layout>
    );
};

export default MainRoutes;
