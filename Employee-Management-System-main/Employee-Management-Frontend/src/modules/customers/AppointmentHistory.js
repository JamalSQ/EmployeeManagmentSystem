import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";

const AppointmentHistory = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [auth, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/customer/appointments/history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setAppointments(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointment history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-primary";
      case "COMPLETED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);

    if (filter === "upcoming") {
      return appointmentDate >= now && appointment.status === "SCHEDULED";
    } else if (filter === "past") {
      return appointmentDate < now || appointment.status !== "SCHEDULED";
    }
    return true;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2">Appointment History</h1>
            <div className="btn-group">
              <button
                onClick={() => setFilter("all")}
                className={`btn ${
                  filter === "all" ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`btn ${
                  filter === "upcoming" ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`btn ${
                  filter === "past" ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">
                No appointments found for the selected filter.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">
                            {appointment.serviceType}
                          </h5>
                          <p className="card-text text-muted mb-2">
                            <strong>Date:</strong>{" "}
                            {format(
                              new Date(appointment.appointmentDate),
                              "MMMM d, yyyy h:mm a"
                            )}
                          </p>
                          <p className="card-text text-muted">
                            <strong>Employee:</strong>{" "}
                            {appointment.employee?.name || "Not assigned"}
                          </p>
                        </div>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      {appointment.notes && (
                        <div className="mt-3">
                          <p className="card-text">{appointment.notes}</p>
                        </div>
                      )}
                      {appointment.treatmentDetails && (
                        <div className="mt-3">
                          <h6 className="card-subtitle mb-2 text-muted">
                            Treatment Details:
                          </h6>
                          <p className="card-text">
                            {appointment.treatmentDetails}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
