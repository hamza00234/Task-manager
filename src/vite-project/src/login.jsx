import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const navigate= useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/login',
        { email, password },
        { withCredentials: true }   // <— keeps that HTTP-only cookie
      );
      
      console.log('Login response:', res.status, res.data);
      if (res.status === 200) {
        alert('Login successful!');
        navigate('/api/v1/dashboard');     
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      const msg = err.response?.data || 'An error occurred during login';
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full p-3 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full p-3 mb-6 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
