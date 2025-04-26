import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, logout, role, userId } = useAuth();
  const navigate = useNavigate();

  // Debug console logs to check values
  useEffect(() => {
    console.log("Auth context values:", {
      token: auth?.token,
      username: auth?.username,
      role,
      userId,
    });
  }, [auth, role, userId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to={auth?.token ? "/dashboard" : "/"}>
          Employee Management System
        </Link>
        {/* Debug info */}

        <div
          style={{
            color: "white",
            fontSize: "16px",
            position: "absolute",
            right: "250px",
            top: "15px",
          }}
        >
          Role: {role || "none"} | ID: {userId || "none"}
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!auth?.token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/administracine-informacija">
                    ADMINISTRACINĖ INFORMACIJA
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/paslaugos">
                    PASLAUGOS
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/kontaktai">
                    KONTAKTAI
                  </Link>
                </li>
              </>
            )}

            {auth?.token && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/ViewAllUsers">
                    Users
                  </Link>
                </li>
              </>
            )}
            {role === "EMPLOYEE" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/tasks">
                    Task Management
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/calendar">
                    Calendar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/employee/task-list`}>
                    Tasks list
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/employee/documents`}>
                    Employee Documents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/employee/appointments`}>
                    Employee Appointments
                  </Link>
                </li>
              </>
            )}

            {auth?.token && role === "CUSTOMER" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/customer-dashboard/${userId || ""}`}
                  >
                    Customers
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex">
            {auth?.token ? (
              <>
                <span className="navbar-text me-3">
                  Welcome, {auth.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-outline-light" to="/signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
