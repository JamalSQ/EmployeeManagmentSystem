import React, { useState } from "react";
import "./Home.css"; // Reuse the same styles

export default function Kontaktai() {
  const translations = {
    en: {
      title: "Contact Us",
      description:
        "Feel free to reach out if you have any questions or need more information.",
      contactInfo: "Contact Information",
      email: "Email",
      phone: "Phone",
      address: "Address",
      workHours: "Business Hours: Monday – Friday, 8:00 AM – 4:00 PM.",
      structure: "Organizational Structure",
      director: "Director",
      directorName: "Jonas Jonaitis",
      directorEmail: "direktorius@spcentras.lt",
      socialServices: "Social Services Department",
      socialServicesName: "Petras Petraitis",
      socialServicesEmail: "sp.skyrius@spcentras.lt",
      finance: "Finance Department",
      financeName: "Laura Laurienė",
      financeEmail: "finansai@spcentras.lt",
      techSupport: "Technical Support",
      techSupportName: "Jonas Jonka",
      techSupportEmail: "pagalba@spcentras.lt",
    },
    lt: {
      title: "Kontaktai",
      description:
        "Susisiekite su mumis, jeigu turite klausimų ar reikia daugiau informacijos.",
      contactInfo: "Kontaktinė informacija",
      email: "El. paštas",
      phone: "Telefonas",
      address: "Adresas",
      workHours: "Darbo laikas: Pirmadieniais – Penktadieniais, 8:00 – 16:00.",
      structure: "Organizacijos struktūra",
      director: "Direktorius",
      directorName: "Jonas Jonaitis",
      directorEmail: "direktorius@spcentras.lt",
      socialServices: "Socialinių paslaugų skyrius",
      socialServicesName: "Petras Petraitis",
      socialServicesEmail: "sp.skyrius@spcentras.lt",
      finance: "Finansų skyrius",
      financeName: "Laura Laurienė",
      financeEmail: "finansai@spcentras.lt",
      techSupport: "Techninė pagalba",
      techSupportName: "Jonas Jonka",
      techSupportEmail: "pagalba@spcentras.lt",
    },
  };

  const [language, setLanguage] = useState("lt"); // Default language is Lithuanian

  const toggleLanguage = () => {
    setLanguage(language === "lt" ? "en" : "lt");
  };

  const t = translations[language]; // Get the translation based on the current language

  return (
    <div className="container my-5">
      <button onClick={toggleLanguage} className="btn btn-secondary mb-4">
        Switch to {language === "lt" ? "English" : "Lietuvių"}
      </button>

      <h1 className="text-primary text-center mb-4">{t.title}</h1>
      <p className="text-center mb-5">{t.description}</p>

      {/* Centered Contact Information Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <h5 className="text-secondary text-center">{t.contactInfo}</h5>
          <ul className="list-unstyled text-center">
            <li>
              <strong>{t.email}:</strong>{" "}
              <a href="mailto:info@spcentras.lt">info@spcentras.lt</a>
            </li>
            <li>
              <strong>{t.phone}:</strong>{" "}
              <a href="tel:+37012345678">+370 1234 5678</a>
            </li>
            <li>
              <strong>{t.address}:</strong> Vilnius, Socialinės paslaugos g. 10,
              LT-12345
            </li>
          </ul>
          <p className="text-center">{t.workHours}</p>
        </div>
      </div>

      {/* Organizational Structure Section */}
      <div className="my-5">
        <h5 className="text-secondary">{t.structure}</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card shadow border-light">
              <div className="card-body text-center">
                <h6 className="card-title">{t.director}</h6>
                <p className="card-text">{t.directorName}</p>
                <p className="card-text">
                  <strong>{t.email}:</strong>{" "}
                  <a href={`mailto:${t.directorEmail}`}>{t.directorEmail}</a>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card shadow border-light">
              <div className="card-body text-center">
                <h6 className="card-title">{t.socialServices}</h6>
                <p className="card-text">{t.socialServicesName}</p>
                <p className="card-text">
                  <strong>{t.email}:</strong>{" "}
                  <a href={`mailto:${t.socialServicesEmail}`}>
                    {t.socialServicesEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card shadow border-light">
              <div className="card-body text-center">
                <h6 className="card-title">{t.finance}</h6>
                <p className="card-text">{t.financeName}</p>
                <p className="card-text">
                  <strong>{t.email}:</strong>{" "}
                  <a href={`mailto:${t.financeEmail}`}>{t.financeEmail}</a>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card shadow border-light">
              <div className="card-body text-center">
                <h6 className="card-title">{t.techSupport}</h6>
                <p className="card-text">{t.techSupportName}</p>
                <p className="card-text">
                  <strong>{t.email}:</strong>{" "}
                  <a href={`mailto:${t.techSupportEmail}`}>
                    {t.techSupportEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
