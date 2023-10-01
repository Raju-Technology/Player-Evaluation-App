import './App.css';
import React from "react"
import {Routes,Route} from "react-router-dom"
import Navbar from './Components/Navbar';
import Registration from './Pages/Registration';
import Login from './Pages/Login'
import Home from "./Pages/Home"

function App() {
  return (
    <div>
       <Navbar />
       <main className='main'>
          <Routes>
              <Route exact path="" element={<Login />}/>
              <Route path="/registration" element={<Registration />}/>
              <Route path="/home" element={<Home />}/>
          </Routes>
       </main>
    </div>
  );
}

export default App;