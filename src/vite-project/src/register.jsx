import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register form submitted");

    const formData = {
      name,
      password,
      email,
    };

    try {
      // Make the API call to register
      const res = await axios.post('http://localhost:5000/api/v1/register', formData, {
        withCredentials: true, // Include cookies/sessions if needed
      });

      // Log the response status and body
      console.log('Response status:', res.status);
      console.log('Response body:', res.data);

      if (res.status === 201) {
        alert('Registration successful!'); // Show success message
        navigate('/api/v1/login');
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('An error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleRegister} className="card">
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
