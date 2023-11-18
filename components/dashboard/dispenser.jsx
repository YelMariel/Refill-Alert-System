import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [prevData, setPrevData] = useState(null);

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

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  const filteredData = data.filter((value) => value.id === 1);

  return (
    <div>
      {filteredData.map((value) => (
        <div key={value.id}>
          <h2 className="fw-bold fs-10">Water Level</h2>
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
}
  
