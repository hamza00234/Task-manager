import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './login'; // make sure this path is correct
import Register from './register'; // make sure this path is correct

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClicklogin = () => {
    navigate('/users/login');
  };
  const handleLoginClickregister = () => {
    navigate('/api/v1/register');
  };

  return (
    <>
      <h1>Task Manager</h1>
      <div className="card">
        <p>Welcome to Our Task Manager</p>
      </div>
      <div>
        <button className="card" onClick={handleLoginClicklogin}>Login</button>
      </div>
      <br />
      <div>
        <button className="card" onClick={handleLoginClickregister}>Register</button>
      </div>
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/login" element={<Login />} />
      <Route path="/api/v1/register" element={<Register />} />
    </Routes>
  );
}

export default App;
