import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Disp from './dispenser';

function App() {
    const [ipAddress, setIpAddress] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [ipError, setIpError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [displayDisp, setDisplayDisp] = useState(true);
    const [dispenserData, setDispenserData] = useState({});

    const handleIpAddressChange = (e) => {
        const enteredIp = e.target.value;
        setIpAddress(enteredIp);

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
                setRegisteredUsers([ipAddress]);
                setIpAddress('');
                setRegistrationSuccess(true);
              
                
            } else {
                console.error('Error registering user.');
                setRegistrationSuccess(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setRegistrationSuccess(false);
        }
    };

    

    const toggleModal = () => {
        setShowModal(!showModal);
        setRegistrationSuccess(false);
    };

    const customModalStyles = {
        content: {
            width: '50%',
            height: '20%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
    };

    return (
        <div className="App">
            
            <button onClick={toggleModal}>
                {showModal ? 'Close' : 'Add Water Dispenser'}
            </button>
            <Modal
                isOpen={showModal}
                onRequestClose={toggleModal}
                contentLabel="Registration"
                style={customModalStyles}
            >
                <div>
                    <label>
                        IP Address:
                        <input type="text" value={ipAddress} onChange={handleIpAddressChange} />
                    </label>
                    {ipError && <p style={{ color: 'red' }}>{ipError}</p>}
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                    <button onClick={handleSubmit} disabled={!!ipError}>
                        Register
                    </button>
                </div>
                <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={toggleModal}>
                    Close
                </button>
            </Modal>


        </div>
    );
}

export default App;
