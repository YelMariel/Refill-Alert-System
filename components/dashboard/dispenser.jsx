import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';
import Adding from '../components/Adddispensermodal';

const Disp = ({ data }) => {
  if (!data || (!Array.isArray(data) && !Array.isArray(data.data))) {
    // Handle the case where data is not an array (you might want to customize this based on your requirements)
    return <p>No data available</p>;
  }

  const dataArray = Array.isArray(data) ? data : data.data;

  return (
    <div className="col-lg-6 col-md-12 align-items-center">
      <div className="row">
        {dataArray.map((value) => (
          <div
            className="col-lg-4 col-md-6 col-sm-12 align-items-center"
            key={value.id}
          >
            <div className="card m-3">
              <div className="card-body">
                <h5 className="card-title">{value.ip_address}</h5>
                <div className="card-text">
                  <strong>Status:</strong>{" "}
                  <span id="status">{value.water_level}</span>
                </div>
                <div className="card-text">
                  <strong>Consumed:</strong>{" "}
                  <span id="label">{value.consumed}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div>
          
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/stuffs")
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="col-lg-6 col-md-12">
          {/* Add content for the left column if needed */}
        </div>
        <Disp data={data} />
      </div>
    </div>
  );
};

export default Home;
