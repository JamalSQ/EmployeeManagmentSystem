import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./Home.css"; // Add any necessary custom styling here.

export default function Home() {
  const [users, setUsers] = useState([]);

  const { id } = useParams();

  // Load users from backend
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/users");
    console.log(result);
    setUsers(result.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8080/user/${id}`);
    loadUsers();
  };

  return (
    <div>
      {/* Features Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Pagrindinės mūsų paslaugos</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/054/646/729/small/a-house-with-blue-and-white-abstract-shapes-photo.jpg"
                className="card-img-top"
                alt="Service 1"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Reikalinga pagalba namuose</h5>
                <Link to="/" className="btn btn-outline-primary">
                  Sužinoti daugiau
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/049/236/679/small/italian-food-icon-free-vector.jpg"
                className="card-img-top"
                alt="Service 2"
              />
              <div className="card-body text-center">
                <h5 className="card-title">Parama maisto produktais</h5>
                <Link to="/" className="btn btn-outline-primary">
                  Sužinoti daugiau
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/053/954/030/small/helping-icon-solid-icon-style-holding-hands-icon-related-to-donation-and-charity-donation-elements-illustration-vector.jpg"
                className="card-img-top"
                alt="Service 3"
              />
              <div className="card-body text-center">
                <h5 className="card-title">
                  Noriu gauti socialinės globos paslaugas
                </h5>
                <Link to="/" className="btn btn-outline-primary">
                  Sužinoti daugiau
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button for "Visos paslaugos" */}
      <div className="text-center mt-4">
        <Link to="/paslaugos" className="btn btn-primary btn-lg">
          Visos paslaugos
        </Link>
      </div>

      {/* Important Info Section */}
      <div className="important-info-box my-5">
        <div className="container">
          <div className="p-4 bg-primary text-white rounded shadow">
            <h5 className="fw-bold">SVARBU</h5>
            <p>
              Išmokų neadministruojame. Visais išmokų klausimais prašome
              kreiptis į Vilniaus miesto savivaldybės Socialinių išmokų skyrių{" "}
              <a
                href="https://sis.vilnius.lt"
                className="text-decoration-none text-white fw-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                sis.vilnius.lt
              </a>
            </p>
            <hr className="text-white" />
            <p>
              <img
                src="https://m.media-amazon.com/images/I/61NkQGj4F3L.jpg"
                alt="Ukraine Flag"
                className="ukraine-flag img-fluid"
                style={{
                  maxWidth: "50px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                }}
              />
              Įvykiai Ukrainoje: kur kreiptis norint padėti ar ieškant pagalbos.{" "}
              <a
                href="https://ukraina.vilnius.lt"
                className="text-decoration-none text-white fw-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Informacija: ukraina.vilnius.lt
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Susisiekite Section */}
      <div className="container my-5">
        <h3 className="text-center mb-4">Susisiekite</h3>
        <form
          className="p-4 rounded shadow-lg"
          style={{ background: "#f9f9f9" }}
        >
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">
                Vardas
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Jūsų vardas"
                style={{ padding: "15px", fontSize: "1rem" }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                El. paštas
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Jūsų el. pašto adresas"
                style={{ padding: "15px", fontSize: "1rem" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Žinutė
            </label>
            <textarea
              className="form-control"
              id="message"
              rows="4"
              placeholder="Jūsų žinutė"
              style={{ padding: "15px", fontSize: "1rem" }}
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                padding: "10px 30px",
                fontSize: "1.1rem",
              }}
            >
              Siųsti
            </button>
          </div>
        </form>
      </div>

      {/* Rekvizitai Section */}
      <div
        className="rekvizitai container text-center my-5 p-4 rounded shadow-sm"
        style={{ background: "#f9f9f9" }}
      >
        <h4>Rekvizitai</h4>
        <p className="mb-2">
          <strong>Vilniaus miesto socialinių paslaugų centras</strong>
        </p>
        <p>
          Sausio 13-osios g. 10, 04347 Vilnius
          <br />
          Tel.{" "}
          <a href="tel:+37052133663" className="text-decoration-none">
            +370 5 213 3663
          </a>
          <br />
          <a href="mailto:info@spcentras.lt" className="text-decoration-none">
            info@spcentras.lt
          </a>
        </p>
        <hr />
        <p className="mb-0">
          <strong>Darbo laikas:</strong> I - IV 7.30 - 16.30, V 7.30 - 15.15
          <br />
          <em>Pietų pertrauka:</em> 11.30 - 12.15
          <br />
          Kodas: 190997565
        </p>
      </div>
      {/* Footer */}
      <footer className="footer bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-1">
            Vilniaus miesto socialinių paslaugų centras &copy;{" "}
            {new Date().getFullYear()}
          </p>
          <p className="mb-0">
            Sukurta su ❤️ Vilniaus miesto bendruomenės gerovei.
          </p>
          <div className="social-icons mt-3">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2 text-decoration-none"
              style={{ fontSize: "1.2rem" }}
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2 text-decoration-none"
              style={{ fontSize: "1.2rem" }}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2 text-decoration-none"
              style={{ fontSize: "1.2rem" }}
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>

      {/* Footer, Contact Form, etc., remain the same or as per your customization */}
    </div>
  );
}
