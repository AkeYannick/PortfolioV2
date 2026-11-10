import Contact from '../pages/Contact'
import CompetencesParcours from '../pages/CompetencesParcours'
import Projets from '../pages/Projets'
import Services from '../pages/Services'
import Tarifs from '../pages/Tarifs'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'

const HomePage = () =>{
    return(
        <div>
            <Navbar/>
            <Hero/>
            <Projets/>
            <CompetencesParcours/>
            <Services/>
            <Tarifs/>
            <Contact/>
            <Footer/>
        </div>
    )
}
export default HomePage;