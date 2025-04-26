import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateTask = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    status: "PENDING",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }
    fetchEmployees();
  }, [auth, navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const employeeUsers = response.data.filter(
        (user) => user.role === "EMPLOYEE"
      );
      setEmployees(employeeUsers);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!selectedEmployeeId) {
      setError("Please select an employee to assign the task to.");
      setLoading(false);
      return;
    }

    // Format the date to match backend's LocalDateTime format
    const formattedDueDate = task.dueDate ? `${task.dueDate}T00:00:00` : null;

    // Format the task data to match backend expectations
    const taskData = {
      title: task.title,
      description: task.description,
      dueDate: formattedDueDate,
      priority: task.priority,
      status: task.status,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/employee/tasks",
        taskData,
        {
          params: {
            createdById: userId,
            assignedToId: selectedEmployeeId,
          },
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Task created:", response.data);
      setSuccess("Task created successfully!");

      // Reset form
      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
        status: "PENDING",
      });
      setSelectedEmployeeId("");
    } catch (error) {
      console.error("Error creating task:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create New Task</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="needs-validation"
                noValidate
              >
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Task Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter task title..."
                  />
                  <div className="invalid-feedback">
                    Please provide a task title.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={task.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter task description..."
                  ></textarea>
                  <div className="invalid-feedback">
                    Please provide a task description.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please select a due date.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">
                    Priority
                  </label>
                  <select
                    className="form-select"
                    id="priority"
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="assignedTo" className="form-label">
                    Assign To
                  </label>
                  <select
                    className="form-select"
                    id="assignedTo"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    required
                  >
                    <option value="">Select an employee...</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    Please select an employee to assign the task to.
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
