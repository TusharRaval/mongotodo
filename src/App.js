import React, { useState, useEffect } from "react";
import { FaTrash, FaCheck, FaPlus, FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Import axios for API requests
import "./App.css";

const API_URL = "http://localhost:5000/tasks"; // Adjust backend URL if needed

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [editing, setEditing] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [completedState, setCompletedState] = useState(false); // Track task completion status

    // Fetch tasks when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Add a new task
    const addTask = async () => {
        if (!title.trim()) return;
        try {
            const response = await axios.post(API_URL, { title });
            setTasks([...tasks, response.data]);
            setTitle(""); // Clear input
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

  // Edit task
const editTask = (id, title, completed) => {
  setEditing(id);
  setEditTitle(title);
  setCompletedState(completed);  // Set initial completed state when editing
};

// Save edited task
const saveTask = async () => {
  if (!editTitle.trim()) return;
  try {
      const response = await axios.put(`${API_URL}/${editing}`, { 
          title: editTitle,  // Update title
          completed: completedState // Include completion status if necessary
      });

      setTasks(tasks.map(task => (task._id === editing ? response.data : task)));
      setEditing(null);
      setEditTitle("");
      setCompletedState(false); // Reset completion state
  } catch (error) {
      console.error("Error updating task:", error);
  }
};

// Toggle task completion
const updateTask = async (id, completed) => {
  try {
      const response = await axios.put(`${API_URL}/${id}`, { 
          completed: !completed // Toggle completed status
      });

      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
  } catch (error) {
      console.error("Error updating task:", error);
  }
};

  
  

    // Delete task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">To-Do List</h2>

            <div className="input-group mb-3">
            <input
    type="text"
    className="form-control"
    placeholder={editing ? "Edit task..." : "Add a new task..."}
    value={editing ? editTitle : title}
    onChange={(e) => (editing ? setEditTitle(e.target.value) : setTitle(e.target.value))}
/>
<button className="btn btn-primary" onClick={editing ? saveTask : addTask}>
    {editing ? <FaEdit /> : <FaPlus />} {editing ? "Save" : "Add"}
</button>

            </div>

            <ul className="list-group">
                {tasks.map((task) => (
                    <li key={task._id} className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? "completed-task" : ""}`}>
                        <span className={task.completed ? "completed-text" : ""}>{task.title}</span>

                        <div className="btn-group">
                            <button className="btn btn-success m-1" onClick={() => updateTask(task._id, task.completed)}>
                                <FaCheck />
                            </button>
                            <button className="btn btn-warning m-1" onClick={() => editTask(task._id, task.title)}>
                                <FaEdit />
                            </button>
                            <button className="btn btn-danger m-1" onClick={() => deleteTask(task._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
