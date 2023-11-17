import React, { useState } from 'react';
import Modal from 'react-modal';

function App() {
    const [ipAddress, setIpAddress] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [ipError, setIpError] = useState('');


    const handleIpAddressChange = (e) => {
        const enteredIp = e.target.value;
        setIpAddress(enteredIp);
    
        // Regular expression for a simple IP address validation
        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    
        if (!ipRegex.test(enteredIp)) {
            setIpError('Enter a valid IP address');
        } else {
            setIpError('');
        }
    };
    

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip_address: ipAddress }),
            });

            if (response.ok) {
                console.log('User registered successfully!');
                // Update the list of registered users
                setRegisteredUsers([...registeredUsers, ipAddress]);
                // Clear the input field after successful registration
                setIpAddress('');
            } else {
                console.error('Error registering user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleDelete = (index) => {
        // Display a confirmation dialog before proceeding
        const isConfirmed = window.confirm('Are you sure you want to delete this water dispenser?');
    
        if (isConfirmed) {
            // Create a copy of the registeredUsers array
            const updatedUsers = [...registeredUsers];
            // Remove the user at the specified index
            updatedUsers.splice(index, 1);
            // Update the state with the modified array
            setRegisteredUsers(updatedUsers);
        }
    };
    

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const customModalStyles = {
        content: {
            width: '50%', // Adjust the width as needed
            height: '20%', // Adjust the height as needed
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
    };
    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
    };
    const inputContainerStyle = {
        marginBottom: '20px', // Adjust the margin as needed
    };

    return (
        <div className="App">
            <h1>Device Registration</h1>
            <button onClick={toggleModal}>
                {showModal ? 'Close' : 'Add Water Dispenser'}
            </button>
            <Modal

                isOpen={showModal}
                onRequestClose={toggleModal}
                contentLabel="Registration"
                style={customModalStyles}
            >
                <div style={inputContainerStyle}>
                    <label>
                        IP Address:
                        <input type="text" value={ipAddress} onChange={handleIpAddressChange} />
                    </label>
                    {ipError && <p style={{ color: 'red' }}>{ipError}</p>}
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                    <button onClick={handleSubmit} disabled={!!ipError}>Register</button>
                </div>
                <button style={closeButtonStyle} onClick={toggleModal}>
                    Close
                </button>
            </Modal>


                 {/* Display the list of registered users in separate boxes */}
                 {registeredUsers.map((user, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
                    <h2>Water Dispenser {index + 1}</h2>
                    <p>{user}</p>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default App;
