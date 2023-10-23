import {Route, Routes} from "react-router-dom";
import Redirect from "../../components/Redirect/Redirect";
import Layout from "../../hoc/Layout/Layout";

const MainRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path={'import'} element={<Redirect to={'/'}/>}/>
            </Routes>
        </Layout>
    );
};

export default MainRoutes;
