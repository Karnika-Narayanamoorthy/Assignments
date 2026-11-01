import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    department: "",
    email: ""
  });
  const [editId, setEditId] = useState(null);

  async function loadStudents() {
    const res = await fetch(API);
    setStudents(await res.json());
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(editId ? `${API}/${editId}` : API, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", regNo: "", department: "", email: "" });
    setEditId(null);
    loadStudents();
  }

  function editStudent(student) {
    setForm({
      name: student.name,
      regNo: student.regNo,
      department: student.department,
      email: student.email
    });
    setEditId(student._id);
  }

  async function deleteStudent(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadStudents();
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <h2>{editId ? "Update Student" : "Add Student"}</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Student Name"
          value={form.name} onChange={handleChange} required />

        <input name="regNo" placeholder="Register Number"
          value={form.regNo} onChange={handleChange} required />

        <input name="department" placeholder="Department"
          value={form.department} onChange={handleChange} required />

        <input name="email" type="email" placeholder="Email"
          value={form.email} onChange={handleChange} required />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>
      </form>

      <h2>Student Records</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Register No.</th>
            <th>Department</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.regNo}</td>
              <td>{student.department}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => editStudent(student)}>
                  Edit
                </button>
                <button onClick={() => deleteStudent(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;