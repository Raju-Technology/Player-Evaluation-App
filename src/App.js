import './App.css';
import React, {useState} from "react"
import {Routes,Route} from "react-router-dom"
import Navbar from './Components/Navbar';
import Registration from './Pages/Registration';
import Login from './Pages/Login'
import Home from "./Pages/Home"
import LearningPathway from './Pages/LearningPathway';
import Studio from './Pages/Studio';
import Level2 from './Pages/Level2';
import Form from "./Pages/Form"
import Dashboard from './Pages/Dashboard';
import Error from './Pages/Error';

function App() {
  const [login, setLogin] = useState(false)
  const [tgAiName, setTgAiName] = useState('')
  const [access, setAccess] = useState("false")
  console.log(access)
  return (
    <div style={{ overflowX: 'hidden' }}>
       <Navbar />
       <main className='main'>
          <Routes>
              <Route path="/login" element={<Login setLogin={setLogin}  setTgAiName={setTgAiName} setAccess={setAccess} />}/>
              <Route path="/registration" element={<Registration />}/>
              <Route exact path="" element={<Home />}/>
              <Route path="/learningpathway" element={<LearningPathway/>}/>
              <Route path="/studio" element={<Studio/>}/>
              <Route
                path="/form"
                element={
                  login ? (
                    <React.Fragment>
                      <Form tgAiName={tgAiName} />
                    </React.Fragment>
                  ) : (
                    <Error />
                  )
                }
              />
              <Route path="/level2" element={<Level2/>} />
              <Route
                path="/dashboard"
                element={
                  login ? (
                    <React.Fragment>
                      <Dashboard tgAiName={tgAiName} access={access} setTgAiName={setTgAiName} setLogin={setLogin}/>
                    </React.Fragment>
                  ) : (
                    <Error />
                  )
                }
              />
          </Routes>
       </main>
    </div>
  );
}

export default App;