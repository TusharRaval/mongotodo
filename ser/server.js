const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

console.log("🚀 Server script started...");

// Middleware
app.use(express.json());
app.use(cors());

console.log("🚀 Attempting to connect to MongoDB...");

mongoose.connect("mongodb://127.0.0.1:27017/todo_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if MongoDB fails
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req, res) => {
    const { title } = req.body;
    const newTask = new Task({ title });
    await newTask.save();
    console.log("🚀 New task added:", newTask);
    res.json(newTask);
});

// Update a task (toggle completion or edit title)
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    try {
        // Ensure both fields are handled (title and completed)
        const updatedTask = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });

        // Check if task is found and updated
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Could not update task" });
    }
});


// Update a task (toggle completion)
/*app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    
    res.json(updatedTask);
   // console.log("🚀 Task updated:", updatedTask);
});
app.put("/tasks/:id", async (req, res) => {
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

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    console.log("🚀 Task deleted:", id);
    res.json({ message: "Task deleted" });
});


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
