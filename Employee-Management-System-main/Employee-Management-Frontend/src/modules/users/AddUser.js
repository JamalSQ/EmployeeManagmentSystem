import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

export default function AddUser() {
  let navigate = useNavigate();
  // const { login } = useAuth(); // Get the login function

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "", // Add an initial empty value
    phoneNumber: "",
    address: "",
  });

  const [error, setError] = useState("");

  const { name, username, email, password, role, phoneNumber, address } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/signup",
        user
      );

      console.log("Signup response:", response.data);

      if (response.data.status === "success") {
        // Use the login function from context instead of directly setting localStorage
        // login({
        //   token: response.data.token,
        //   username: response.data.username,
        //   role: response.data.role,
        //   userId: response.data.userId || response.data.id, // Try both fields
        // });

        // Redirect to home page
        navigate("/ViewAllUsers");
      }
    } catch (error) {
      console.error("Adding User error:", error);
      if (error.response && error.response.data) {
        setError(
          error.response.data.Error || "Error while adding the user failed"
        );
      } else {
        setError("nable to add the user");
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="m-4">Sign Up</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={(e) => onSubmit(e)}>
            <div className="row">
              <div className="mb-3 col-md-6 text-start">
                <label htmlFor="Name" className="form-label text-left">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <div className="mb-3 col-md-6 text-start">
                <label htmlFor="Username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter a username"
                  name="username"
                  value={username}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <div className="mb-3 col-md-6 text-start">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  className="form-select"
                  name="role"
                  value={role}
                  onChange={onInputChange}
                  required
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
              </div>

              <div className="mb-3 col-md-6 text-start">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your Phone No"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Address"
                  name="address" // Fixed: was "name" instead of "address"
                  value={address}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="Email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="Password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter a password"
                  name="password"
                  value={password}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
              <div className="mt-3">
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
