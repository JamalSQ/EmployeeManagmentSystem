import React from "react";
import "./Home.css"; // Reuse existing styles to maintain consistency

export default function AdministracineInformacija() {
  return (
    <div className="container my-5">
      <h1 className="text-center text-primary mb-4">
        Administracinė informacija
      </h1>
      <div className="row">
        {/* Section 1 */}
        <div className="col-md-6">
          <h5 className="text-secondary">Teisės aktai ir kiti dokumentai</h5>
          <p>
            Čia rasite aktualią informaciją apie teisės aktus ir kitus
            dokumentus, kurie reglamentuoja mūsų įstaigos veiklą. Dokumentai yra
            nuolat atnaujinami pagal teisės aktų reikalavimus.
          </p>
          <ul>
            <li>
              <a
                href="https://example.com/document1.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Įstaigos nuostatai
              </a>
            </li>
            <li>
              <a
                href="https://example.com/document2.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ataskaitos ir planai
              </a>
            </li>
            <li>
              <a
                href="https://example.com/document3.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Atsakingų institucijų teisės aktai
              </a>
            </li>
          </ul>
        </div>
        {/* Section 2 */}
        <div className="col-md-6">
          <h5 className="text-secondary">Įstaigos kontaktinė informacija</h5>
          <p>
            Jei turite klausimų ar norite pasiteirauti dėl administracinės
            informacijos, kviečiame susisiekti:
          </p>
          <ul>
            <li>
              <strong>El. Paštas:</strong>{" "}
              <a href="mailto:info@spcentras.lt">info@spcentras.lt</a>
            </li>
            <li>
              <strong>Telefonas:</strong>{" "}
              <a href="tel:+37012345678">+370 1234 5678</a>
            </li>
            <li>
              <strong>Adresas:</strong> Vilnius, Socialinės paslaugos gatvė 10,
              LT-12345
            </li>
          </ul>
        </div>
      </div>
      {/* Section 3 */}
      <div className="my-5">
        <h5 className="text-secondary">Viešieji pirkimai</h5>
        <p>
          Viešieji pirkimai vykdomi laikantis LR teisės aktų reikalavimų. Tai
          leidžia užtikrinti skaidrumą ir efektyvų lėšų panaudojimą visose mūsų
          vykdomose veiklose.
        </p>
        <p>
          Informacija apie viešuosius pirkimus pateikiama pagal galiojančių
          teisės aktų numatytas formas.
        </p>
        <p>
          <a
            href="https://example.com/public_procurements"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Daugiau apie viešuosius pirkimus
          </a>
        </p>
      </div>
    </div>
  );
}
