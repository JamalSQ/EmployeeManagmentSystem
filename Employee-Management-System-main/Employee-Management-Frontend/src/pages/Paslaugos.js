import React from "react";
import "./Home.css"; // Reuse the same styles for consistency

export default function Paslaugos() {
  return (
    <div className="container my-5">
      <h1 className="text-primary text-center mb-4">Mūsų Paslaugos</h1>
      <p className="text-center mb-5">
        Siūlome platų socialinių paslaugų spektrą, skirtą patenkinti
        individualius poreikius ir užtikrinti bendruomenės gerovę.
      </p>

      <div className="row">
        {/* Service 1 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">1. Pagalba namuose</h5>
              <p className="card-text">
                Individuali pagalba asmenims, kuriems reikia paramos atliekant
                kasdienes užduotis, tokias kaip skalbimas, maisto gaminimas ar
                apsipirkimas.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 2 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">2. Parama maistu</h5>
              <p className="card-text">
                Maisto produktų dalinimas tiems, kurie susiduria su sunkumais
                aprūpinti save ar šeimą būtiniausiais maisto produktais.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 3 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">
                3. Socialinių įgūdžių ugdymas
              </h5>
              <p className="card-text">
                Mokymai ir seminarai, padedantys asmenims tobulinti socialinius
                įgūdžius ir labiau integruotis į visuomenę.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 4 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">4. Globos paslaugos</h5>
              <p className="card-text">
                Visapusiška globos ir priežiūros paslauga tiems, kuriems
                reikalinga nuolatinė socialinė priežiūra.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 5 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">
                5. Transporto paslaugos
              </h5>
              <p className="card-text">
                Transporto paslaugos, skirtos asmenims, kuriems reikia nuvežti į
                gydymo įstaigas ar kitus svarbius objektus.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 6 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">
                6. Psichologinė pagalba
              </h5>
              <p className="card-text">
                Profesionalios psichologų konsultacijos bei emocinė parama
                individams ir šeimoms.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 7 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">
                7. Krizių valdymo centras
              </h5>
              <p className="card-text">
                Specializuotos konsultacijos ir pagalba asmenims, patiriantiems
                sudėtingas gyvenimiškas situacijas ar krizes.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>

        {/* Service 8 */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">8. Pagalba senjorams</h5>
              <p className="card-text">
                Specialios paslaugos senjorams, užtikrinančios jų gerovę ir
                paramą, skirtas oriam gyvenimui.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Sužinoti daugiau
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
