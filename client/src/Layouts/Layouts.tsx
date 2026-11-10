import { Outlet, useLocation } from 'react-router-dom'

const LayoutsPage = () =>{
    const location = useLocation();
    return(
        <div key={location.pathname} className="animate-fade-in">

            <Outlet/>

        </div>
    )
}
export default LayoutsPage;
