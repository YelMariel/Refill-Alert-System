import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';


const Disp = ({ data }) => {
  if (!data || (!Array.isArray(data) && !Array.isArray(data.data))) {
    // Handle the case where data is not an array (you might want to customize this based on your requirements)
    return <p>No data available</p>;
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const updatedData = Array.isArray(data)
        ? data.filter((item) => item.id !== id)
        : data.data.filter((item) => item.id !== id);
  
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const dataArray = Array.isArray(data) ? data : data.data;

 return (
    <div className="col-lg-6 col-md-12">
      <div className="row">
        {dataArray.map((value) => (
          <div className="col-lg-5 col-md-6 mb-4" key={value.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title"></h5>
                <div className="card-text">
                  <strong>Status:</strong>{" "}
                  <span id="status"></span>
                  <div className="d-flex justify-content-between mt-1">
                    <p>HIGH</p>
                    {/* Indicator for HIGH data */}
                    <div style={{ backgroundColor: value.water_level === "HIGH" ? "green" : "transparent", width: "50px", height: "20px", borderRadius: "50%", border: "2px solid darkgreen" }}></div>
                    <p>LOW</p>
                    {/* Indicator for LOW data */}
                    <div style={{ backgroundColor: value.water_level === "LOW" ? "red" : "transparent", width: "50px", height: "20px", borderRadius: "50%", border: "2px solid darkred" }}></div>
                  </div>
                </div>
                <div className="card-text">
                  <strong>Consumed:</strong>{" "}
                  <span id="label">{value.consumed}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}> <button onClick={() => handleDelete(value.id)}>Delete</button> </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalConsumed, setTotalConsumed] = useState(0);

  const fetchData = () => {
    fetch("http://localhost:3002/stuffs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((responseData) => {
        if (responseData && (Array.isArray(responseData) || Array.isArray(responseData.data))) {
          setData(responseData);
          // Calculate total consumed data
          const newTotalConsumed = responseData.reduce((acc, value) => acc + value.consumed, 0);
          setTotalConsumed(newTotalConsumed);
          setLoading(false);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(); // Initial data fetch

    // Set up an interval to fetch updated data every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="col-lg-6 col-md-12">
          {/* Add content for the left column if needed */}
        </div>
        <Disp data={data} />
        {/* Display total consumed data outside the Disp component */}
        <div className="col-lg-6 col-md-12">
          <h2>Total Consumed: {totalConsumed}</h2>

        </div>
      </div>
    </div>
  );
};

export default Home;
