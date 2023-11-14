import './App.css';
import React from "react"
import {Routes,Route} from "react-router-dom"
import Navbar from './Components/Navbar';
// import Registration from './Pages/Registration';
// import Login from './Pages/Login'
import Home from "./Pages/Home"
import LearningPathway from './Pages/LearningPathway';
import Studio from './Pages/Studio';
import Level2 from './Pages/Level2';

function App() {
  return (
    <div style={{ overflowX: 'hidden' }}>
       <Navbar />
       <main className='main'>
          <Routes>
              {/* <Route exact path="" element={<Login />}/>
              <Route path="/registration" element={<Registration />}/> */}
              <Route exact path="" element={<Home />}/>
              <Route path="/learningpathway" element={<LearningPathway/>}/>
              <Route path="/studio" element={<Studio/>}/>
              <Route path="/level2" element={<Level2/>} />
          </Routes>
       </main>
    </div>
  );
}

export default App;