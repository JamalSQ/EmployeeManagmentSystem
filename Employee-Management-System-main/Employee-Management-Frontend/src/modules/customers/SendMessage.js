import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SendMessage = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    subject: "",
    content: "",
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
      const response = await axios.get("http://localhost:8080/users");
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
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!selectedEmployeeId) {
      setError("Please select an employee to send the message to.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/customer/messages",
        message,
        {
          params: {
            senderId: userId,
            recipientId: selectedEmployeeId,
          },
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log("Message sent:", response.data);
      setSuccess("Message sent successfully!");
      setMessage({
        subject: "",
        content: "",
      });
      setSelectedEmployeeId("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
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
              <h2 className="card-title text-center mb-4">Send Message</h2>

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
                <div className="mb-4">
                  <label htmlFor="employeeId" className="form-label">
                    Select Employee
                  </label>
                  <select
                    className="form-select"
                    id="employeeId"
                    name="employeeId"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    required
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    Please select an employee to send the message to.
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={message.subject}
                    onChange={handleChange}
                    placeholder="Enter message subject..."
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a subject for your message.
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="5"
                    value={message.content}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                  <div className="invalid-feedback">
                    Please enter your message.
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
                        Sending...
                      </>
                    ) : (
                      "Send Message"
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

export default SendMessage;
