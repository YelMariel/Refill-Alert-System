import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleSwitch from './switch'; // Adjust the path to the actual location of your ToggleSwitch component


import styles from "../../styles/bg.module.css"; // Adjust the relative path to match your project structure

  


  const loadSavedTexts = () => {
    const savedTexts = localStorage.getItem('savedTexts');
    return savedTexts ? JSON.parse(savedTexts) : [];
  };

function DateTimeComponent() {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Function to update the full date and time
    function updateFullDateTime() {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };
      const dateTimeString = now.toLocaleDateString(undefined, options);
      setCurrentDateTime(dateTimeString);
    }

    // Update the full date and time initially and every second
    updateFullDateTime(); // Call the function initially
    const intervalId = setInterval(updateFullDateTime, 1000); // Update every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="position-absolute top-0 end-0 p-1">
      <p>{currentDateTime}</p>
    </div>
  );
}

export default function Dashboard({ user }) {
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    console.log('Before fetching data');
    axios.get('http://localhost:3003/status')
      .then(response => {
        console.log('After fetching data');
        console.log('Response:', response.data); // Log the response data
        setFetchedData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data from the API:', error);
      });
  }, []);
  
  
  
  
  
  const dateTimeContainerStyle = {
    position: 'relative',
    top: '20px',
    right: '20px',
    padding: '1px',
    
    color: 'black',
  };
  let roleName = '';
  switch (user.role) {
    case 'admin':
      roleName = 'Admin';
      break;
    case 'personnel':
      roleName = 'Personnel';
      break;
    case 'student':
      roleName = 'Student';
      break;
    default:
      roleName = 'User';
  }

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [inputText, setInputText] = useState(''); // State to store user input
  const [savedTexts, setSavedTexts] = useState([]); // State to store entered texts
  const [displayText, setDisplayText] = useState(''); // State to store the displayed text
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [maxRefills, setMaxRefills] = useState(0); // State to store the maximum refills

  useEffect(() => {
    // Load saved texts from local storage when the component mounts
    const loadedSavedTexts = loadSavedTexts();
    setSavedTexts(loadedSavedTexts);
  }, []);

  // Function to save the entered text to local storage
  const saveTextToLocalStorage = (texts) => {
    localStorage.setItem('savedTexts', JSON.stringify(texts));
  };

  // Function to handle changes in maximum refills
  const handleMaxRefillsChange = () => {
    // Implement the logic to change the maximum refills here
    console.log('Set maximum refills:', maxRefills);
  };

  const hoverStyles = {
    fontWeight: 'bold',
  };

  const customBorderStyle = {
    border: '1px solid #000', // Black border with 1px width
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };




  const handleDeleteText = (index) => {
    // Remove the saved text at the specified index
    const updatedTexts = [...savedTexts];
    updatedTexts.splice(index, 1);
    setSavedTexts(updatedTexts);
    // Save the updated texts to local storage
    saveTextToLocalStorage(updatedTexts);
  };
  const handleSaveText = () => {
    // Update the list of saved texts with the entered text
    const updatedTexts = [...savedTexts, inputText];
    setSavedTexts(updatedTexts);
    // Save the updated texts to local storage
    saveTextToLocalStorage(updatedTexts);

    // Close the modal
    setShowModal(false);
  };

  const renderSavedTexts = () => {
    const outerBoxStyle = {
      width: 'auto', // Adjust the width as needed
      height: 'auto', // Adjust the height as needed
      border: '1px solid #000',
      backgroundColor: '#D9D9D9',
      padding: '10px',
      margin: '10px', // Adjust the margin as needed
      borderRadius: '15px', // Adjust the borderRadius to your desired value
    };
  
    const innerBoxStyle = {
      width: '100%', // Make the inner box fill the outer box
      height: 'auto', // Make the inner box fill the outer box
      border: '1px solid #000',
      padding: '10px',
      backgroundColor: '#928C8C', // Adjust the background color as needed
      overflow: 'auto', // Add scrollbars if needed for long text
    };
  
    const textContainerStyle = {
      textAlign: 'center',
      fontSize: '16px', // Adjust font size
      fontWeight: 'bold', // Adjust font weight
      color: 'white', // Adjust text color
    };
  
    const statusTextStyle = {
      textAlign: 'center',
      fontSize: '15px', // Adjust font size
      fontWeight: 'bold', // Adjust font weight
      color: 'black', // Adjust text color
    };
  
    const buttonStyle = {
      marginLeft: 'auto',
      bottom: '10px', // Adjust the distance from the bottom as needed
      position: 'relative',
    };
  
    const additionalTextStyle = {
      display: 'flex',
      alignItems: 'center',
      marginTop: '20px',
      paddingTop: '10px', // Add padding for spacing
    };
  
    const boxInsideStyle = {
      width: '50px', // Adjust the width as needed
      height: '40px', // Adjust the height as needed
      border: '1px solid #000',
      backgroundColor: 'white',
    };
  
    return savedTexts.map((text, index) => (
      <div key={index} className="col-md-4 mb-3">
        <div style={outerBoxStyle}>
          <div style={innerBoxStyle}>
            <div style={textContainerStyle}>{text}</div>
          </div>
          <p style={statusTextStyle}>STATUS</p>
          <div style={additionalTextStyle}>
            <p style={{ color: 'black' }}>Remaining:</p>
            <div style={boxInsideStyle}>
              <p style={{ color: 'black' }}>{maxRefills}</p> {/* Display maximum refills here */}
            </div>
            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => handleDeleteText(index)}
              style={buttonStyle}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ));
  };
  

  
  
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="row">
            {renderSavedTexts()}
            <div className="col-md-4 mb-3">
              <button
                className="btn btn-primary btn-sm mt-2"
                style={{
                  width: '100px',  // Fixed width
                  height: '100px',  // Fixed height
                }}
                onClick={() => setShowModal(true)}
              >
                Add Dispenser
              </button>
            </div>
            {fetchedData.map((item) => (
                <div key={item.id}>
                  <p>ID: {item.id}</p>
                  <p>Water Level: {item.water_level}</p>
                </div>
              ))}

          </div>
        );

  case 'RefillLogs':
  return (
    <div>
      <h2 className="fw-bold fs-5">Refill Logs</h2>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Starting</th>
              <th>Total Refills</th>
              <th>Remaining Containers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-10-20</td>
              <td>User 1</td>
              <td>Dispenser 1</td>
              <td>50</td>
            </tr>
            <tr>
              <td>2023-10-19</td>
              <td>User 2</td>
              <td>Dispenser 2</td>
              <td>30</td>
            </tr>
            
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );

      case 'Change':
        return (
          <div>
            <h2 className="fw-bold fs-5">Set the Maximum Refills of each dispenser</h2>
            <div className="form-group">
              <label htmlFor="maxRefills"> Maximum Refills:</label>
              <input
                type="number"
                className="form-control"
                id="maxRefills"
                value={maxRefills}
                onChange={(e) => setMaxRefills(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleMaxRefillsChange}
              disabled={!maxRefills}
            >
              Change 
            </button>
          </div>
        );   
        case 'Switch':
          return (
            <div>
              <h2 className="fw-bold fs-5">Dispenser Switch</h2>
              <ToggleSwitch />
            </div>
          );
       
      }
  };

  return (
    <div className={styles.gradientBackground}> {/* Apply the CSS class here */}
      <h1> Welcome to {roleName} Page</h1>
      <div style={dateTimeContainerStyle}>
        <DateTimeComponent />
      </div>
      <div className="container-fluid mt-4">
        <div className="row">
        <div className="col-md-3" style={{ borderRight: '3px solid #000000', borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
            <ul className="nav flex-column " id="myTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`}
                  id="Dashboard-tab"
                  data-toggle="tab"
                  href="#Dashboard"
                  role="tab"
                  aria-controls="Dashboard"
                  aria-selected={activeTab === 'Dashboard'}
                  onClick={() => handleTabClick('Dashboard')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Dashboard</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'RefillLogs' ? 'active' : ''}`}
                  id="RefillLogs-tab"
                  data-toggle="tab"
                  href="#RefillLogs"
                  role="tab"
                  aria-controls="RefillLogs"
                  aria-selected={activeTab === 'RefillLogs'}
                  onClick={() => handleTabClick('RefillLogs')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Refill Logs</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Change' ? 'active' : ''}`}
                  id="Change-tab"
                  data-toggle="tab"
                  href="#Change"
                  role="tab"
                  aria-controls="Change"
                  aria-selected={activeTab === 'Change'}
                  onClick={() => handleTabClick('Change')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Change Refill Number</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Switch' ? 'active' : ''}`}
                  id="Switch-tab"
                  data-toggle="tab"
                  href="#Switch"
                  role="tab"
                  aria-controls="Switch"
                  aria-selected={activeTab === 'Switch'}
                  onClick={() => handleTabClick('Switch')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Dispenser Switch</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-9" style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', paddingTop: '100px'}}>
            <div style={{ marginLeft: '50px' }}>
              {renderTabContent()}
            </div>
            {activeTab === 'Dashboard' && (
              <div>
                {fetchedData.map((item) => (
                  <div key={item.id}>
                    <p>ID: {item.id}</p>
                    <p>Water Level: {item.water_level}</p>
                  </div>
                ))}
              </div>
            )}
         
          </div>
        </div>
      </div>
      {/* Modal for adding text */}
      {showModal && (
        <div className={`modal fade show`} tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
              <h5 className="modal-title" style={{ color: 'black' }}>Add Dispenser</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleModalClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                <label htmlFor="inputText" style={{ color: 'black' }}>Enter location:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputText"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{ color: 'black' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalClose}
                >
                  Close
                </button>
                <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (inputText) {
                    handleSaveText();
                    handleModalClose(); // Close the modal
                  }
                }}
                disabled={!inputText} // Disable the button if the input field is not filled
              >
                Update
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className={`modal-backdrop fade show`}></div>}
    </div>
  );
}
