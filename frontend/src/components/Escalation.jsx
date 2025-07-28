import React, { useState } from 'react';
import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const Escalation = () => {
  const [showModal, setShowModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCallClick = () => {
    setShowModal(true);
    setError('');
    setSuccess(false);
    setStatusMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setIsCalling(false);
    setError('');
    setSuccess(false);
    setStatusMessage('');
  };

  const initiateCall = async (method) => {
    setIsCalling(true);
    setError('');
    setSuccess(false);
    setStatusMessage('Connecting...');

    try {
      const response = await fetch('http://localhost:8000/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });

      const result = await response.json();

      if (result.status.includes('Twilio')) {
        setStatusMessage('📞 Your call has been initiated successfully.');
        setSuccess(true);
      } else if (result.meet_link) {
        window.open(result.meet_link, '_blank');
        setShowModal(false);
      } else {
        setError('Call failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to initiate call.');
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCallClick}
        style={{
          backgroundColor: '#20bf6b',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          padding: '10px 20px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
        title="Escalate to an expert"
      >
        <FaPhoneAlt />
        Call an Expert
      </button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '420px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              width: '90%',
            }}
          >
            <h2 style={{ marginBottom: '10px' }}>Connect with a Human Expert</h2>
            <p style={{ marginBottom: '20px' }}>
              Choose your preferred method to escalate this conversation.
            </p>

            {isCalling && (
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: '#4b7bec' }}>
                <ImSpinner2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <span>{statusMessage}</span>
              </div>
            )}

            {success && (
              <p style={{ color: 'green', marginBottom: '10px' }}>{statusMessage}</p>
            )}

            {error && (
              <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
            )}

            {!success && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                <button
                  onClick={() => initiateCall('twilio')}
                  disabled={isCalling}
                  style={{
                    backgroundColor: '#4b7bec',
                    color: 'white',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isCalling ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaPhoneAlt />
                  {isCalling ? 'Calling...' : 'Phone Call'}
                </button>

                <button
                  onClick={() => initiateCall('meet')}
                  disabled={isCalling}
                  style={{
                    backgroundColor: '#2d98da',
                    color: 'white',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isCalling ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaVideo />
                  Google Meet
                </button>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{
                backgroundColor: '#d1d8e0',
                padding: '8px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Spinner animation style */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Escalation;
