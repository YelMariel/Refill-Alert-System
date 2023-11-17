import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleSwitch from './switch'; // Adjust the path to the actual location of your ToggleSwitch component
import Disp from '../../components/dispenser';
import styles from "../../styles/bg.module.css"; // Adjust the relative path to match your project structure
import Change from '../../components/postreq';
import Logs from '../../components/inventory';
import Adding from '../../components/Adddispensermodal'



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
  const [maxRefills, setMaxRefills] = useState(0); // State to store the maximum refills
  const [showRegisterBox, setShowRegisterBox] = useState(false);

  const handleRegisterButtonClick = () => {
    // Perform your registration logic here
    // For now, let's just toggle the visibility of the box
    setShowRegisterBox(!showRegisterBox);

  };

  // Function to save the entered text to local storage
  const saveTextToLocalStorage = (texts) => {
    localStorage.setItem('savedTexts', JSON.stringify(texts));
  };

  // Function to handle changes in maximum refills
  const handleMaxRefillsChange = () => {
    // Implement the logic to change the maximum refills here
    console.log('Set maximum refills:', maxRefills);
  };

 
  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="row">
            <Disp /> 
            {renderSavedTexts()}
            <Adding/>
       </div>
        );

  case 'RefillLogs':
  return (
    <div>
      <h2 className="fw-bold fs-10">Refill Logs</h2>
      <Logs/>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button>ADD WATER CONTAINER</button>
        <button>Inventory</button>
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
            <Change/>
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
            {activeTab === 'Dashboard' 
            
            }
         
          </div>
        </div>
      </div>

    </div>
  );
}
