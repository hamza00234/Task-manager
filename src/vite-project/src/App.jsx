import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';  
import Login from './login'; 
import Register from './register'; 
import Test from './dumy'; 
import Main from './mypage';  

// Set axios default withCredentials globally
axios.defaults.withCredentials = true;

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/api/v1/login');
  };
  const handleRegisterClick = () => {
    navigate('/api/v1/register');
  };
  const handleTestClick = () => {
    navigate('/api/v1/test');
  };

  return (
    <>
      <h1>Task Manager</h1>
      <div className="card">
        <p>Welcome to Our Task Manager</p>
      </div>
      <div>
        <button className="card" onClick={handleLoginClick}>Login</button>
      </div>
      <br />
      <div>
        <button className="card" onClick={handleRegisterClick}>Register</button>
      </div>
      <div>
        <button className="card" onClick={handleTestClick}>Test</button>
      </div>
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/api/v1/login" element={<Login />} />
      <Route path="/api/v1/register" element={<Register />} />
      <Route path="/api/v1/test" element={<Test />} />
      <Route path="/api/v1/dashboard" element={<Main />} />
    </Routes>
  );
}

export default App;
