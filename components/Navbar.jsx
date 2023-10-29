import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light"> {/* Apply Bootstrap classes */}
      <div className="container">
        <div className="row w-100">
          <div className="col-1 d-flex align-items-center ml-0 p-0 pt-3">
            <a>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/c/c8/Technological_University_of_the_Philippines_Seal.svg"
                alt="logo"
                style={{ width: "80px", height: "auto" }}
              />
            </a>
          </div>
          <div className="col-11 d-flex align-items-center justify-content-end">
            <p className="m-0" style={{ color: 'cardinalred', fontFamily: 'Times New Roman', fontSize: '30px' }}>
              TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES CAVITE CAMPUS
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
