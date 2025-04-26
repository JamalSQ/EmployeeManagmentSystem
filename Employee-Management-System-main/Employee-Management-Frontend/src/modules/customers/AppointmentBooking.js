import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AppointmentBooking = () => {
  const { auth, role, userId } = useAuth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    description: "",
  });

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!userId) {
      setError(
        "User ID is required. Please make sure you're logged in properly."
      );
      setLoading(false);
      return;
    }

    const dateTimeString = `${appointment.date}T${appointment.time}`;

    const appointmentData = {
      appointmentDate: dateTimeString,
      serviceType: appointment.description,
      status: "SCHEDULED",
      notes: "",
      treatmentDetails: "",
    };

    try {
      const response = await axios.post(
        `http://localhost:8080/customer/appointments?customerId=${userId}&employeeId=${selectedEmployeeId}`,
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log("Appointment booked:", response.data);
      setSuccess("Appointment booked successfully!");

      setAppointment({
        date: "",
        time: "",
        description: "",
      });
      setSelectedEmployeeId("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (role !== "CUSTOMER" && role !== "ADMIN") {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="text-danger mb-4">Access Denied</h2>
                <p className="text-muted">
                  Only customers can book appointments. Your current role is:{" "}
                  {role || "unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Book an Appointment
              </h2>

              {/* Debug info - only show in development */}
              {process.env.NODE_ENV === "development" && (
                <div className="alert alert-info small mb-4">
                  User ID: {userId || "Not found"} | Role: {role || "Not found"}
                </div>
              )}

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
                <div className="mb-3 text-start">
                  <label htmlFor="date" className="form-label">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={appointment.date}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please select a date for your appointment.
                  </div>
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="time" className="form-label">
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="time"
                    name="time"
                    value={appointment.time}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please select a time for your appointment.
                  </div>
                </div>

                <div className="mb-3 text-start">
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
                    Please select an employee for your appointment.
                  </div>
                </div>

                <div className="mb-4 text-start">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={appointment.description}
                    onChange={handleChange}
                    placeholder="Brief description of your appointment..."
                    required
                  ></textarea>
                  <div className="invalid-feedback">
                    Please provide a description for your appointment.
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
                        Booking...
                      </>
                    ) : (
                      "Book Appointment"
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

export default AppointmentBooking;
