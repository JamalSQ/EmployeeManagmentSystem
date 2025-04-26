import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function ViewUser() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/user/${id}`);
    setUser(result.data);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 border rounded p-4 mt-4 shadow-lg">
          <h2 className="text-center mb-4">User Details</h2>

          <div className="card">
            <div className="card-header text-center bg-primary text-white">
              <h5 className="m-0">Details of User with ID: {user.id}</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Name:</b> {user.name}
                </li>
                <li className="list-group-item">
                  <b>Username:</b> {user.username}
                </li>
                <li className="list-group-item">
                  <b>Email:</b> {user.email}
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-3">
            <Link
              className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"
              to={"/"}
            >
              <i className="fas fa-home"></i> Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
