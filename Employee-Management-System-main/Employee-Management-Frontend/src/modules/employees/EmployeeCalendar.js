import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeCalendar = () => {
  const { auth, userId } = useAuth();
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState({
    tasks: [],
    appointments: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }
    fetchCalendarData();
  }, [auth, navigate, selectedMonth]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError("");

      const startDate = format(startOfMonth(selectedMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(selectedMonth), "yyyy-MM-dd");

      const response = await axios.get(
        `http://localhost:8080/employee/calendar/${userId}`,
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

      setCalendarData(response.data);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setError("Failed to load calendar data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (increment) => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setSelectedMonth(newDate);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning";
      case "IN_PROGRESS":
        return "bg-info";
      case "COMPLETED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      case "SCHEDULED":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const getEventTypeBadge = (type) => {
    switch (type) {
      case "task":
        return "bg-primary";
      case "appointment":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const renderCalendarDays = () => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    const days = [];
    let currentDate = start;

    while (currentDate <= end) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const dayTasks = calendarData.tasks.filter(
        (task) => format(new Date(task.dueDate), "yyyy-MM-dd") === dateStr
      );
      const dayAppointments = calendarData.appointments.filter(
        (appointment) =>
          format(new Date(appointment.appointmentDate), "yyyy-MM-dd") ===
          dateStr
      );

      const isSelected = isSameDay(currentDate, selectedDate);
      const isCurrentMonth = isSameMonth(currentDate, selectedMonth);

      days.push(
        <div
          key={dateStr}
          className={`calendar-day ${isSelected ? "selected" : ""} ${
            !isCurrentMonth ? "other-month" : ""
          }`}
          onClick={() => setSelectedDate(currentDate)}
        >
          <div className="day-number">{format(currentDate, "d")}</div>
          <div className="events">
            {dayTasks.map((task) => (
              <div
                key={`task-${task.id}`}
                className="event task"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick({ ...task, type: "task" });
                }}
              >
                {task.title}
              </div>
            ))}
            {dayAppointments.map((appointment) => (
              <div
                key={`appointment-${appointment.id}`}
                className="event appointment"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick({ ...appointment, type: "appointment" });
                }}
              >
                {appointment.serviceType}
              </div>
            ))}
          </div>
        </div>
      );

      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return days;
  };

  if (loading) {
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
                <h2 className="card-title mb-0">Employee Calendar</h2>
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="date"
                    className="form-control"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                  />
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleMonthChange(-1)}
                    >
                      Previous Month
                    </button>
                    <button className="btn btn-primary" disabled>
                      {format(selectedMonth, "MMMM yyyy")}
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleMonthChange(1)}
                    >
                      Next Month
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="calendar-grid">
                <div className="calendar-header">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="calendar-header-day">
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="calendar-body">{renderCalendarDays()}</div>
              </div>

              <style jsx>{`
                .calendar-grid {
                  display: grid;
                  grid-template-rows: auto 1fr;
                  gap: 1rem;
                }
                .calendar-header {
                  display: grid;
                  grid-template-columns: repeat(7, 1fr);
                  text-align: center;
                  font-weight: bold;
                  padding: 0.5rem;
                  background-color: #f8f9fa;
                  border-radius: 0.25rem;
                }
                .calendar-body {
                  display: grid;
                  grid-template-columns: repeat(7, 1fr);
                  gap: 0.5rem;
                }
                .calendar-day {
                  min-height: 100px;
                  padding: 0.5rem;
                  border: 1px solid #dee2e6;
                  border-radius: 0.25rem;
                  cursor: pointer;
                }
                .calendar-day.selected {
                  background-color: #e7f1ff;
                  border-color: #0d6efd;
                }
                .calendar-day.other-month {
                  background-color: #f8f9fa;
                  color: #6c757d;
                }
                .day-number {
                  font-weight: bold;
                  margin-bottom: 0.5rem;
                }
                .events {
                  display: flex;
                  flex-direction: column;
                  gap: 0.25rem;
                }
                .event {
                  padding: 0.25rem;
                  border-radius: 0.25rem;
                  font-size: 0.875rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .event.task {
                  background-color: #e7f1ff;
                  color: #0d6efd;
                }
                .event.appointment {
                  background-color: #d1e7dd;
                  color: #0f5132;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedEvent.type === "task"
                    ? "Task Details"
                    : "Appointment Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Title:</strong>{" "}
                      {selectedEvent.title || selectedEvent.serviceType}
                    </p>
                    <p>
                      <strong>Description:</strong> {selectedEvent.description}
                    </p>
                    {selectedEvent.type === "task" && (
                      <>
                        <p>
                          <strong>Status:</strong>
                          <span
                            className={`badge ${getStatusBadgeClass(
                              selectedEvent.status
                            )} ms-2`}
                          >
                            {selectedEvent.status}
                          </span>
                        </p>
                        <p>
                          <strong>Due Date:</strong>{" "}
                          {format(
                            new Date(selectedEvent.dueDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </>
                    )}
                    {selectedEvent.type === "appointment" && (
                      <>
                        <p>
                          <strong>Status:</strong>
                          <span
                            className={`badge ${getStatusBadgeClass(
                              selectedEvent.status
                            )} ms-2`}
                          >
                            {selectedEvent.status}
                          </span>
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {format(
                            new Date(selectedEvent.appointmentDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {format(
                            new Date(selectedEvent.appointmentDate),
                            "hh:mm a"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Assigned To:</strong>{" "}
                      {selectedEvent.assignedTo?.name || "Unassigned"}
                    </p>
                    <p>
                      <strong>Created By:</strong>{" "}
                      {selectedEvent.createdBy?.name || "Unknown"}
                    </p>
                    {selectedEvent.type === "appointment" && (
                      <>
                        <p>
                          <strong>Customer:</strong>{" "}
                          {selectedEvent.customer?.name || "Unknown"}
                        </p>
                        <p>
                          <strong>Employee:</strong>{" "}
                          {selectedEvent.employee?.name || "Not assigned"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCalendar;
