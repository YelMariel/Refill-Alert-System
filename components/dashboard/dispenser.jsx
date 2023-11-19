import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [prevData, setPrevData] = useState([]);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:3002/stuffs")
      .then((res) => res.json())
      .then((newData) => {
        setLoading(false);
        if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
          setData(newData);
          setPrevData(newData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to render data for a specific ID
  const renderDataForId = (id) => {
    const filteredData = data.filter((value) => value.id === id);

    return (
      <div key={`container-${id}`}>
        <h2 className="fw-bold fs-10">Water Level (ID {id})</h2>
        {filteredData.map((value) => (
          <div key={value.id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <p>HIGH</p>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor:
                    value.water_level === "HIGH" ? "green" : "transparent",
                  borderRadius: "50%",
                  marginRight: "50px",
                  marginLeft: "50px",
                  border: "1px solid black",
                }}
              ></div>
              <p>LOW</p>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor:
                    value.water_level === "LOW" ? "red" : "transparent",
                  borderRadius: "50%",
                  border: "1px solid black",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Extract unique ids from the data
  const uniqueIds = [...new Set(data.map((item) => item.id))];

  return (
    <div>
      {uniqueIds.map((id) => renderDataForId(id))}
    </div>
  );
}
