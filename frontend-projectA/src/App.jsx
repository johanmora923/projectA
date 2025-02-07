import {  Route,  Routes,useLocation } from 'react-router-dom'
import { Login }  from './components/login.jsx'
import { Register } from './components/register.jsx'
import { Navbar } from './components/navbar.jsx'
import './App.css'
import { Button } from './components/buttons.jsx'
import { Inicio } from './components/inicio.jsx'


function App() {
  const location = useLocation()

  const toHome = () => {
    console.log('Home')
  }

  return (
    <div>
        {location.pathname !== '/inicio' && (
        <Navbar>
          <Button 
            key={"home-button"}
            textButton="home >"
            funtionButton={toHome}
            className={"bg-[#fdfdfd] text-center text-[#110f0f] p-1 rounded-[50px] w-25 h-8 mr-4" }
          />
        </Navbar>
      )} 
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/register" element={<Register />}/>
          <Route exact path="/inicio"  element={<Inicio/>}/>
        </Routes>
    </div>
  )
}

export default App
