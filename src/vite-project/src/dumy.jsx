import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Make a GET request to the test route
    axios.get('http://localhost:5000/api/v1/test')
      .then((res) => {
        setResponse(res.data); // Set the response from the server
      })
      .catch((err) => {
        console.error('Error fetching test route:', err);
        setResponse('Error fetching test route');
      });
  }, []); // Empty dependency array to run once when the component mounts

  return (
    <div>
      <h1>Test Route</h1>
      <p>Response from server: {response}</p>
    </div>
  );
};

export default Test;
