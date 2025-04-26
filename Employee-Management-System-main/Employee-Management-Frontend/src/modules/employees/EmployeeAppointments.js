import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeAppointments = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      setError("");
      const response = await axios.get(
        "http://localhost:8080/employee/appointments",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `http://localhost:8080/employee/appointments/${selectedAppointment.id}`,
        selectedAppointment,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setSuccess("Appointment updated successfully!");
      setShowViewModal(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update appointment. Please try again."
      );
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

  if (loading && appointments.length === 0) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Appointment Management</h2>
              </div>

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

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Service Type</th>
                      <th>Customer</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.serviceType}</td>
                        <td>{appointment.customer?.name || "Unknown"}</td>
                        <td>
                          {format(
                            new Date(appointment.appointmentDate),
                            "MMM dd, yyyy hh:mm a"
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.notes || "No notes"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowViewModal(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View/Edit Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateAppointment}>
                  <div className="mb-3">
                    <label htmlFor="serviceType" className="form-label">
                      Service Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="serviceType"
                      value={selectedAppointment.serviceType}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          serviceType: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="appointmentDate" className="form-label">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="appointmentDate"
                      value={format(
                        new Date(selectedAppointment.appointmentDate),
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          appointmentDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      value={selectedAppointment.status}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      rows="3"
                      value={selectedAppointment.notes || ""}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          notes: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="treatmentDetails" className="form-label">
                      Treatment Details
                    </label>
                    <textarea
                      className="form-control"
                      id="treatmentDetails"
                      rows="3"
                      value={selectedAppointment.treatmentDetails || ""}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          treatmentDetails: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <p>
                      <strong>Customer:</strong>{" "}
                      {selectedAppointment.customer?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Employee:</strong>{" "}
                      {selectedAppointment.employee?.name || "Not assigned"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {format(
                        new Date(selectedAppointment.createdAt),
                        "MMM dd, yyyy hh:mm a"
                      )}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {format(
                        new Date(selectedAppointment.updatedAt),
                        "MMM dd, yyyy hh:mm a"
                      )}
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowViewModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
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
                          Updating...
                        </>
                      ) : (
                        "Update Appointment"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAppointments;
