import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormulaireContact from "../pages/FormulaireContact";
import LayoutsPage from "../Layouts/Layouts";
import HomePage from "../pages/Accueil";


const RouterPage =() =>{
    return(
       <BrowserRouter>

            <Routes>
                <Route element={<LayoutsPage/>}>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/Formulaire" element={<FormulaireContact/>}/>
                </Route>
            </Routes>
       
       
       
       
       </BrowserRouter>
    )
}
export default RouterPage;