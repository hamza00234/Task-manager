import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register form submitted");

    const formData = {
      username,
      password,
      email,
    };

    try {
        const res = await axios.post('http://localhost:3001/api/v1/register', formData);
        console.log('Response status:', res.status); // Log the status code
      console.log('Response body:', res.data); // Log the response body

      if (res.status === 200) {
        alert(res.data.message); // Optional: show success message
        navigate('/users/login'); // Redirect to login page on success
      } else {
        alert('Registration failedd');
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister} className="card">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;