const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/todo_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new task
app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title.trim()) {
            return res.status(400).json({ error: "Task title is required" });
        }
        const newTask = new Task({ title });
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Could not create task" });
    }
});

// Update a task (toggle completion)
/*app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Could not update task" });
    }
});*/
app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, 
            { 
                ...(title !== undefined && { title }), // Update title if provided
                ...(completed !== undefined && { completed }) // Update completed if provided
            }, 
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Could not update task" });
    }
});


// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Could not delete task" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
