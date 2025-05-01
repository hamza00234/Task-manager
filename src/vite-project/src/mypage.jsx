import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/me", {
          withCredentials: true,
        });
        setUser(response.data);
        console.log("User details fetched:", response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Fetch tasks after user is set
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          setError(null);
          const response = await axios.get('http://localhost:5000/api/v1/tasks',
             {
            withCredentials: true,  // Ensure session cookie is sent
            headers: {
              'Cache-Control': 'no-cache', // Prevent caching of tasks
            },
          });
  
          console.log("Tasks fetched:", response.data);
          setTasks(response.data || []);
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setError("Failed to load tasks: " + (error.response?.data || error.message));
          setTasks([]); // Set empty tasks if error occurs
        }
      };
  
      fetchTasks();
    }
  }, [user]); // Re-fetch tasks when user state changes (on login)
  
  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/tasks/${taskId}`, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        // Remove task from state after successful deletion
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      } else {
        console.error("Unexpected response while deleting task:", response);
      }
      console.log("Task deleted:", response.data);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again later.");
    }
  };

  // Create new task
  const handleCreateTask = async () => {
    if (taskInput.trim()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/tasks",
          { description: taskInput, owner: user._id },
          { withCredentials: true }
        );
  
        if (response.status === 201) {
          setTasks([...tasks, response.data]);
          setTaskInput("");
        }
        console.log("Task created:", response.data);
        
      } catch (error) {
        alert("Failed to create task: " + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <header>
          <h1 className="text-4xl font-bold mb-2">🗂️ Task Manager</h1>
          <p className="text-gray-400">Welcome back, {user.name}!</p>
        </header>

        <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create a New Task</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your task..."
              className="flex-1 p-2 rounded bg-gray-700"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button onClick={handleCreateTask} className="bg-blue-600 px-4 py-2 rounded">
              Add Task
            </button>
          </div>
        </section>

        <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          {error && <p className="text-red-400">{error}</p>}
          {tasks.length === 0 ? (
  <p className="text-gray-400">No tasks created yet.</p>
) : (
  <ul className="space-y-2">
    {tasks.map((task) => (
      <li key={task._id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
        <span>{task.description}</span>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className="text-red-400 hover:text-red-600"
        >
          ❌
        </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default MainPage;
