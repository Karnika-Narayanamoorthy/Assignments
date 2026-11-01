import React, { useState, useEffect } from "react";
import "./App.css";


const API = "http://localhost:5000/api/tasks";

function App() {

    const [tasks, setTasks] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: ""
    });

    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);

    // GET ALL TASKS
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("Unable to fetch tasks");
            }

            const data = await response.json();

            setTasks(data);

        } catch (error) {
            console.error(error);
            alert(error.message);

        } finally {
            setLoading(false);
        }
    };

    // USE EFFECT HOOK
    useEffect(() => {
        fetchTasks();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ADD OR UPDATE TASK
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const url = editId
                ? `${API}/${editId}`
                : API;

            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            alert(data.message);

            resetForm();

            fetchTasks();

        } catch (error) {
            alert(error.message);
        }
    };

    // EDIT TASK
    const editTask = (task) => {

        setEditId(task._id);

        setForm({
            title: task.title,
            description: task.description || "",
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate
                ? task.dueDate.substring(0, 10)
                : ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // DELETE TASK
    const deleteTask = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert(data.message);

            fetchTasks();

        } catch (error) {
            alert(error.message);
        }
    };

    // RESET FORM
    const resetForm = () => {

        setEditId(null);

        setForm({
            title: "",
            description: "",
            priority: "Medium",
            status: "Pending",
            dueDate: ""
        });
    };

    // TASK COUNTS
    const completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    const pending = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const progress = tasks.filter(
        task => task.status === "In Progress"
    ).length;

    return (

        <div className="container">

            <header>
                <h1>Student Task Manager</h1>

                <p>
                    Organize your academic activities efficiently
                </p>
            </header>

            {/* STATISTICS */}

            <div className="stats">

                <div className="stat-card">
                    <h2>{tasks.length}</h2>
                    <p>Total Tasks</p>
                </div>

                <div className="stat-card">
                    <h2>{pending}</h2>
                    <p>Pending</p>
                </div>

                <div className="stat-card">
                    <h2>{progress}</h2>
                    <p>In Progress</p>
                </div>

                <div className="stat-card">
                    <h2>{completed}</h2>
                    <p>Completed</p>
                </div>

            </div>

            {/* TASK FORM */}

            <section className="form-section">

                <h2>
                    {editId ? "Edit Task" : "Add New Task"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Task Title</label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter task title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>

                    <textarea
                        name="description"
                        placeholder="Enter task description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <label>Priority</label>

                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <label>Completion Status</label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <label>Due Date</label>

                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                    />

                    <div className="form-buttons">

                        <button type="submit">
                            {editId ? "Update Task" : "Add Task"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="cancel"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </section>

            {/* TASK LIST */}

            <section className="tasks-section">

                <h2>My Tasks</h2>

                {loading ? (

                    <p>Loading tasks...</p>

                ) : tasks.length === 0 ? (

                    <p className="empty">
                        No tasks available. Add your first task!
                    </p>

                ) : (

                    <div className="task-list">

                        {tasks.map(task => (

                            <div
                                className="task-card"
                                key={task._id}
                            >

                                <h3>{task.title}</h3>

                                <p>{task.description}</p>

                                <p>
                                    Priority:
                                    <span className={`priority ${task.priority.toLowerCase()}`}>
                                        {task.priority}
                                    </span>
                                </p>

                                <p>
                                    Status:
                                    <span className="status">
                                        {task.status}
                                    </span>
                                </p>

                                <p>
                                    Due Date: {
                                        task.dueDate
                                            ? task.dueDate.substring(0, 10)
                                            : "Not set"
                                    }
                                </p>

                                <div className="actions">

                                    <button
                                        onClick={() => editTask(task)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete"
                                        onClick={() => deleteTask(task._id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default App;