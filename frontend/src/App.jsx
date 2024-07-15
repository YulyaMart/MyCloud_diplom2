import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Registration from './components/Registration/Registration';
import Login from './components/Login/Login';
import Files from './components/Files/Files';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route exact path='/files' element={<PrivateRoute/>}>
            <Route exact path='/files' element={<Files/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}


export default App;
