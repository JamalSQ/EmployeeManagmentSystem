import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerCalendar = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }
  }, [auth, navigate]);

  const fetchCalendar = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `http://localhost:8080/customer/calendar/${userId}`,
        {
          params: {
            start: startDate,
            end: endDate,
          },
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching calendar:", error);
      setError("Failed to load calendar. Please try again later.");
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">My Calendar</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-grid mb-4">
                <button
                  onClick={fetchCalendar}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </>
                  ) : (
                    "View Calendar"
                  )}
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">
                    {loading
                      ? "Loading appointments..."
                      : "No appointments found for the selected date range."}
                  </p>
                </div>
              ) : (
                <div className="list-group">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <h5 className="mb-1">{appointment.serviceType}</h5>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="mb-1">
                        <strong>Date:</strong>{" "}
                        {format(
                          new Date(appointment.appointmentDate),
                          "MMMM d, yyyy h:mm a"
                        )}
                      </p>
                      <p className="mb-1">
                        <strong>Employee:</strong>{" "}
                        {appointment.employee?.name || "Not assigned"}
                      </p>
                      {appointment.notes && (
                        <p className="mb-1">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                      {appointment.treatmentDetails && (
                        <p className="mb-0">
                          <strong>Treatment Details:</strong>{" "}
                          {appointment.treatmentDetails}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCalendar;
